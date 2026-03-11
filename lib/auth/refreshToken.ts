import { env } from "@/lib/env";

export interface TokenPair {
  accessToken?: string | null;
  refreshToken?: string | null;
}

interface RefreshResponse {
  data?: { refresh: TokenPair };
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
    const data: RefreshResponse = await response.json();
    return data?.data?.refresh ?? null;
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
}
