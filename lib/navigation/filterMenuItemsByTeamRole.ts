/** 헤더 등에서 사용: 팀 관리 메뉴 href */
export const TEAM_MANAGEMENT_MENU_HREF = "/team-management";

export type NavMenuItem = { label: string; href: string };

/**
 * 글로벌 헤더 메뉴 활성 여부. 팀 관리는 `/team-management/*` 하위 경로에서도 활성으로 둡니다.
 */
export function isHeaderNavItemActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (
    href === TEAM_MANAGEMENT_MENU_HREF &&
    pathname.startsWith(`${TEAM_MANAGEMENT_MENU_HREF}/`)
  ) {
    return true;
  }
  return false;
}

/**
 * player 등 팀 관리 비허용 역할일 때 팀 관리 항목만 제거합니다. (순수 함수 — SRP)
 */
export function filterMenuItemsForStaffTeamManagement(
  items: readonly NavMenuItem[],
  canAccessTeamManagement: boolean,
): NavMenuItem[] {
  if (canAccessTeamManagement) {
    return [...items];
  }
  return items.filter((i) => i.href !== TEAM_MANAGEMENT_MENU_HREF);
}
