/**
 * Relay 글로벌 ID("TeamModel:123" 등), 숫자, 숫자 문자열에서 정수 ID를 추출합니다.
 * FindMatch(createdTeamId) 등 API 변수용 숫자 ID 계산에 사용합니다.
 */
export function parseNumericIdFromRelayGlobalId(
  id: string | number | null | undefined,
): number | null {
  if (id == null) return null;
  if (typeof id === "number") {
    return Number.isInteger(id) && !Number.isNaN(id) ? id : null;
  }
  const s = String(id).trim();
  if (s === "") return null;
  const n = Number(s);
  if (!Number.isNaN(n)) return n;
  const parts = s.split(":");
  const last = parts[parts.length - 1];
  if (last == null) return null;
  const num = Number(last.trim());
  return Number.isNaN(num) ? null : num;
}

/**
 * 쿠키·클라이언트 상태에 저장할 팀 ID를 findTeamMember의 team.id 형식과 맞춥니다.
 * createTeam 등에서 id가 "7"만 오는 경우 "TeamModel:7"으로 통일합니다.
 */
export function normalizeRelayTeamGlobalId(
  id: string | number | null,
): string | null {
  if (id == null || id === "") return null;
  if (typeof id === "number") {
    return Number.isInteger(id) ? `TeamModel:${id}` : null;
  }
  if (id.includes(":")) return id;
  const num = parseNumericIdFromRelayGlobalId(id);
  if (num != null) return `TeamModel:${num}`;
  return id;
}

/**
 * 두 팀 ID가 같은 팀을 가리키는지 비교합니다.
 * findManyTeam("123") vs findTeamMember team.id("TeamModel:123") 등 형식이 달라도 숫자 기준으로 비교합니다.
 */
export function isSameTeamId(
  a: string | number | null,
  b: string | number | null,
): boolean {
  if (a == null || b == null) return a === b;
  if (a === b) return true;
  const numA = parseNumericIdFromRelayGlobalId(a);
  const numB = parseNumericIdFromRelayGlobalId(b);
  return numA !== null && numB !== null && numA === numB;
}
