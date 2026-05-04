/**
 * 리퀴드 하단 탭 노출에서 제외할 경로.
 *
 * @see apps/web/lib/native/nativeLiquidNavTabExcludedPaths.ts — 로직 동기화
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
