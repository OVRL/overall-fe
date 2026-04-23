/**
 * `tactics` JSONObject 안에 들어온 id 값을 DB 정수 PK로 맞춥니다.
 * - 숫자 그대로
 * - `"9"` 같은 숫자 문자열
 * - `"MatchMercenaryModel:9"` 같이 `:` 뒤에 정수만 오는 문자열
 */
export function parseTacticsNumericId(raw: unknown): number | null {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Number.isInteger(raw) ? raw : null;
  }
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (/^-?\d+$/.test(trimmed)) {
    const n = Number(trimmed);
    return Number.isSafeInteger(n) ? n : null;
  }
  const colon = trimmed.lastIndexOf(":");
  if (colon >= 0) {
    const suffix = trimmed.slice(colon + 1).trim();
    if (/^-?\d+$/.test(suffix)) {
      const n = Number(suffix);
      return Number.isSafeInteger(n) ? n : null;
    }
  }
  return null;
}
