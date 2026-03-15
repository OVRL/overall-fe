import http from "node:http";
import https from "node:https";

/** SSR fetch 응답 (표준 fetch와 동일한 인터페이스) */
export type SSRFetchResponse = {
  ok: boolean;
  status: number;
  statusText: string;
  json: () => Promise<unknown>;
};

/** 개발 시 백엔드가 self-signed 인증서를 쓰면 true */
const allowInsecureBackendTLS =
  process.env.BACKEND_INSECURE_TLS === "1" ||
  process.env.BACKEND_INSECURE_TLS === "true" ||
  process.env.NODE_ENV === "development";

/**
 * Node http(s)로 POST 요청 (개발 시 self-signed 인증서 허용).
 * SSR에서 백엔드 GraphQL 호출 시 TLS 검증 완화가 필요할 때 사용합니다.
 */
function fetchWithOptionalInsecureTLS(
  url: string,
  options: { method: string; headers: Record<string, string>; body: string },
): Promise<SSRFetchResponse> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const body = options.body;
    const isHttps = parsed.protocol === "https:";
    const port = parsed.port || (isHttps ? 443 : 80);
    const requestOptions = {
      hostname: parsed.hostname,
      port: Number(port),
      path: parsed.pathname + parsed.search,
      method: options.method,
      headers: options.headers,
      ...(isHttps && { rejectUnauthorized: !allowInsecureBackendTLS }),
    };
    const req = (isHttps ? https : http).request(
      requestOptions,
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf8");
          resolve({
            ok: (res.statusCode ?? 0) >= 200 && (res.statusCode ?? 0) < 300,
            status: res.statusCode ?? 0,
            statusText: res.statusMessage ?? "",
            json: () => Promise.resolve(JSON.parse(raw || "{}")),
          });
        });
      },
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

/**
 * SSR에서 백엔드로 POST 요청합니다.
 * 개발 시 self-signed TLS면 Node http(s)를, 아니면 표준 fetch를 사용합니다.
 */
export async function postBackendSSR(
  url: string,
  headers: Record<string, string>,
  body: string,
): Promise<SSRFetchResponse> {
  if (allowInsecureBackendTLS) {
    return fetchWithOptionalInsecureTLS(url, { method: "POST", headers, body });
  }
  const res = await fetch(url, {
    method: "POST",
    headers,
    body,
    cache: "no-store",
  });
  return {
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    json: () => res.json(),
  };
}
