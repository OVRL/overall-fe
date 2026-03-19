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
