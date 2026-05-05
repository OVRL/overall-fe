import { useEffect, useState } from "react";
import { injectStoredAuthCookiesForWebView } from "@/lib/nativeWebSession";
import { splashBootLog } from "@/lib/splashBootDebug";

/**
 * WebView를 띄우기 전에 SecureStore → CookieManager 주입 (RNWebView 스펙 Step 2).
 * @param webOrigin getWebAppOrigin() 과 동일한 값을 넘길 것
 */
export function useWebViewPreAuth(webOrigin: string): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const t0 = Date.now();
      splashBootLog("cookie_inject_start", { webOrigin });
      try {
        await injectStoredAuthCookiesForWebView(webOrigin);
        splashBootLog("cookie_inject_done", { ms: Date.now() - t0 });
      } catch (e) {
        splashBootLog("cookie_inject_error", {
          ms: Date.now() - t0,
          message: e instanceof Error ? e.message : String(e),
        });
        console.warn("[Native] WebView 사전 쿠키 주입 실패:", e);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [webOrigin]);

  return ready;
}
