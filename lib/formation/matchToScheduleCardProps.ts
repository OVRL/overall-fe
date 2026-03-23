import type { UniformDesign } from "@/app/create-team/_lib/uniformDesign";
import {
  parseUniformDesignFromApi,
} from "@/app/create-team/_lib/uniformDesign";
import { formatFormationMatchSchedule } from "@/utils/date/formatFormationMatchSchedule";
import type { MatchForUpcoming } from "@/utils/fetchFindMatchSSR";

export type MatchScheduleVenueInput = {
  address: string;
  latitude: number;
  longitude: number;
};

/** MatchScheduleCard에 넘기기 위한 findMatch 1건 매핑 결과 */
export type MatchScheduleCardData = {
  matchScheduleLine: string;
  venue: MatchScheduleVenueInput;
  opponent: string;
  /** 추후 상대 전적 API — 현재 카드에서 숨김 처리 */
  opponentRecord: string;
  uniformDesign: UniformDesign;
  /** 유니폼 행 보조 라벨 (HOME/AWAY) */
  uniformKindLabel: string;
  /** 매칭 상대 엠블럼 (내전은 생성 팀 엠블럼과 동일 소스) */
  opponentEmblemSrc: string | null | undefined;
};

function opponentDisplayName(match: MatchForUpcoming): string {
  const createdName = match.createdTeam?.name?.trim() || "팀";
  if (match.matchType === "INTERNAL") {
    return `${createdName} Team B`;
  }
  return match.opponentTeam?.name?.trim() || "상대팀";
}

function resolveOpponentEmblemSrc(
  match: MatchForUpcoming,
): string | null | undefined {
  if (match.matchType === "INTERNAL") {
    return match.createdTeam?.emblem ?? null;
  }
  return match.opponentTeam?.emblem ?? null;
}

function pickUniformDesign(match: MatchForUpcoming): UniformDesign {
  const team = match.createdTeam;
  const isAway = match.uniformType === "AWAY";
  const raw = isAway ? team?.awayUniform : team?.homeUniform;
  return parseUniformDesignFromApi(raw ?? undefined);
}

/**
 * findMatch(SSR) 한 건을 MatchScheduleCard props 데이터로 변환합니다.
 */
export function matchToScheduleCardData(
  match: MatchForUpcoming,
): MatchScheduleCardData {
  const matchScheduleLine = formatFormationMatchSchedule(
    match.matchDate,
    match.startTime,
    match.endTime,
  );

  const venue = match.venue;

  const uniformKindLabel =
    match.uniformType === "AWAY" ? "어웨이 유니폼" : "홈 유니폼";

  return {
    matchScheduleLine,
    venue: {
      address: venue.address,
      latitude: venue.latitude,
      longitude: venue.longitude,
    },
    opponent: opponentDisplayName(match),
    opponentRecord: "",
    uniformDesign: pickUniformDesign(match),
    uniformKindLabel,
    opponentEmblemSrc: resolveOpponentEmblemSrc(match),
  };
}
