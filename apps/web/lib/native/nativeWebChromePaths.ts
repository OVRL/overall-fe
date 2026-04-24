/**
 * 인앱 WebView 에서 네이티브 상단 크롬(글로벌 헤더 / 공유 Topbar)을
 * **웹과 같은 URL 에서만** 남기기 위한 경로 판별.
 *
 * `@/components/Header` 사용처와 반드시 맞출 것:
 * - `variant="global"` → `isMainAppShellPath`
 * - TopbarHeader(기본 variant) → `isSharedHeaderTopbarPath`
 *
 * 포메이션 등 **로컬 `Header`** 는 브리지 미연동이므로 여기 포함하지 않음.
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

/**
 * `@/components/Header` 의 TopbarHeader 만 쓰는 라우트
 * (`OnboardingFunnelWrapper`, `CreateTeamWrapper`).
 */
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
