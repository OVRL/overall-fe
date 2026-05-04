import type { NavItemConfig } from "./navConfig";
import { NAV_ITEMS } from "./navConfig";

/**
 * 경로를 정규화한다(끝 슬래시 제거, 빈 문자열은 `/`).
 */
export function normalizePath(p: string): string {
  if (!p || p === "") return "/";
  const noTrail = p.replace(/\/+$/, "");
  return noTrail === "" ? "/" : noTrail;
}

/**
 * 탭 활성 여부 — 홈은 정확히 `/`, 나머지는 해당 세그먼트 prefix 로 매칭한다.
 */
export function isTabActive(pathname: string, item: NavItemConfig): boolean {
  const p = normalizePath(pathname);
  if (item.id === "home") return p === "/";
  if (item.id === "player")
    return p === "/team-data" || p.startsWith("/team-data/");
  if (item.id === "match")
    return p === "/match-record" || p.startsWith("/match-record/");
  if (item.id === "profile")
    return p === "/profile" || p.startsWith("/profile/");
  return false;
}

/**
 * 현재 경로에 해당하는 탭 인덱스(0..NAV_ITEMS.length-1). 매칭 없으면 0.
 */
export function getActiveTabIndex(pathname: string): number {
  for (let i = 0; i < NAV_ITEMS.length; i++) {
    if (isTabActive(pathname, NAV_ITEMS[i])) return i;
  }
  return 0;
}
