import type { Role } from "@/__generated__/findTeamMemberQuery.graphql";

/**
 * 팀 멤버십 역할 — GraphQL `Role` enum과 동일한 리터럴(대문자).
 * Relay `Role`에는 `%future added value`가 포함될 수 있어, 앱 내부에서는 이 타입으로 좁혀 씁니다.
 */
export type TeamMemberRole = "COACH" | "MANAGER" | "PLAYER";

/**
 * Relay/네트워크에서 온 `Role`을 앱 표준 `TeamMemberRole`로 정규화합니다.
 * 알 수 없는 enum 값은 최소 권한(PLAYER)으로 처리합니다.
 */
export function teamMemberRoleFromGraphQL(role: Role): TeamMemberRole {
  switch (role) {
    case "COACH":
      return "COACH";
    case "MANAGER":
      return "MANAGER";
    case "PLAYER":
      return "PLAYER";
    default:
      return "PLAYER";
  }
}

/** `teamMemberRoleFromGraphQL`과 동일 (레거시 이름·SSR 등 기존 호출부 호환) */
export const parseTeamMemberRole = teamMemberRoleFromGraphQL;

/** 팀 관리 페이지·메뉴 등 스태프 전용 기능 (PLAYER 제외) */
export function canUseTeamManagementStaffFeatures(
  role: TeamMemberRole,
): boolean {
  return role !== "PLAYER";
}

/** 경기 등록 등 운영자 기능 (현재 정책: PLAYER 제외) */
export function canRegisterGameForRole(role: TeamMemberRole): boolean {
  return role !== "PLAYER";
}
