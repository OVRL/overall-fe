/**
 * MatchModel.id(GraphQL `Int` 또는 Relay 정규화 id 문자열)를
 * 백엔드 Int 인자(findMatchAttendance, createMatchAttendance 등)로 넘기기 위한 정수로 변환합니다.
 * 숫자 문자열·Relay 스타일 base64·"Type:123" 형태도 호환합니다.
 */
export function parseMatchIdForApi(
  id: string | number | null | undefined,
): number | null {
  if (id == null) return null;

  if (typeof id === "number") {
    return Number.isInteger(id) && id >= 0 ? id : null;
  }

  const s = id.trim();
  if (s === "") return null;

  if (/^\d+$/.test(s)) {
    const n = Number(s);
    return Number.isSafeInteger(n) ? n : null;
  }

  // Relay/GraphQL에서 흔한 base64 글로벌 ID → 디코드 후 ":숫자" 또는 숫자만 추출
  if (typeof atob === "function") {
    try {
      const decoded = atob(s);
      const idx = decoded.lastIndexOf(":");
      const tail = (idx >= 0 ? decoded.slice(idx + 1) : decoded).trim();
      if (/^\d+$/.test(tail)) {
        const n = Number(tail);
        return Number.isSafeInteger(n) ? n : null;
      }
    } catch {
      /* base64 아님 */
    }
  }

  const colon = s.lastIndexOf(":");
  if (colon >= 0) {
    const tail = s.slice(colon + 1).trim();
    if (/^\d+$/.test(tail)) {
      const n = Number(tail);
      return Number.isSafeInteger(n) ? n : null;
    }
  }

  return null;
}
