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
import { refreshAccessToken } from "@/lib/auth/refreshToken";

/** GraphQL 응답에 Unauthorized 에러가 포함되어 있는지 확인 */
function hasUnauthorizedError(raw: unknown): boolean {
  const payload = raw as { errors?: Array<{ message?: string }> };
  return (
    payload?.errors?.some(
      (e) =>
        e?.message === "Unauthorized" ||
        String(e?.message ?? "").toLowerCase().includes("unauthorized"),
    ) ?? false
  );
}

/**
 * SSR 전용: 요청당 인증 정보를 담은 Relay FetchFunction을 만듭니다.
 * 서버에서는 쿠키가 자동으로 전달되지 않으므로, Layout에서 읽은 accessToken/refreshToken을 넘겨
 * 백엔드 직접 호출 시 Authorization 헤더로 사용합니다.
 * Unauthorized 시 refreshToken으로 갱신 후 한 번 재시도합니다.
 */
export function createServerFetch(
  accessToken: string | null,
  refreshToken: string | null = null,
) {
  const url = `${env.BACKEND_URL}/graphql`;

  return async function serverFetch(
    params: RequestParameters,
    variables: Variables,
    _cacheConfig: CacheConfig,
    uploadables?: UploadableMap | null,
  ): Promise<GraphQLResponse> {
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

    const token = accessToken;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const doRequest = async (): Promise<GraphQLResponse> => {
      const res = await postBackendSSR(url, headers, body);
      const raw = await res.json().catch(() => ({}));
      let payload = ensureIdStrings(raw) as GraphQLResponse;
      payload = ensureUniqueDataIds(payload) as GraphQLResponse;

      const isUnauthorized =
        res.status === 401 || hasUnauthorizedError(raw);

      if (isUnauthorized && refreshToken) {
        const newTokens = await refreshAccessToken(refreshToken);
        if (newTokens?.accessToken) {
          headers["Authorization"] = `Bearer ${newTokens.accessToken}`;
          const retryRes = await postBackendSSR(url, headers, body);
          const retryRaw = await retryRes.json().catch(() => ({}));
          let retryPayload = ensureIdStrings(retryRaw) as GraphQLResponse;
          retryPayload = ensureUniqueDataIds(retryPayload) as GraphQLResponse;
          if (!retryRes.ok) {
            const errorPayload = retryRaw as {
              errors?: Array<{ message?: string }>;
            };
            const detail =
              errorPayload?.errors?.[0]?.message ?? retryRes.statusText;
            throw new Error(
              `GraphQL 요청 실패 (${retryRes.status}): ${detail}`,
            );
          }
          return retryPayload;
        }
      }

      if (!res.ok) {
        const errorPayload = raw as { errors?: Array<{ message?: string }> };
        const detail =
          errorPayload?.errors?.[0]?.message ?? res.statusText;
        throw new Error(`GraphQL 요청 실패 (${res.status}): ${detail}`);
      }

      return payload;
    };

    return doRequest();
  };
}
