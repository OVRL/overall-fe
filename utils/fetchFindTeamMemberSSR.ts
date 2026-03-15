import http from "node:http";
import https from "node:https";
import { env } from "@/lib/env";

const FIND_TEAM_MEMBER_QUERY = `
  query FindTeamMember($userId: Int!) {
    findTeamMember(userId: $userId) {
      id
      teamId
      team {
        id
        name
        emblem
      }
    }
  }
`;

export type TeamMemberForHeader = {
  id: number;
  teamId: number;
  team: {
    id: string;
    name: string | null;
    emblem: string | null;
  } | null;
};

/** 개발 시 백엔드가 self-signed 인증서를 쓰면 true */
const allowInsecureBackendTLS =
  process.env.BACKEND_INSECURE_TLS === "1" ||
  process.env.BACKEND_INSECURE_TLS === "true" ||
  process.env.NODE_ENV === "development";

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
 * SSR에서 유저의 팀 멤버십 목록을 가져옵니다.
 * layout에서 유저 조회와 함께 호출해 선택 팀 초기값/쿠키 세팅에 사용합니다.
 */
export async function fetchFindTeamMemberSSR(
  userId: number,
  accessToken: string,
): Promise<TeamMemberForHeader[]> {
  const url = `${env.BACKEND_URL}/graphql`;
  const body = JSON.stringify({
    query: FIND_TEAM_MEMBER_QUERY,
    variables: { userId },
  });
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
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
        console.error("fetchFindTeamMemberSSR HTTP 에러:", res.status, res.statusText);
      }
      return [];
    }

    const payload = (await res.json()) as {
      data?: { findTeamMember?: TeamMemberForHeader[] };
      errors?: unknown[];
    };
    if (payload.errors?.length) {
      if (process.env.NODE_ENV === "development") {
        console.error("fetchFindTeamMemberSSR GraphQL 에러:", payload.errors);
      }
      return [];
    }
    return payload.data?.findTeamMember ?? [];
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("fetchFindTeamMemberSSR 예외:", err);
    }
    return [];
  }
}
