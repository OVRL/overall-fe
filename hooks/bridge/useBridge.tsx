import { useEffect, useState, useCallback } from "react";

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
  interface DocumentEventMap {
    message: MessageEvent;
  }
}

// 요청 타입 (Web -> Native)
export type BridgeActionType =
  | "GET_PUSH_TOKEN"
  | "OPEN_CAMERA"
  | "REQUEST_PERMISSIONS"
  | "VIBRATE"
  | "OPEN_SETTINGS"
  | "GET_LOCATION"
  | "ROUTE_CHANGE";

// 응답 타입 (Native -> Web)
export type BridgeResponseType =
  | "PUSH_TOKEN_RESULT"
  | "LOCATION_RESULT"
  | "PERMISSIONS_RESULT"
  | "ERROR";

interface BridgeMessage<T = unknown> {
  type: BridgeActionType | BridgeResponseType;
  payload?: T;
  reqId?: string;
}

interface BridgeResponse<T = unknown> extends BridgeMessage<T> {
  error?: string;
}

export const useBridge = () => {
  const [isNativeApp, setIsNativeApp] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        navigator.userAgent.includes("Overall_RN") ||
        !!window.ReactNativeWebView
      );
    }
    return false;
  });

  useEffect(() => {
    // User-Agent나 window.ReactNativeWebView가 뒤늦게 주입되는 경우를 위한 fallback
    if (!isNativeApp) {
      const timer = setTimeout(() => {
        if (typeof window !== "undefined" && window.ReactNativeWebView) {
          setIsNativeApp(true);
        }
      }, 50); // 안전한 스케줄링을 위해 짧은 지연 시간 추가
      return () => clearTimeout(timer);
    }
  }, [isNativeApp]);

  const sendToNative = useCallback((message: BridgeMessage) => {
    if (typeof window !== "undefined" && window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    } else {
      console.warn(
        "[Bridge] Not running in a Native WebView. Message ignored:",
        message,
      );
    }
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
            // The data arrives as a string containing a JSON string, or just a JSON string
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
            // Ignore parsing errors for other messages
          }
        };

        window.addEventListener("message", listener);
        // Required for Android compatibility
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

  return {
    isNativeApp,
    sendToNative,
    requestWithResponse,
    getLocation,
    getPushToken,
    requestPermissions,
  };
};

