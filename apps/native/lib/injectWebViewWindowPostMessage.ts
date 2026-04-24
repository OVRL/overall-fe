import type { WebView } from "react-native-webview";

/** 웹 `window.postMessage(JSON.stringify(payload), '*')` 주입 */
export function injectWebViewWindowPostMessage(
  webView: WebView | null,
  message: unknown,
): void {
  if (!webView) return;
  const script = `window.postMessage(JSON.stringify(${JSON.stringify(
    message,
  )}), '*'); true;`;
  webView.injectJavaScript(script);
}
