/**
 * 네이티브 `NativeLiquidBottomNav`(리퀴드 하단 탭)이 노출되는 URL 과 동일한지 판별한다.
 * 해당 구간에서만 웹 콘텐츠에 하단 예약 패딩을 준다.
 *
 * @see apps/native/lib/isNativeBottomNavVisiblePath.ts — 로직 변경 시 **반드시** 양쪽 동기화
 */

import { isNativeLiquidNavTabExcludedPath } from "./nativeLiquidNavTabExcludedPaths";

function isHomeShellPath(p: string): boolean {
  return p === "/";
}

function isTeamDataShellPath(p: string): boolean {
  return p === "/team-data" || p.startsWith("/team-data/");
}

function isMatchRecordShellPath(p: string): boolean {
  return p === "/match-record" || p.startsWith("/match-record/");
}

function isProfileShellPath(p: string): boolean {
  return p === "/profile" || p.startsWith("/profile/");
}

/**
 * 홈·선수 기록·경기 기록·내 정보 탭 셸(및 하위 경로)인지 여부
 */
export function isNativeLiquidBottomNavShellPath(pathname: string): boolean {
  if (pathname === "") return false;
  const normalized = pathname.replace(/\/+$/, "") || "/";

  if (isNativeLiquidNavTabExcludedPath(normalized)) return false;

  return (
    isHomeShellPath(normalized) ||
    isTeamDataShellPath(normalized) ||
    isMatchRecordShellPath(normalized) ||
    isProfileShellPath(normalized)
  );
}
