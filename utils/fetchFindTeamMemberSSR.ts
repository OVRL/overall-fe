import { env } from "@/lib/env";
import { postBackendSSR } from "@/utils/ssrBackendFetch";

const FIND_TEAM_MEMBER_QUERY = `
  query FindTeamMember($userId: Int!) {
    findTeamMember(userId: $userId) {
      id
      teamId
      team {
        id
        name
        emblem
      }
    }
  }
`;

export type TeamMemberForHeader = {
  id: number;
  teamId: number;
  team: {
    id: string;
    name: string | null;
    emblem: string | null;
  } | null;
};

/**
 * SSR에서 유저의 팀 멤버십 목록을 가져옵니다.
 * layout에서 유저 조회와 함께 호출해 선택 팀 초기값/쿠키 세팅에 사용합니다.
 */
export async function fetchFindTeamMemberSSR(
  userId: number,
  accessToken: string,
): Promise<TeamMemberForHeader[]> {
  const url = `${env.BACKEND_URL}/graphql`;
  const body = JSON.stringify({
    query: FIND_TEAM_MEMBER_QUERY,
    variables: { userId },
  });
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const res = await postBackendSSR(url, headers, body);

    if (!res.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error("fetchFindTeamMemberSSR HTTP 에러:", res.status, res.statusText);
      }
      return [];
    }

    const payload = (await res.json()) as {
      data?: { findTeamMember?: TeamMemberForHeader[] };
      errors?: unknown[];
    };
    if (payload.errors?.length) {
      if (process.env.NODE_ENV === "development") {
        console.error("fetchFindTeamMemberSSR GraphQL 에러:", payload.errors);
      }
      return [];
    }
    return payload.data?.findTeamMember ?? [];
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("fetchFindTeamMemberSSR 예외:", err);
    }
    return [];
  }
}
