import { env } from "@/lib/env";

const BACKEND_URL = env.BACKEND_URL;

/**
 * 백엔드에 logout 뮤테이션을 호출하여 서버 측 리프레시 토큰을 무효화합니다.
 * 실패해도 클라이언트 세션 클리어는 진행하므로 boolean만 반환합니다.
 */
export async function logoutBackend(refreshToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation Logout($refreshToken: String!) {
            logout(refreshToken: $refreshToken)
          }
        `,
        variables: { refreshToken },
      }),
    });
    const data = (await response.json()) as { data?: { logout?: boolean }; errors?: unknown[] };
    return data?.data?.logout === true;
  } catch (error) {
    console.error("Logout API error:", error);
    return false;
  }
}
