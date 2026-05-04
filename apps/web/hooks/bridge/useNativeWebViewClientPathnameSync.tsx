"use client";

import { useEffect } from "react";
import { useBridge } from "@/hooks/bridge/useBridge";

/**
 * 인앱에서 Next.js 클라이언트 라우트(`usePathname`)를 네이티브 `webPathname`과 맞춘다.
 * WebView `onNavigationStateChange`는 풀 리로드 위주로 갱신되어, `/` → `/login/social` 같은
 * 소프트 네비게이션 시 하단 탭이 홈으로 오인될 수 있다.
 */
export function useNativeWebViewClientPathnameSync(pathname: string | null) {
  const { isNativeApp, sendToNative } = useBridge();

  useEffect(() => {
    if (!isNativeApp) return;
    sendToNative({
      type: "SYNC_WEBVIEW_CLIENT_PATHNAME",
      payload: { pathname: pathname ?? "" },
    });
  }, [isNativeApp, pathname, sendToNative]);
}
