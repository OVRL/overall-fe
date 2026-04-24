import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import { Linking } from "react-native";
import { BridgeMessage, BridgeResponse } from "../types/bridge";
import type { NativeTopBarState } from "../types/nativeTopBar";
import type { NativeWebChrome } from "../types/nativeChrome";
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
    /** 탑바·글로벌 헤더 중 하나만 표시 — null 이면 둘 다 숨김 */
    onSetNativeWebChrome?: (chrome: NativeWebChrome | null) => void;
    /**
     * 숨김 브리지가 탑바/글로벌 서로를 덮어쓰지 않도록, 해당 모드일 때만 chrome 을 제거한다.
     * 미지정 시 기존처럼 `onSetNativeWebChrome(null)` 로 전체를 비운다.
     */
    onClearNativeWebChromeIfMode?: (mode: "global" | "topbar") => void;
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

      case "SET_NATIVE_TOPBAR": {
        if (payload?.visible !== true) {
          if (options?.onClearNativeWebChromeIfMode) {
            options.onClearNativeWebChromeIfMode("topbar");
          } else {
            options?.onSetNativeWebChrome?.(null);
          }
          break;
        }
        const next: NativeTopBarState = {
          transparent: Boolean(payload.transparent),
          title: typeof payload.title === "string" ? payload.title : null,
          centerMatchLineupLogo: payload.centerMatchLineupLogo === true,
          showLeft: payload.showLeft !== false,
          rightMode: payload.rightMode === "label" ? "label" : "none",
          rightLabel:
            typeof payload.rightLabel === "string" ? payload.rightLabel : null,
          rightDisabled: payload.rightDisabled === true,
        };
        options?.onSetNativeWebChrome?.({ mode: "topbar", topbar: next });
        break;
      }

      case "SET_NATIVE_GLOBAL_HEADER": {
        if (payload?.visible !== true) {
          if (options?.onClearNativeWebChromeIfMode) {
            options.onClearNativeWebChromeIfMode("global");
          } else {
            options?.onSetNativeWebChrome?.(null);
          }
          break;
        }
        options?.onSetNativeWebChrome?.({
          mode: "global",
          global: {
            showHamburger: payload.showHamburger !== false,
          },
        });
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
