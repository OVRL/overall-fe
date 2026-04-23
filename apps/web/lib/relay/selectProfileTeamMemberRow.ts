import { isSameTeamId } from "@/lib/relay/parseRelayGlobalId";

type RowWithTeamId = {
  readonly team?: { readonly id: number } | null | undefined;
};

/**
 * findTeamMember(프로필 확장 쿼리) 목록에서 현재 선택 팀에 해당하는 한 행을 고릅니다.
 * `isSameTeamId`로 숫자 id·Relay 문자열 id·쿠키 값이 섞여도 동일 팀으로 매칭됩니다.
 */
export function selectProfileTeamMemberRow<T extends RowWithTeamId>(
  members: ReadonlyArray<T>,
  selectedTeamId: string | null,
): T | null {
  if (selectedTeamId == null) return null;
  return (
    members.find(
      (m) => m.team != null && isSameTeamId(selectedTeamId, m.team.id),
    ) ?? null
  );
}
