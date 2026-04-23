"use client";

import { useEffect } from "react";
import { useBridge, type WebViewChromeMode } from "./useBridge";

/**
 * 인앱(WebView)에서만 네이티브 Safe Area(상단) 적용 여부를 페이지 단위로 제어한다.
 *
 * - safe: 상태바 아래부터 시작(상단 Safe Area 적용)
 * - fullscreen: 상단까지 확장(언더 상태바)
 */
export function useWebViewChromeMode(mode: WebViewChromeMode) {
  const { isNativeApp, setWebViewChrome } = useBridge();

  useEffect(() => {
    if (!isNativeApp) return;
    setWebViewChrome(mode);
    return () => {
      // 페이지를 벗어나면 기본값으로 복원 (예상치 못한 누수 방지)
      setWebViewChrome("safe");
    };
  }, [isNativeApp, mode, setWebViewChrome]);
}

