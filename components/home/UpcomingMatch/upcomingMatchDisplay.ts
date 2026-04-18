import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";
import { formatMatchDateTime } from "@/utils/date/formatMatchDateTime";

const DEFAULT_EMBLEM = "/images/ovr.png";

/** MatchInfo에 넘길 표시용 팀 정보 */
export type MatchTeamDisplay = {
  name: string;
  emblemUrl: string;
};

/** 다가오는 경기 카드에 표시할 데이터 */
export type UpcomingMatchDisplay = {
  /** Relay MatchModel.id (글로벌 ID 등). 포메이션 등 링크 쿼리에 사용 */
  matchId: string;
  formattedDateTime: string;
  homeTeam: MatchTeamDisplay;
  awayTeam: MatchTeamDisplay;
};

/** buildUpcomingMatchDisplay 입력: Relay findMatch 노드와 동일한 필드 구조 */
export type MatchForUpcomingDisplay = {
  matchDate: string;
  startTime: string;
  endTime: string;
  quarterCount: number;
  quarterDuration?: number;
  /** 참석 투표 마감 (GraphQLDateTime ISO 문자열) */
  voteDeadline?: string | null;
  /** true면 포메이션 임시저장(미확정) 상태로 간주 */
  isFormationDraft?: boolean | null;
  matchType: "INTERNAL" | "MATCH";
  createdTeam?: { name?: string | null; emblem?: string | null } | null;
  opponentTeam?: { name?: string | null; emblem?: string | null } | null;
  /** Relay/REST 공통: 숫자 id 또는 글로벌 id 문자열 */
  id?: string | number;
};

/**
 * findMatch 노드를 내전/매칭 구분에 맞게 표시용 데이터로 변환합니다.
 * - INTERNAL: createdTeam 기준 "${name} Team A" vs "${name} Team B", 엠블럼 동일
 * - MATCH: createdTeam vs opponentTeam
 */
export function buildUpcomingMatchDisplay(
  match: MatchForUpcomingDisplay,
): UpcomingMatchDisplay {
  const rawId = match.id;
  const matchId =
    typeof rawId === "number"
      ? String(rawId)
      : typeof rawId === "string"
        ? rawId.trim()
        : "";
  if (matchId === "") {
    throw new Error(
      "buildUpcomingMatchDisplay: 경기 id가 없습니다. Relay findMatch 노드를 전달했는지 확인하세요.",
    );
  }

  const formattedDateTime = formatMatchDateTime(match.matchDate, match.startTime);
  const createdName = match.createdTeam?.name?.trim() || "팀";
  const createdEmblem = match.createdTeam?.emblem?.trim() || DEFAULT_EMBLEM;

  if (match.matchType === "INTERNAL") {
    return {
      matchId,
      formattedDateTime,
      homeTeam: { name: `${createdName} Team A`, emblemUrl: createdEmblem },
      awayTeam: { name: `${createdName} Team B`, emblemUrl: createdEmblem },
    };
  }

  // MATCH (외부 매칭)
  const opponentName = match.opponentTeam?.name?.trim() || "상대팀";
  const opponentEmblem = match.opponentTeam?.emblem?.trim() || DEFAULT_EMBLEM;
  return {
    matchId,
    formattedDateTime,
    homeTeam: { name: createdName, emblemUrl: createdEmblem },
    awayTeam: { name: opponentName, emblemUrl: opponentEmblem },
  };
}

/** 포메이션 페이지 경로 (Relay 글로벌 ID 또는 숫자 id 모두 처리) */
export function formationHrefFromDisplay(display: UpcomingMatchDisplay): string {
  const numericMatchId = parseNumericIdFromRelayGlobalId(display.matchId);
  return numericMatchId != null
    ? `/formation/${numericMatchId}`
    : `/formation/${encodeURIComponent(display.matchId)}`;
}
