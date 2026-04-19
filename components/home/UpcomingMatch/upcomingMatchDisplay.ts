import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";
import { formatMatchDateTime } from "@/utils/date/formatMatchDateTime";

const DEFAULT_EMBLEM = "/images/ovr.png";

/** MatchInfo에 넘길 표시용 팀 정보 */
export type MatchTeamDisplay = {
  name: string;
  emblemUrl: string;
};

/** 홈·원정 득점 (표시는 보통 `3:1` 형태) */
export type MatchScorePair = {
  home: number;
  away: number;
};

/** 다가오는 경기 카드에 표시할 데이터 */
export type UpcomingMatchDisplay = {
  /** Relay MatchModel.id (글로벌 ID 등). 포메이션 등 링크 쿼리에 사용 */
  matchId: string;
  formattedDateTime: string;
  homeTeam: MatchTeamDisplay;
  awayTeam: MatchTeamDisplay;
  /**
   * 종료 후 스코어. 있으면 `MatchInfo`에서 VS 대신 `home:away` 표기.
   * `MatchForUpcomingDisplay`의 `homeScore` / `awayScore`가 API로 채워지면 자동 반영.
   */
  matchScore?: MatchScorePair | null;
};

/** buildUpcomingMatchDisplay 입력: Relay findMatch 노드와 동일한 필드 구조 */
export type MatchForUpcomingDisplay = {
  /** Relay `Date` 스칼라 등으로 런타임에 null/비문자열일 수 있음 */
  matchDate?: string | null;
  startTime?: string | null;
  /** 비어 있거나 null이면 쿼터 길이로 추정(effectiveMatchEndMs) */
  endTime?: string | null;
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
  /**
   * 경기 종료 후 득점 (스키마 필드명은 백엔드와 맞춰 `mapFindMatchToUpcomingDisplay`에서 매핑).
   * 둘 다 유한 숫자일 때만 카드에 스코어 라인 표시.
   */
  homeScore?: number | null;
  awayScore?: number | null;
};

function resolveMatchScore(
  match: MatchForUpcomingDisplay,
): MatchScorePair | null {
  const h = match.homeScore;
  const a = match.awayScore;
  if (
    typeof h === "number" &&
    Number.isFinite(h) &&
    typeof a === "number" &&
    Number.isFinite(a)
  ) {
    return { home: h, away: a };
  }
  return null;
}

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

  const md = match.matchDate;
  const st = match.startTime;
  const formattedDateTime =
    md != null &&
    st != null &&
    String(md).trim() !== "" &&
    String(st).trim() !== ""
      ? formatMatchDateTime(String(md).trim(), String(st).trim())
      : "일정 미정";
  const createdName = match.createdTeam?.name?.trim() || "팀";
  const createdEmblem = match.createdTeam?.emblem?.trim() || DEFAULT_EMBLEM;

  const matchScore = resolveMatchScore(match);

  if (match.matchType === "INTERNAL") {
    return {
      matchId,
      formattedDateTime,
      homeTeam: { name: `${createdName} Team A`, emblemUrl: createdEmblem },
      awayTeam: { name: `${createdName} Team B`, emblemUrl: createdEmblem },
      matchScore,
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
    matchScore,
  };
}

/** 포메이션 페이지 경로 (Relay 글로벌 ID 또는 숫자 id 모두 처리) */
export function formationHrefFromDisplay(display: UpcomingMatchDisplay): string {
  const numericMatchId = parseNumericIdFromRelayGlobalId(display.matchId);
  return numericMatchId != null
    ? `/formation/${numericMatchId}`
    : `/formation/${encodeURIComponent(display.matchId)}`;
}
