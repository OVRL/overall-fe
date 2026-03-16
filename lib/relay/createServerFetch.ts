import type {
  CacheConfig,
  GraphQLResponse,
  RequestParameters,
  UploadableMap,
  Variables,
} from "relay-runtime";
import { env } from "@/lib/env";
import { postBackendSSR } from "@/utils/ssrBackendFetch";
import { ensureIdStrings, ensureUniqueDataIds } from "./fetchGraphQL";

/**
 * SSR 전용: 요청당 인증 정보를 담은 Relay FetchFunction을 만듭니다.
 * 서버에서는 쿠키가 자동으로 전달되지 않으므로, Layout에서 읽은 accessToken을 넘겨
 * 백엔드 직접 호출 시 Authorization 헤더로 사용합니다.
 * (Relay 공식: 서버 환경은 요청 단위로 생성해 사용자 간 데이터 유출을 방지)
 */
export function createServerFetch(accessToken: string | null) {
  const url = `${env.BACKEND_URL}/graphql`;

  return async function serverFetch(
    params: RequestParameters,
    variables: Variables,
    _cacheConfig: CacheConfig,
    uploadables?: UploadableMap | null,
  ): Promise<GraphQLResponse> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // SSR에서는 multipart 업로드 미지원. 쿼리/뮤테이션만 JSON으로 전송
    if (uploadables && Object.keys(uploadables).length > 0) {
      throw new Error(
        "Relay SSR: 파일 업로드(uploadables)가 있는 요청은 서버에서 지원하지 않습니다.",
      );
    }

    const body = JSON.stringify({
      query: params.text,
      variables,
    });

    const res = await postBackendSSR(url, headers, body);
    const raw = await res.json().catch(() => ({}));
    let payload = ensureIdStrings(raw) as GraphQLResponse;
    payload = ensureUniqueDataIds(payload) as GraphQLResponse;

    if (!res.ok) {
      const errorPayload = raw as { errors?: Array<{ message?: string }> };
      const detail =
        errorPayload?.errors?.[0]?.message ?? res.statusText;
      throw new Error(`GraphQL 요청 실패 (${res.status}): ${detail}`);
    }

    return payload;
  };
}
