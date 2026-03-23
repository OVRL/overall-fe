import type { findTeamMemberQuery$data } from "@/__generated__/findTeamMemberQuery.graphql";
import { isSameTeamId } from "@/lib/relay/parseRelayGlobalId";
import {
  parseTeamMemberRole,
  type TeamMemberRole,
} from "@/lib/permissions/teamMemberRole";

type TeamMemberRow = findTeamMemberQuery$data["findTeamMember"][number];

/**
 * findTeamMember 목록에서 현재 선택 팀에 대한 멤버십 역할을 찾습니다.
 * (Relay 스토어/SSR와 동일 데이터 소스 — 중복 요청 없음)
 */
export function resolveTeamMemberRoleForSelectedTeam(
  members: readonly TeamMemberRow[],
  selectedTeamId: string | null,
): TeamMemberRole | null {
  if (selectedTeamId == null) return null;
  const row = members.find(
    (m) => m.team != null && isSameTeamId(selectedTeamId, m.team.id),
  );
  if (row == null) return null;
  return parseTeamMemberRole(row.role);
}
