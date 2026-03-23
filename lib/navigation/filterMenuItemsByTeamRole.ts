/** 헤더 등에서 사용: 팀 관리 메뉴 href */
export const TEAM_MANAGEMENT_MENU_HREF = "/team-management";

export type NavMenuItem = { label: string; href: string };

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
