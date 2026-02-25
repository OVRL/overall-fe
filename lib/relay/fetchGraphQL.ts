import {
  CacheConfig,
  RequestParameters,
  UploadableMap,
  Variables,
} from "relay-runtime";
import { env } from "@/lib/env";

export const fetchQuery = async (
  params: RequestParameters,
  variables: Variables,
  _cacheConfig: CacheConfig,
  uploadables?: UploadableMap | null,
) => {
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

  // 개발: 백엔드 URL로 직접 호출(rewrite/프록시 우회). CORS 허용 필요.
  // 프로덕션: 같은 오리진 /api/graphql → API 라우트에서 쿠키로 Authorization 부여 후 백엔드 호출.
  // NODE_ENV는 클라이언트에서 process.env로만 사용 (t3-env는 NEXT_PUBLIC_만 클라이언트 노출).
  const graphqlUrl =
    process.env.NODE_ENV === "development"
      ? `${env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, "")}/graphql`
      : "/api/graphql";

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

  // HTTP 비성공 시 Relay에 넘기기 전에 에러 throw (로컬/프록시 오류 등에서 빈 body 올 수 있음)
  if (!response.ok) {
    const errorPayload = payload as { errors?: Array<{ message?: string }> };
    const detail =
      errorPayload?.errors?.[0]?.message ?? response.statusText;
    throw new Error(`GraphQL 요청 실패 (${response.status}): ${detail}`);
  }

  return payload;
};
