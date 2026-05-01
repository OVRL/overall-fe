import { isSameWebAppOrigin } from "@/lib/webViewViewportSync";

/** OAuth 전용 WebView가 로그인 완료 랜딩에 도달했는지 (쿠키 동기화 트리거용) */
export function isPostAuthWebAppPath(url: string, webOrigin: string): boolean {
  try {
    if (!isSameWebAppOrigin(url, webOrigin)) return false;
    const u = new URL(url);
    if (u.searchParams.get("error")) return false;
    const p = u.pathname;
    return (
      p === "/" ||
      p.startsWith("/home") ||
      p === "/social/login-handoff" ||
      p === "/privacy-consent"
    );
  } catch {
    return false;
  }
}
