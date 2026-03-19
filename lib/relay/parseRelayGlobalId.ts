/**
 * Relay 글로벌 ID("TeamModel:123" 등) 또는 숫자 문자열에서 숫자 부분만 추출합니다.
 * FindMatch(createdTeamId) 등 API 변수용 숫자 ID 계산에 사용합니다.
 */
export function parseNumericIdFromRelayGlobalId(id: string): number | null {
  const n = Number(id);
  if (!Number.isNaN(n)) return n;
  const parts = id.split(":");
  const last = parts[parts.length - 1];
  if (last == null) return null;
  const num = Number(last);
  return Number.isNaN(num) ? null : num;
}

/**
 * 두 팀 ID가 같은 팀을 가리키는지 비교합니다.
 * findManyTeam("123") vs findTeamMember team.id("TeamModel:123") 등 형식이 달라도 숫자 기준으로 비교합니다.
 */
export function isSameTeamId(a: string | null, b: string | null): boolean {
  if (a == null || b == null) return a === b;
  if (a === b) return true;
  const numA = parseNumericIdFromRelayGlobalId(a);
  const numB = parseNumericIdFromRelayGlobalId(b);
  return numA !== null && numB !== null && numA === numB;
}
