import { env } from "@/lib/env";

export interface TokenPair {
  accessToken?: string | null;
  refreshToken?: string | null;
}

interface RefreshResponse {
  data?: { refresh: TokenPair };
  /** GraphQL 오류 배열(HTTP 200이어도 존재할 수 있음) */
  errors?: unknown[];
}

const BACKEND_URL = env.BACKEND_URL;

/**
 * refreshToken으로 새 accessToken(및 refreshToken) 발급.
 * proxy 및 API 라우트에서 공통 사용.
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<TokenPair | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation Refresh($refreshToken: String!) {
            refresh(refreshToken: $refreshToken) {
              accessToken
              refreshToken
            }
          }
        `,
        variables: { refreshToken },
      }),
    });
    if (!response.ok) {
      console.error("Token refresh HTTP 오류:", response.status);
      return null;
    }

    const data: RefreshResponse = await response.json();
    if (
      data.errors != null &&
      Array.isArray(data.errors) &&
      data.errors.length > 0
    ) {
      console.error("Token refresh GraphQL errors:", data.errors);
      return null;
    }
    return data?.data?.refresh ?? null;
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
}
