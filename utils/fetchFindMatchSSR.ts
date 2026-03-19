import { env } from "@/lib/env";
import { postBackendSSR } from "@/utils/ssrBackendFetch";

const FIND_MATCH_QUERY = `
  query FindMatch($createdTeamId: Int!) {
    findMatch(createdTeamId: $createdTeamId) {
      id
      matchDate
      startTime
      matchType
      createdTeam {
        id
        name
        emblem
      }
      opponentTeam {
        id
        name
        emblem
      }
    }
  }
`;

/** findMatch 응답의 팀 정보 (createdTeam / opponentTeam) */
export type MatchTeamInfo = {
  id: string;
  name: string | null;
  emblem: string | null;
} | null;

export type MatchForUpcoming = {
  id: string;
  matchDate: string;
  startTime: string;
  matchType: "INTERNAL" | "MATCH";
  createdTeam: MatchTeamInfo;
  opponentTeam: MatchTeamInfo;
};

/**
 * SSR에서 해당 팀의 경기 목록을 가져옵니다.
 * createdTeamId는 쿠키의 selectedTeamId를 사용합니다.
 */
export async function fetchFindMatchSSR(
  createdTeamId: number,
  accessToken: string,
): Promise<MatchForUpcoming[]> {
  const url = `${env.BACKEND_URL}/graphql`;
  const body = JSON.stringify({
    query: FIND_MATCH_QUERY,
    variables: { createdTeamId },
  });
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const res = await postBackendSSR(url, headers, body);

    if (!res.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error("fetchFindMatchSSR HTTP 에러:", res.status, res.statusText);
      }
      return [];
    }

    const payload = (await res.json()) as {
      data?: { findMatch?: MatchForUpcoming[] };
      errors?: unknown[];
    };
    if (payload.errors?.length) {
      if (process.env.NODE_ENV === "development") {
        console.error("fetchFindMatchSSR GraphQL 에러:", payload.errors);
      }
      return [];
    }
    return payload.data?.findMatch ?? [];
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("fetchFindMatchSSR 예외:", err);
    }
    return [];
  }
}
