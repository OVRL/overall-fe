export type HomeRosterMountPolicyInput = {
  hasSelectedTeam: boolean;
  /** `max-lg` 스택 레이아웃으로 간주되는 뷰포트 */
  isLayoutMobile: boolean;
  /** 관찰 루트가 뷰포트와 교차함 (한 번 true면 유지) */
  isInView: boolean;
  /** 팀 ID가 한 번이라도 바뀌면 true — 뷰포트 지연 우회 */
  unblockAfterTeamSwitch: boolean;
};

/**
 * 홈 로스터 패널(무거운 Relay 서브트리)을 마운트할지 여부.
 * 팀 미선택 시에는 가벼운 안내문만 필요하므로 항상 마운트합니다.
 */
export function computeShouldMountHomeRosterPanel(
  input: HomeRosterMountPolicyInput,
): boolean {
  if (!input.hasSelectedTeam) return true;
  if (!input.isLayoutMobile) return true;
  return input.isInView || input.unblockAfterTeamSwitch;
}
