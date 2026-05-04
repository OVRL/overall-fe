import { useEffect, useState, useCallback, useRef } from "react";
import { isNativeWebViewUserAgent } from "@/lib/native/webViewUserAgent";
import type {
  BridgeMessage,
  BridgeResponse,
  BridgeResponseType,
  WebViewChromeMode,
} from "./bridgeTypes";

export type {
  BridgeActionType,
  BridgeMessage,
  BridgeResponse,
  BridgeResponseType,
  WebViewChromeMode,
} from "./bridgeTypes";

/** 네이티브 리퀴드 FAB(+) → 웹 경기 등록 모달 (RN은 `injectJavaScript`로 동일 type 문자열 전달) */
export { NATIVE_LIQUID_NAV_FAB_PRESS_TYPE } from "@/lib/native/nativeLiquidNavFabPressBridge";

export const useBridge = () => {
  const pendingToNativeRef = useRef<BridgeMessage[]>([]);

  const [isNativeApp, setIsNativeApp] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        isNativeWebViewUserAgent(navigator.userAgent) ||
        !!window.ReactNativeWebView
      );
    }
    return false;
  });

  useEffect(() => {
    if (!isNativeApp) {
      const timer = setTimeout(() => {
        if (typeof window !== "undefined" && window.ReactNativeWebView) {
          setIsNativeApp(true);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isNativeApp]);

  const flushPendingToNative = useCallback(() => {
    if (typeof window === "undefined" || !window.ReactNativeWebView) return;
    const batch = pendingToNativeRef.current;
    if (batch.length === 0) return;
    pendingToNativeRef.current = [];
    for (const message of batch) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    if (!isNativeApp) return;
    flushPendingToNative();
    const id = window.setInterval(flushPendingToNative, 50);
    return () => window.clearInterval(id);
  }, [isNativeApp, flushPendingToNative]);

  const sendToNative = useCallback((message: BridgeMessage) => {
    if (typeof window === "undefined") return;
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
      return;
    }
    if (isNativeWebViewUserAgent(navigator.userAgent)) {
      pendingToNativeRef.current.push(message);
      return;
    }
    console.warn(
      "[Bridge] Not running in a Native WebView. Message ignored:",
      message,
    );
  }, []);

  const requestWithResponse = useCallback(
    <T,>(
      message: BridgeMessage,
      expectedResponseType: BridgeResponseType,
      timeoutMs: number = 5000,
    ): Promise<T> => {
      return new Promise((resolve, reject) => {
        if (typeof window === "undefined" || !window.ReactNativeWebView) {
          return reject(new Error("Not running in a Native WebView"));
        }

        const reqId = message.reqId || Math.random().toString(36).substring(7);
        const requestMessage = { ...message, reqId };

        const timer = setTimeout(() => {
          window.removeEventListener("message", listener);
          document.removeEventListener("message", listener);
          reject(new Error("Bridge request timed out"));
        }, timeoutMs);

        const listener = (event: MessageEvent) => {
          try {
            const dataStr =
              typeof event.data === "string" ? event.data : undefined;
            if (!dataStr) return;

            const data = JSON.parse(dataStr) as BridgeResponse<T>;

            if (data && data.reqId === reqId) {
              clearTimeout(timer);
              window.removeEventListener("message", listener);
              document.removeEventListener("message", listener);

              if (data.type === "ERROR" || data.error) {
                reject(new Error(data.error || "Unknown Native error"));
              } else if (data.type === expectedResponseType) {
                resolve(data.payload as T);
              }
            }
          } catch {
            // 다른 메시지 파싱 오류 무시
          }
        };

        window.addEventListener("message", listener);
        document.addEventListener("message", listener);

        sendToNative(requestMessage);
      });
    },
    [sendToNative],
  );

  const getLocation = useCallback(() => {
    return requestWithResponse<{ latitude: number; longitude: number }>(
      { type: "GET_LOCATION" },
      "LOCATION_RESULT",
    );
  }, [requestWithResponse]);

  const getPushToken = useCallback(() => {
    return requestWithResponse<{ token: string }>(
      { type: "GET_PUSH_TOKEN" },
      "PUSH_TOKEN_RESULT",
    );
  }, [requestWithResponse]);

  const requestPermissions = useCallback(
    (payload: { permissions: string[] }) => {
      return requestWithResponse<{ status: string }>(
        { type: "REQUEST_PERMISSIONS", payload },
        "PERMISSIONS_RESULT",
      );
    },
    [requestWithResponse],
  );

  const openPhotoPicker = useCallback(() => {
    return requestWithResponse<{ base64: string; mimeType: string }>(
      { type: "OPEN_PHOTO_PICKER" },
      "PHOTO_PICKER_RESULT",
      600000,
    );
  }, [requestWithResponse]);

  const setWebViewChrome = useCallback(
    (mode: WebViewChromeMode) => {
      sendToNative({
        type: "SET_WEBVIEW_CHROME",
        payload: { chromeMode: mode },
      });
    },
    [sendToNative],
  );

  return {
    isNativeApp,
    sendToNative,
    requestWithResponse,
    getLocation,
    getPushToken,
    requestPermissions,
    openPhotoPicker,
    setWebViewChrome,
  };
};
