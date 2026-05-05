/** 웹 `NativeWebViewViewportSync` 와 동일: WKWebView innerHeight 로 --app-inner-h 갱신 */
export const INJECT_SYNC_WEBVIEW_VIEWPORT_HEIGHT = `(function(){
  try {
    var h = window.innerHeight;
    document.documentElement.style.setProperty('--app-inner-h', h + 'px');
    window.dispatchEvent(new Event('resize'));
  } catch (_) {}
  true;
})();`;

/**
 * WebView URL이 앱이 부여한 `webOrigin`과 동일한 "웹앱"인지 판별한다.
 * 프로덕션에서 apex(`ovr-log.com`)↔`www` 리다이렉트가 있으면 `URL.origin`만 비교하면
 * 항상 불일치해 첫 로드 완료·스플래시 해제가 막히므로, 호스트에서 한 번만 `www.`를 제거해 비교한다.
 */
export function isSameWebAppOrigin(url: string, appOrigin: string): boolean {
  try {
    const a = new URL(url);
    const b = new URL(appOrigin);
    if (a.origin === b.origin) return true;
    const stripWww = (h: string) => h.replace(/^www\./i, "");
    const sameProtocol = a.protocol === b.protocol;
    const samePort = a.port === b.port;
    const sameHost = stripWww(a.hostname) === stripWww(b.hostname);
    return sameProtocol && samePort && sameHost;
  } catch {
    return false;
  }
}
