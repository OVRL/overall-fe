import {
  type CacheConfig,
  type GraphQLResponse,
  type RequestParameters,
  type UploadableMap,
  type Variables,
} from "relay-runtime";
import {
  graphqlErrorsRequireSessionClear,
  STALE_AUTH_SESSION_ERROR,
} from "@/lib/auth/graphqlSessionClear";
import { GraphQLHttpError } from "./GraphQLHttpError";

/** SSR 시 fetch에 쓸 오리진 (Node에는 base URL이 없어 상대 URL 사용 불가) */
function getServerOrigin(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  const port = process.env.PORT ?? 3000;
  return `http://localhost:${port}`;
}

/**
 * 백엔드가 서로 다른 타입에 같은 숫자 id를 줄 수 있어 Relay 정규화 시 충돌이 납니다.
 * 모든 노드에 __typename:원본id 형태로 id를 덮어쓰면 타입별로 고유 키가 보장됩니다.
 * (서버/클라이언트 fetch 공통 적용)
 */
export function ensureUniqueDataIds(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(ensureUniqueDataIds);
  const obj = value as Record<string, unknown>;
  const typename = obj["__typename"];
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (
      key === "id" &&
      typeof typename === "string" &&
      typename.length > 0 &&
      (typeof val === "string" || typeof val === "number")
    ) {
      result[key] = `${typename}:${val}`;
    } else {
      result[key] = ensureUniqueDataIds(val);
    }
  }
  return result;
}

export const fetchQuery = async (
  params: RequestParameters,
  variables: Variables,
  _cacheConfig: CacheConfig,
  uploadables?: UploadableMap | null,
): Promise<GraphQLResponse> => {
  const request: RequestInit = {
    method: "POST",
  };

  if (uploadables) {
    const formData = new FormData();
    const operations = {
      query: params.text,
      variables: { ...variables },
    };

    const map: Record<string, string[]> = {};
    let i = 0;

    Object.keys(uploadables).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(operations.variables, key)) {
        operations.variables[key] = null;
      }
      map[`${i}`] = [`variables.${key}`];
      i++;
    });

    formData.append("operations", JSON.stringify(operations));
    formData.append("map", JSON.stringify(map));

    i = 0;
    Object.keys(uploadables).forEach((key) => {
      formData.append(`${i}`, uploadables[key]);
      i++;
    });

    request.body = formData;
  } else {
    request.headers = {
      "Content-Type": "application/json",
    };
    request.body = JSON.stringify({
      query: params.text,
      variables,
    });
  }

  // 클라이언트: 상대 URL. 서버(SSR): Node에 base가 없어 상대 URL이 Invalid URL이 되므로 절대 URL 사용.
  const graphqlPath = "/api/graphql";
  const graphqlUrl =
    typeof window !== "undefined"
      ? graphqlPath
      : `${getServerOrigin()}${graphqlPath}`;

  const response = await fetch(graphqlUrl, {
    ...request,
    credentials: "include",
  });

  const text = await response.text();

  // 빈 응답·비-JSON 응답 방어: response.json() 대신 text → JSON.parse로 파싱 실패 시 명시적 에러 throw
  if (!text || text.trim() === "") {
    const message = response.ok
      ? "GraphQL 응답이 비어 있습니다."
      : `GraphQL 요청 실패 (${response.status} ${response.statusText})`;
    throw new Error(message);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    const message = response.ok
      ? "GraphQL 응답이 유효한 JSON이 아닙니다."
      : `GraphQL 요청 실패 (${response.status}): 응답이 JSON이 아닙니다.`;
    throw new Error(message);
  }

  // GraphQL Int id와 동일 숫자가 서로 다른 타입에 있을 때 Relay 정규화 충돌 방지
  payload = ensureUniqueDataIds(payload);

  const errorPayload = payload as { errors?: Array<{ message?: string }> };
  const hasUnauthorizedError =
    response.status === 401 ||
    errorPayload?.errors?.some(
      (e) =>
        e?.message === "Unauthorized" ||
        String(e?.message ?? "").toLowerCase().includes("unauthorized"),
    );

  // 클라이언트: 토큰 만료 등으로 인증 실패 시 세션 삭제 후 로그인 페이지로
  // (세션 삭제 없이만 이동하면 proxy·쿠키 조합에서 리다이렉트 루프가 날 수 있음)
  if (typeof window !== "undefined" && hasUnauthorizedError) {
    window.location.href = "/api/auth/clear-session?redirect=/login/social";
    throw new Error("Unauthorized"); // Relay에 에러 payload 반환하지 않기 위해
  }

  // 삭제된 유저 등: 토큰은 남아 있으나 findUserById가 non-null 위반으로 실패하는 경우
  if (
    typeof window !== "undefined" &&
    graphqlErrorsRequireSessionClear(errorPayload?.errors)
  ) {
    window.location.href = "/api/auth/clear-session?redirect=/login/social";
    throw new Error(STALE_AUTH_SESSION_ERROR);
  }

  // HTTP 비성공 시 Relay에 넘기기 전에 에러 throw (로컬/프록시 오류 등에서 빈 body 올 수 있음)
  if (!response.ok) {
    throw new GraphQLHttpError(response.status, errorPayload?.errors);
  }

  // HTTP 200 + GraphQL errors[] — Relay 네트워크는 그대로 반환해 fetchQuery가 예외 없이 끝날 수 있음.
  // 랜딩 초대 코드 조회는 반드시 catch/토스트로 잡히도록 이 쿼리만 명시적으로 실패 처리합니다.
  if (
    params.name === "findTeamByInviteCodeQuery" &&
    Array.isArray(errorPayload.errors) &&
    errorPayload.errors.length > 0
  ) {
    throw new GraphQLHttpError(response.status, errorPayload.errors);
  }

  // MOM 결과 조회는 오버레이(버튼 클릭)에서 즉시 실패를 사용자에게 알려야 하므로 GraphQL errors[]도 실패로 취급
  if (
    params.name === "findMatchMomQuery" &&
    Array.isArray(errorPayload.errors) &&
    errorPayload.errors.length > 0
  ) {
    throw new GraphQLHttpError(response.status, errorPayload.errors);
  }

  return payload as GraphQLResponse;
};
