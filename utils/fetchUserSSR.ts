import { UserModel } from "@/contexts/UserContext";
import { env } from "@/lib/env";
import { postBackendSSR } from "@/utils/ssrBackendFetch";

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
    const res = await postBackendSSR(url, headers, body);

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
