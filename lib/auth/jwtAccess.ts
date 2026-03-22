/**
 * accessToken(JWT)의 exp만 해석합니다. 서명 검증은 하지 않습니다.
 * 만료 판별·선제 갱신용이며, Edge(proxy)에서도 동작하도록 Web API만 사용합니다.
 */

/** exp 기준으로 만료로 볼 때 앞당길 초(클럭 스큐·네트워크 지연 완화) */
export const ACCESS_TOKEN_EXPIRY_LEEWAY_SEC = 60;

function decodeBase64UrlToUtf8(segment: string): string {
  const pad = "=".repeat((4 - (segment.length % 4)) % 4);
  const b64 = (segment + pad).replace(/-/g, "+").replace(/_/g, "/");
  // Node(Jest 등): Buffer가 안정적. Edge(proxy)에는 Buffer가 없을 수 있어 atob 사용.
  if (typeof Buffer !== "undefined") {
    return Buffer.from(b64, "base64").toString("utf8");
  }
  const binary = globalThis.atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

/** JWT payload의 Unix 초 exp. 파싱 실패·exp 없음이면 null */
export function readJwtExpUnix(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payloadB64 = parts[1];
    if (!payloadB64) return null;
    const json = decodeBase64UrlToUtf8(payloadB64);
    const p = JSON.parse(json) as { exp?: unknown };
    return typeof p.exp === "number" && Number.isFinite(p.exp) ? p.exp : null;
  } catch {
    return null;
  }
}

/**
 * true: 만료됨(또는 exp 없음·형식 오류 → 갱신 시도 대상으로 취급)
 * skewSec: exp 직전 이 초만큼은 만료로 간주(선제 갱신)
 */
export function isAccessTokenExpired(
  token: string,
  skewSec: number = ACCESS_TOKEN_EXPIRY_LEEWAY_SEC,
): boolean {
  const exp = readJwtExpUnix(token);
  if (exp == null) return true;
  const now = Math.floor(Date.now() / 1000);
  return now >= exp - skewSec;
}
