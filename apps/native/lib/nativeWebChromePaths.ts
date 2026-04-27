/**
 * 웹 `apps/web/lib/native/nativeWebChromePaths.ts` 와 동일 규칙.
 * WebView URL 기준으로 네이티브 크롬 잔류를 제거할 때 사용한다.
 */

/** `app/(main)/layout.tsx` — `Header variant="global"` */
export function isMainAppShellPath(pathname: string | null): boolean {
  if (pathname == null || pathname === "") return false;
  if (pathname === "/") return true;
  if (
    pathname.startsWith("/team-data/") ||
    pathname === "/team-data"
  ) {
    return true;
  }
  if (
    pathname.startsWith("/profile/") ||
    pathname === "/profile"
  ) {
    return true;
  }
  if (
    pathname.startsWith("/team-management/") ||
    pathname === "/team-management"
  ) {
    return true;
  }
  if (
    pathname.startsWith("/match-record/") ||
    pathname === "/match-record"
  ) {
    return true;
  }
  if (pathname === "/mom" || pathname.startsWith("/mom/")) {
    return true;
  }
  if (pathname.startsWith("/player/")) {
    return true;
  }
  return false;
}

/** `@/components/Header` TopbarHeader — 온보딩·팀 생성 */
export function isSharedHeaderTopbarPath(pathname: string | null): boolean {
  if (pathname == null || pathname === "") return false;
  if (pathname === "/onboarding" || pathname.startsWith("/onboarding/")) {
    return true;
  }
  if (pathname === "/create-team" || pathname.startsWith("/create-team/")) {
    return true;
  }
  return false;
}
