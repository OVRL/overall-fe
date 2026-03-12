import http from "node:http";
import https from "node:https";
import { env } from "@/lib/env";
import { UserModel } from "@/contexts/UserContext";

const FIND_USER_BY_ID_QUERY = `
  query FindUserById($id: Int!) {
    findUserById(id: $id) {
      id
      email
      name
      profileImage
      activityArea
      birthDate
      favoritePlayer
      foot
      gender
      mainPosition
      phone
      preferredNumber
      provider
      subPositions
    }
  }
`;

/** 개발 시 백엔드가 self-signed 인증서를 쓰면 true (환경변수 또는 NODE_ENV=development) */
const allowInsecureBackendTLS =
  process.env.BACKEND_INSECURE_TLS === "1" ||
  process.env.BACKEND_INSECURE_TLS === "true" ||
  process.env.NODE_ENV === "development";

/**
 * Node http(s)로 POST 요청 (개발 시 self-signed 인증서 허용)
 */
function fetchWithOptionalInsecureTLS(
  url: string,
  options: { method: string; headers: Record<string, string>; body: string },
): Promise<{ ok: boolean; status: number; statusText: string; json: () => Promise<unknown> }> {
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
            ok: res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 300,
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
 * SSR에서 유저 정보를 가져오기 위한 유틸리티 함수입니다.
 * @param userId 쿠키에서 추출한 유저 ID
 * @param accessToken 쿠키에서 추출한 액세스 토큰
 * @returns UserModel 객체 또는 null
 */
export async function fetchUserSSR(
  userId: number,
  accessToken: string,
): Promise<UserModel | null> {
  const url = `${env.BACKEND_URL}/graphql`;
  const body = JSON.stringify({
    query: FIND_USER_BY_ID_QUERY,
    variables: { id: userId },
  });
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    // 개발/self-signed 환경에서는 Node https로 인증 검사 완화 후 요청
    const res = allowInsecureBackendTLS
      ? await fetchWithOptionalInsecureTLS(url, { method: "POST", headers, body })
      : await fetch(url, {
          method: "POST",
          headers,
          body,
          cache: "no-store",
        }).then((r) => ({
          ok: r.ok,
          status: r.status,
          statusText: r.statusText,
          json: () => r.json(),
        }));

    if (!res.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error("fetchUserSSR HTTP 에러:", res.status, res.statusText);
      }
      return null;
    }

    const payload = (await res.json()) as { data?: { findUserById?: UserModel }; errors?: unknown[] };
    if (payload.errors && payload.errors.length > 0) {
      if (process.env.NODE_ENV === "development") {
        console.error("fetchUserSSR GraphQL 에러:", payload.errors);
      }
      return null;
    }
    return payload.data?.findUserById ?? null;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("fetchUserSSR 예외 발생:", err);
    }
    return null;
  }
}
