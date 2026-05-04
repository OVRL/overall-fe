/**
 * 인앱 WebView URL 기준으로 네이티브 하단 탭 네브바를 노출할지 판별한다.
 *
 * 노출 대상은 `NativeLiquidBottomNav` 의 네 탭(홈·선수 기록·경기 기록·내 정보)과
 * 동일한 경로 트리로 맞춘다. 해당 구간에서는 사용자가 하단으로 주요 섹션을 옮겨 다닐 때
 * 네브바가 사라지지 않도록 한다.
 *
 * 웹 하단 예약 패딩: `apps/web/lib/native/nativeLiquidBottomNavShellPaths.ts` 와 동기화.
 */

/** 탭 "홈" — `(main)/page.tsx` */
function isHomeShellPath(p: string): boolean {
  return p === "/";
}

/** 탭 "선수 기록" — `/team-data` 및 하위 */
function isTeamDataShellPath(p: string): boolean {
  return p === "/team-data" || p.startsWith("/team-data/");
}

/** 탭 "경기 기록" — `/match-record` 및 하위 */
function isMatchRecordShellPath(p: string): boolean {
  return p === "/match-record" || p.startsWith("/match-record/");
}

/** 탭 "내 정보" — `/profile` 및 하위 */
function isProfileShellPath(p: string): boolean {
  return p === "/profile" || p.startsWith("/profile/");
}

export function isNativeBottomNavVisiblePath(pathname: string): boolean {
  if (pathname === "") return false;
  const normalized = pathname.replace(/\/+$/, "") || "/";

  return (
    isHomeShellPath(normalized) ||
    isTeamDataShellPath(normalized) ||
    isMatchRecordShellPath(normalized) ||
    isProfileShellPath(normalized)
  );
}
