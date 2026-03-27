import { cookies } from "next/headers";
import { SELECTED_TEAM_ID_COOKIE_KEY } from "@/lib/cookie/selectedTeamId";
import {
  isSameTeamId,
  parseNumericIdFromRelayGlobalId,
} from "@/lib/relay/parseRelayGlobalId";
import {
  fetchFindMatchSSR,
  type MatchForUpcoming,
} from "@/utils/fetchFindMatchSSR";
import {
  fetchFindTeamMemberSSR,
  type TeamMemberForHeader,
} from "@/utils/fetchFindTeamMemberSSR";

/**
 * 레이아웃 SSR과 동일한 기준으로, 현재 사용자에게 선택된 팀의 숫자 teamId(= findMatch의 createdTeamId)를 구합니다.
 */
function resolveCreatedTeamIdForSession(
  members: TeamMemberForHeader[],
  selectedTeamIdFromCookie: string | null,
): number | null {
  const teamsWithInfo = members.filter(
    (m): m is TeamMemberForHeader & { team: NonNullable<TeamMemberForHeader["team"]> } =>
      m.team != null,
  );
  if (teamsWithInfo.length === 0) return null;

  const cookieDecoded =
    selectedTeamIdFromCookie != null
      ? (() => {
          try {
            return decodeURIComponent(selectedTeamIdFromCookie);
          } catch {
            return selectedTeamIdFromCookie;
          }
        })()
      : null;

  const cookieMatched =
    cookieDecoded != null
      ? teamsWithInfo.find(
          (m) => m.team != null && isSameTeamId(cookieDecoded, m.team.id),
        )
      : undefined;

  const selected =
    cookieMatched ?? (teamsWithInfo.length >= 1 ? teamsWithInfo[0] : undefined);

  return selected?.teamId ?? null;
}

/** URL 경로의 숫자 id와 Relay 글로벌 id(MatchModel:11 등)를 동일 경기로 취급합니다. */
function matchIdEquals(a: string, b: string): boolean {
  if (a === b) return true;
  const na = Number(a);
  const nb = Number(b);
  if (!Number.isNaN(na) && !Number.isNaN(nb) && na === nb) return true;

  const parsedA = parseNumericIdFromRelayGlobalId(a);
  const parsedB = parseNumericIdFromRelayGlobalId(b);
  if (parsedA !== null && parsedB !== null && parsedA === parsedB) {
    return true;
  }
  return false;
}

/**
 * 포메이션 등에서 URL 경로의 matchId(숫자 또는 Relay 글로벌 ID)를 신뢰하지 않고,
 * 로그인·선택 팀 기준 findMatch 목록에 포함되는지 서버에서만 검증합니다.
 * (Next.js 데이터 보안 가이드: 클라이언트 입력은 매 요청 서버에서 재검증)
 *
 * 성공 시 accessToken을 함께 반환해, 동일 요청에서 cookies()를 다시 읽지 않고
 * 후속 SSR 페치(findMatchAttendance 등)에 재사용할 수 있게 합니다.
 */
export async function verifyFormationMatchAccessSSR(
  matchIdFromClient: string,
): Promise<
  | { ok: true; match: MatchForUpcoming; createdTeamId: number; accessToken: string }
  | { ok: false }
> {
  const trimmed = matchIdFromClient.trim();
  if (trimmed === "") return { ok: false };

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const userIdStr = cookieStore.get("userId")?.value;

  if (accessToken == null || userIdStr == null) {
    return { ok: false };
  }

  const userId = Number(userIdStr);
  if (Number.isNaN(userId)) {
    return { ok: false };
  }

  const members = await fetchFindTeamMemberSSR(userId, accessToken);
  const selectedTeamIdFromCookie =
    cookieStore.get(SELECTED_TEAM_ID_COOKIE_KEY)?.value ?? null;
  const createdTeamId = resolveCreatedTeamIdForSession(
    members,
    selectedTeamIdFromCookie,
  );

  if (createdTeamId == null) {
    return { ok: false };
  }

  const matches = await fetchFindMatchSSR(createdTeamId, accessToken);
  const match = matches.find((m) => matchIdEquals(String(m.id), trimmed));

  if (match == null) {
    return { ok: false };
  }

  return { ok: true, match, createdTeamId, accessToken };
}
