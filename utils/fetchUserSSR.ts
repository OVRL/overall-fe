import { env } from "@/lib/env";
import { UserModel } from "@/contexts/UserContext";

const FIND_USER_QUERY = `
  query FindUser {
    findManyUser(limit: 100) {
      items {
        id
        email
        name
        profileImage
      }
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
  try {
    const res = await fetch(`${env.BACKEND_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: FIND_USER_QUERY,
      }),
      // 항상 최신 정보를 가져오도록 캐시를 사용하지 않습니다.
      // 추가적인 최적화가 필요하다면 Next.js의 태그 기반 Revalidation을 고려할 수 있습니다.
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("fetchUserSSR HTTP 에러:", res.status, res.statusText);
      return null;
    }

    const { data, errors } = await res.json();
    if (errors && errors.length > 0) {
      console.error("fetchUserSSR GraphQL 에러:", errors);
      return null;
    }
    const items = data?.findManyUser?.items || [];
    return items.find((u: any) => Number(u.id) === userId) || null;
  } catch (err) {
    console.error("fetchUserSSR 예외 발생:", err);
    return null;
  }
}
