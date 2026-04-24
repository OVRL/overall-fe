import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import { Linking } from "react-native";
import { BridgeMessage, BridgeResponse } from "../types/bridge";
import { handleGetLocation } from "./locationHandler";
import { router } from "expo-router";
import { CommonActions } from "@react-navigation/native";
import { incrementStackDepth, decrementStackDepth } from "./navigationStack";

export const handleBridgeMessage = async (
  webviewRef: React.RefObject<WebView>,
  message: BridgeMessage,
  navigation?: any,
  options?: {
    onSetWebViewChrome?: (mode: "safe" | "fullscreen") => void;
  }
) => {
  const { type, payload, reqId } = message;

  const sendResponse = (responsePayload: any, responseType?: string) => {
    if (!webviewRef.current) return;
    const response: BridgeResponse = {
      type: responseType || `${type}_RESPONSE`,
      payload: responsePayload,
      reqId,
    };
    const injectedJS = `
      window.postMessage(JSON.stringify(${JSON.stringify(response)}), '*');
    `;
    webviewRef.current.injectJavaScript(injectedJS);
  };

  try {
    switch (type) {
      case "GET_PUSH_TOKEN": {
        // Expo 푸시(Android FCM)는 EAS projectId와 연결된 토큰이 필요합니다.
        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ??
          Constants.easConfig?.projectId;
        if (!projectId) {
          sendResponse(
            {
              error:
                "EAS projectId가 없습니다. app.json의 extra.eas.projectId를 확인하세요.",
            },
            "ERROR"
          );
          break;
        }
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId,
        });
        sendResponse({ token: tokenData.data });
        break;
      }

      case "VIBRATE":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;

      case "OPEN_SETTINGS":
        await Linking.openSettings();
        break;

      case "GET_LOCATION": {
        const locationResult = await handleGetLocation();
        sendResponse(locationResult, "LOCATION_RESULT");
        break;
      }

      case "ROUTE_CHANGE": {
        const { url, action } = payload || {};
        console.log(`[Bridge] Route Change: ${action} to ${url}`);

        if (action === "PUSH" && url) {
          const state = navigation?.getState();
          if (state && state.routes.length >= 10) {
            console.log("[Bridge] Rolling stack: removing oldest screen.");
            // 현재 스택의 맨 앞(index 0)을 제외한 나머지 + 새로운 경로로 리셋
            // Expo Router에서는 파일 경로가 곧 라우트 이름입니다.
            const newRoutes = state.routes.slice(1).map((r: any) => ({
              name: r.name,
              params: r.params,
            }));
            newRoutes.push({
              name: "webview",
              params: { url },
            });

            navigation.dispatch(
              CommonActions.reset({
                ...state,
                index: newRoutes.length - 1,
                routes: newRoutes,
              })
            );
          } else {
            incrementStackDepth();
            router.push({ pathname: "/webview" as any, params: { url } });
          }
        } else if (action === "REPLACE" && url) {
          router.replace({ pathname: "/webview" as any, params: { url } });
        } else if (action === "BACK") {
          decrementStackDepth();
          router.back();
        }
        break;
      }

      case "SET_WEBVIEW_CHROME": {
        const mode = payload?.chromeMode;
        if (mode === "safe" || mode === "fullscreen") {
          options?.onSetWebViewChrome?.(mode);
        } else {
          console.warn("[Bridge] Invalid chromeMode:", mode);
        }
        break;
      }

      case "OPEN_CAMERA":
        // This usually triggers a Native UI component or navigates to a Camera screen.
        // For simplicity in this handler, we might just signal that we are ready,
        // but the actual Camera UI needs to be handled by the React component state.
        // We will delegate this specific action to the component via a callback pattern if needed,
        // or assumes this handler is part of a custom hook that checks state.
        // For now, let's just log or send a specific event back to the Native Component?
        // Actually, this function should probably return an action to the component.
        // Since we are decoupling, maybe we return a "side effect" description?
        break;

      default:
        console.warn(`Unhandled Bridge Action: ${type}`);
    }
  } catch (error) {
    console.error("Bridge Error:", error);
    sendResponse({ error: String(error) }, "ERROR");
  }
};
