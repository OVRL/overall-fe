import type { MatchForUpcoming } from "@/utils/fetchFindMatchSSR";
import { formatMatchDateTime } from "@/utils/date/formatMatchDateTime";

const DEFAULT_EMBLEM = "/images/ovr.png";

/** MatchInfo에 넘길 표시용 팀 정보 */
export type MatchTeamDisplay = {
  name: string;
  emblemUrl: string;
};

/** 다가오는 경기 카드에 표시할 데이터 (SSR에서 계산해 클라이언트에 전달) */
export type UpcomingMatchDisplay = {
  formattedDateTime: string;
  homeTeam: MatchTeamDisplay;
  awayTeam: MatchTeamDisplay;
};

/**
 * MatchForUpcoming을 내전/매칭 구분에 맞게 표시용 데이터로 변환합니다.
 * - INTERNAL: createdTeam 기준 "${name} Team A" vs "${name} Team B", 엠블럼 동일
 * - MATCH: createdTeam vs opponentTeam
 */
export function buildUpcomingMatchDisplay(match: MatchForUpcoming): UpcomingMatchDisplay {
  const formattedDateTime = formatMatchDateTime(match.matchDate, match.startTime);
  const createdName = match.createdTeam?.name?.trim() || "팀";
  const createdEmblem = match.createdTeam?.emblem?.trim() || DEFAULT_EMBLEM;

  if (match.matchType === "INTERNAL") {
    return {
      formattedDateTime,
      homeTeam: { name: `${createdName} Team A`, emblemUrl: createdEmblem },
      awayTeam: { name: `${createdName} Team B`, emblemUrl: createdEmblem },
    };
  }

  // MATCH (외부 매칭)
  const opponentName = match.opponentTeam?.name?.trim() || "상대팀";
  const opponentEmblem = match.opponentTeam?.emblem?.trim() || DEFAULT_EMBLEM;
  return {
    formattedDateTime,
    homeTeam: { name: createdName, emblemUrl: createdEmblem },
    awayTeam: { name: opponentName, emblemUrl: opponentEmblem },
  };
}
