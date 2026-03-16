import { formatMatchDateTime } from "@/utils/date/formatMatchDateTime";
import { getValidImageSrc, MOCK_EMBLEM_SRC } from "@/lib/utils";

/**
 * findMatch 노드 한 건에 대응하는 표시용 타입 (필요 필드만)
 */
export type MatchForDisplay = {
  matchDate: unknown;
  startTime: string;
  matchType: string;
  description?: string | null;
  uniformType?: string | null;
  createdTeam?: { emblem?: string | null } | null;
  opponentTeam?: { name?: string | null; emblem?: string | null } | null;
  venue?: {
    address: string;
    latitude: number;
    longitude: number;
  } | null;
};

/** 표시용 파생 값 (한 곳에서만 변경 이유: "매치 표시 규칙") */
export type MatchDisplay = {
  isInternal: boolean;
  opponentLabel: string;
  emblemSrc: string;
  showRecord: boolean;
  formattedDate: string;
  venue: MatchForDisplay["venue"];
  hasValidCoordinates: boolean;
  showUniformRow: boolean;
  description: string;
};

/**
 * 매치 원본 → 모달 표시용 파생 값.
 * SRP: "매치를 어떻게 표시할지"에 대한 변경은 이 함수만 수정하면 됨.
 */
export function getMatchDisplay(match: MatchForDisplay): MatchDisplay {
  const isInternal = match.matchType === "INTERNAL";
  const opponentLabel = isInternal
    ? "내전"
    : match.opponentTeam?.name?.trim() ?? "상대팀";
  const emblemSrc = isInternal
    ? getValidImageSrc(match.createdTeam?.emblem, MOCK_EMBLEM_SRC)
    : getValidImageSrc(match.opponentTeam?.emblem, MOCK_EMBLEM_SRC);
  const venue = match.venue ?? null;
  const hasValidCoordinates =
    venue != null &&
    venue.latitude !== 0 &&
    venue.longitude !== 0 &&
    Number.isFinite(venue.latitude) &&
    Number.isFinite(venue.longitude);

  return {
    isInternal,
    opponentLabel,
    emblemSrc,
    showRecord: !isInternal,
    formattedDate: formatMatchDateTime(
      String(match.matchDate),
      match.startTime,
    ),
    venue,
    hasValidCoordinates: Boolean(hasValidCoordinates),
    showUniformRow: !isInternal,
    description: match.description?.trim() ?? "-",
  };
}
