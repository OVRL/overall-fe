import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import type { WebView } from "react-native-webview";
import type { NativeWebChrome } from "@/types/nativeChrome";
import { inferWebViewChromeModeFromUrl } from "@/lib/inferWebViewChromeModeFromUrl";
import {
  INJECT_SYNC_WEBVIEW_VIEWPORT_HEIGHT,
  isSameWebAppOrigin,
} from "@/lib/webViewViewportSync";
import {
  clearNativeAuthStorage,
  persistAuthCookiesFromWebView,
  shouldClearNativeAuthFromNavigation,
  shouldSyncCookiesFromWebView,
} from "@/lib/nativeWebSession";
import { reduceNativeChromeForPathname } from "@/lib/reduceNativeChromeForPathname";

export type MainAppWebViewNavigationContext = {
  webOrigin: string;
  setChromeMode: Dispatch<SetStateAction<"safe" | "fullscreen">>;
  setNativeChrome: Dispatch<SetStateAction<NativeWebChrome | null>>;
  syncViewportInjectTimerRef: MutableRefObject<ReturnType<
    typeof setTimeout
  > | null>;
  getWebView: () => WebView | null;
};

/** 메인 WebView `onNavigationStateChange` — 크롬 모드·네이티브 헤더 정리·뷰포트·세션 동기화 */
export function handleMainAppWebViewNavigationStateChange(
  ctx: MainAppWebViewNavigationContext,
  navState: { url: string; loading?: boolean },
): void {
  const url = navState.url;
  ctx.setChromeMode(inferWebViewChromeModeFromUrl(url, ctx.webOrigin));

  if (isSameWebAppOrigin(url, ctx.webOrigin)) {
    try {
      const path = new URL(url).pathname;
      ctx.setNativeChrome((prev) => reduceNativeChromeForPathname(prev, path));
    } catch {
      /* 잘못된 URL 무시 */
    }
  }

  if (
    isSameWebAppOrigin(url, ctx.webOrigin) &&
    !navState.loading &&
    ctx.getWebView()
  ) {
    if (ctx.syncViewportInjectTimerRef.current != null) {
      clearTimeout(ctx.syncViewportInjectTimerRef.current);
    }
    ctx.syncViewportInjectTimerRef.current = setTimeout(() => {
      ctx.syncViewportInjectTimerRef.current = null;
      ctx.getWebView()?.injectJavaScript(INJECT_SYNC_WEBVIEW_VIEWPORT_HEIGHT);
    }, 80);
  }

  if (shouldClearNativeAuthFromNavigation(url)) {
    void (async () => {
      try {
        await clearNativeAuthStorage();
      } catch (e) {
        console.warn("[Native] 로그아웃 동기화(저장소 비우기) 실패:", e);
      }
    })();
    return;
  }

  if (shouldSyncCookiesFromWebView(url, ctx.webOrigin)) {
    void (async () => {
      try {
        await persistAuthCookiesFromWebView(ctx.webOrigin);
      } catch (e) {
        console.warn("[Native] 쿠키→SecureStore 동기화 실패:", e);
      }
    })();
  }
}
