import { env } from "@/lib/env";
import { postBackendSSR } from "@/utils/ssrBackendFetch";

const FIND_MATCH_ATTENDANCE_QUERY = `
  query FindMatchAttendance($matchId: Int!, $teamId: Int!) {
    findMatchAttendance(matchId: $matchId, teamId: $teamId) {
      attendanceStatus
      teamMember {
        id
        foot
        preferredNumber
        preferredPosition
        profileImg
        overall {
          ovr
        }
        user {
          id
          name
          preferredNumber
          profileImage
        }
      }
    }
  }
`;

/** findMatchAttendance 한 행 (SSR JSON) */
export type MatchAttendanceRowSSR = {
  attendanceStatus: "ATTEND" | "ABSENT" | null;
  teamMember: {
    id: number;
    foot: string | null;
    preferredNumber: number | null;
    preferredPosition: string | null;
    profileImg: string | null;
    overall: { ovr: number } | null;
    user: {
      id: number;
      name: string | null;
      preferredNumber: number | null;
      profileImage: string | null;
    } | null;
  } | null;
};

/**
 * SSR에서 해당 경기·팀의 참석 목록을 가져옵니다.
 * (포메이션 선수 풀은 클라이언트가 아닌 서버에서 한 번 로드)
 */
export async function fetchFindMatchAttendanceSSR(
  matchId: number,
  teamId: number,
  accessToken: string,
): Promise<MatchAttendanceRowSSR[]> {
  const url = `${env.BACKEND_URL}/graphql`;
  const body = JSON.stringify({
    query: FIND_MATCH_ATTENDANCE_QUERY,
    variables: { matchId, teamId },
  });
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const res = await postBackendSSR(url, headers, body);

    if (!res.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "fetchFindMatchAttendanceSSR HTTP 에러:",
          res.status,
          res.statusText,
        );
      }
      return [];
    }

    const payload = (await res.json()) as {
      data?: { findMatchAttendance?: MatchAttendanceRowSSR[] };
      errors?: unknown[];
    };
    if (payload.errors?.length) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "fetchFindMatchAttendanceSSR GraphQL 에러:",
          payload.errors,
        );
      }
      return [];
    }
    return payload.data?.findMatchAttendance ?? [];
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("fetchFindMatchAttendanceSSR 예외:", err);
    }
    return [];
  }
}
