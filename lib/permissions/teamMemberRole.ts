/**
 * 팀 멤버십 역할(백엔드 String/향후 enum 공통).
 * GraphQL이 enum으로 바뀌어도 스칼라는 문자열로 오므로 여기서만 정규화합니다.
 */
export type TeamMemberRole = "player" | "manager" | "coach";

/** 알 수 없는 값은 일반 멤버로 간주 (최소 권한 원칙) */
export function parseTeamMemberRole(
  raw: string | null | undefined,
): TeamMemberRole {
  const n = raw?.trim().toLowerCase();
  if (n === "manager" || n === "coach" || n === "player") {
    return n;
  }
  return "player";
}

/** 팀 관리 페이지·메뉴 등 스태프 전용 기능 (player 제외) */
export function canUseTeamManagementStaffFeatures(
  role: TeamMemberRole,
): boolean {
  return role !== "player";
}

/** 경기 등록 등 운영자 기능 (현재 정책: player 제외) */
export function canRegisterGameForRole(role: TeamMemberRole): boolean {
  return role !== "player";
}
