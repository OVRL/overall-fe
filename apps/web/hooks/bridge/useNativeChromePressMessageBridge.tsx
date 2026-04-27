"use client";

import { useEffect } from "react";
import { useBridge } from "@/hooks/bridge/useBridge";
import { tryHandleNativeTopBarPressFromMessageData } from "@/lib/native/nativeTopBarPressBridge";
import { tryHandleNativeGlobalHeaderPressFromMessageData } from "@/lib/native/nativeGlobalHeaderPressBridge";

/**
 * RN WebView 가 `injectJavaScript` 로 보낸 postMessage 를 받아
 * 네이티브 탑바·글로벌 헤더 버튼 프레스를 웹 브리지 핸들러로 넘긴다.
 * 인앱 여부(`isNativeApp`)는 트랜지션 플랫폼 판별 등에 그대로 쓸 수 있게 반환한다.
 */
export function useNativeChromePressMessageBridge() {
  const { isNativeApp } = useBridge();

  useEffect(() => {
    if (!isNativeApp) return;
    const onMessage = (event: MessageEvent) => {
      tryHandleNativeTopBarPressFromMessageData(event.data);
      tryHandleNativeGlobalHeaderPressFromMessageData(event.data);
    };
    window.addEventListener("message", onMessage);
    document.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("message", onMessage);
    };
  }, [isNativeApp]);

  return { isNativeApp };
}
