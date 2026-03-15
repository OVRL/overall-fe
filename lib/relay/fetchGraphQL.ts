import {
  type CacheConfig,
  type GraphQLResponse,
  type RequestParameters,
  type UploadableMap,
  type Variables,
} from "relay-runtime";

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
 * Relay는 Global Object Identification 때문에 모든 id를 문자열로 기대합니다.
 * 백엔드가 TeamMemberModel 등에서 id를 Int로 반환할 경우 응답을 정규화합니다.
 */
function ensureIdStrings(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(ensureIdStrings);
  const obj = value as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key === "id" && typeof val === "number") {
      result[key] = String(val);
    } else {
      result[key] = ensureIdStrings(val);
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

  // 백엔드가 id를 Int로 주는 타입(TeamMemberModel 등) 대응: Relay는 id를 문자열로 기대함
  payload = ensureIdStrings(payload);

  // HTTP 비성공 시 Relay에 넘기기 전에 에러 throw (로컬/프록시 오류 등에서 빈 body 올 수 있음)
  if (!response.ok) {
    const errorPayload = payload as { errors?: Array<{ message?: string }> };
    const detail =
      errorPayload?.errors?.[0]?.message ?? response.statusText;
    throw new Error(`GraphQL 요청 실패 (${response.status}): ${detail}`);
  }

  return payload as GraphQLResponse;
};
