"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/** WKWebView에서 OAuth 복귀 등 이후 layout 뷰포트와 innerHeight 불일치 보정 */
function applyNativeViewportHeight() {
  if (typeof document === "undefined") return;
  if (document.documentElement.getAttribute("data-native-webview") !== "true") {
    return;
  }
  document.documentElement.style.setProperty(
    "--app-inner-h",
    `${window.innerHeight}px`,
  );
}

/**
 * 인앱 WebView 전용: CSS `100dvh`/`100vh`와 실제 `window.innerHeight`를 맞춤.
 * 히스토리(back)·외부 도메인 복귀 후 하단 빈 영역 완화.
 */
export function NativeWebViewViewportSync() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (document.documentElement.getAttribute("data-native-webview") !== "true") {
      return;
    }

    applyNativeViewportHeight();

    const onResize = () => applyNativeViewportHeight();
    window.addEventListener("resize", onResize);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", onResize);
    vv?.addEventListener("scroll", onResize);

    const onPageShow = () => applyNativeViewportHeight();
    window.addEventListener("pageshow", onPageShow);

    const t1 = window.setTimeout(applyNativeViewportHeight, 50);
    const t2 = window.setTimeout(applyNativeViewportHeight, 200);

    return () => {
      window.removeEventListener("resize", onResize);
      vv?.removeEventListener("resize", onResize);
      vv?.removeEventListener("scroll", onResize);
      window.removeEventListener("pageshow", onPageShow);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  useLayoutEffect(() => {
    applyNativeViewportHeight();
  }, [pathname]);

  return null;
}
