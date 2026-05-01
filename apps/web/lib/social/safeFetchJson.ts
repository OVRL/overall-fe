/**
 * 서버(RSC·Route Handler)에서 카카오 등 외부 HTTPS 호출 시,
 * `fetch failed`(DNS·방화벽·IPv6·TLS 등)가 그대로 throw 되면 페이지 전체가 크래시합니다.
 * 네트워크 예외를 삼켜 구조화된 오류로 돌려줍니다.
 *
 * 로컬에서만 반복되면 VPN/방화벽을 의심하고,
 * `NODE_OPTIONS=--dns-result-order=ipv4first` 로 IPv4 우선 시도도 검토할 수 있습니다.
 */
export type SafeFetchFailure =
  | { kind: "network"; message: string; cause?: string }
  | { kind: "http"; status: number; body: unknown };

export async function safeFetchJson(
  url: string,
  init?: RequestInit,
): Promise<{ ok: true; data: unknown } | { ok: false; error: SafeFetchFailure }> {
  try {
    const res = await fetch(url, { ...init, cache: "no-store" });
    const text = await res.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text) as unknown;
      } catch {
        data = { raw: text.slice(0, 500) };
      }
    }
    if (!res.ok) {
      return {
        ok: false,
        error: { kind: "http", status: res.status, body: data },
      };
    }
    return { ok: true, data };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    const nested =
      err.cause instanceof Error
        ? err.cause.message
        : err.cause != null
          ? String(err.cause)
          : undefined;
    return {
      ok: false,
      error: {
        kind: "network",
        message: err.message,
        ...(nested ? { cause: nested } : {}),
      },
    };
  }
}
