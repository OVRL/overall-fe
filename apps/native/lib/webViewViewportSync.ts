/** 웹 `NativeWebViewViewportSync` 와 동일: WKWebView innerHeight 로 --app-inner-h 갱신 */
export const INJECT_SYNC_WEBVIEW_VIEWPORT_HEIGHT = `(function(){
  try {
    var h = window.innerHeight;
    document.documentElement.style.setProperty('--app-inner-h', h + 'px');
    window.dispatchEvent(new Event('resize'));
  } catch (_) {}
  true;
})();`;

export function isSameWebAppOrigin(url: string, appOrigin: string): boolean {
  try {
    return new URL(url).origin === new URL(appOrigin).origin;
  } catch {
    return false;
  }
}
