/**
 * 리퀴드 하단 탭·패딩·모달 오버레이 브리지에서 **제외**할 경로.
 * Next.js 클라이언트 라우팅만 일어날 때 WebView `url`이 `/`에 머무는 경우가 있어,
 * `SYNC_WEBVIEW_CLIENT_PATHNAME`으로 실제 pathname이 들어와도 이 목록이면 탭을 노출하지 않는다.
 *
 * @see apps/web/lib/routes.ts 의 GUEST_ONLY / 온보딩 동선과 맞출 것
 */

/**
 * 로그인·가입·온보딩·소셜 콜백 등 — 리퀴드 탭이 있으면 안 되는 경로인지
 */
export function isNativeLiquidNavTabExcludedPath(pathname: string): boolean {
  if (pathname === "") return true;
  const p = pathname.replace(/\/+$/, "") || "/";

  if (p === "/login" || p.startsWith("/login/")) return true;
  if (p.startsWith("/social/")) return true;
  if (p === "/join-team" || p.startsWith("/join-team/")) return true;
  if (p === "/create-team" || p.startsWith("/create-team/")) return true;
  if (p === "/onboarding" || p.startsWith("/onboarding/")) return true;

  return false;
}
