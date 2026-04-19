import type { findMatchQuery$data } from "@/__generated__/findMatchQuery.graphql";
import type { MatchForUpcomingDisplay } from "@/components/home/UpcomingMatch/upcomingMatchDisplay";

export type FindMatchRelayNode = findMatchQuery$data["findMatch"][number];

/** Relay `MatchType`은 `%future added value` 등을 포함 — 레이아웃용 리터럴 유니온으로만 넘김 */
function matchTypeForUpcomingDisplay(
  matchType: FindMatchRelayNode["matchType"],
): MatchForUpcomingDisplay["matchType"] {
  if (matchType === "INTERNAL" || matchType === "MATCH") {
    return matchType;
  }
  return "MATCH";
}

/** GraphQL `Date` / ISO 문자열 등을 `YYYY-MM-DD`로 통일 */
function normalizeMatchDateScalar(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "string") {
    const t = value.trim();
    if (t === "") return null;
    if (t.length >= 10 && t[4] === "-" && t[7] === "-") {
      return t.slice(0, 10);
    }
    return null;
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getFullYear();
    const mo = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${mo}-${d}`;
  }
  return null;
}

/**
 * Relay `findMatch` 노드 배열 → 홈 레이아웃 계산용 `MatchForUpcomingDisplay[]`.
 * (서버·클라이언트 공통 스키마 가정; Relay 응답만 아는 모듈)
 *
 * 종료 스코어: `MatchModel`에 득점 필드가 생기면 `findMatchQuery`에 선택 필드를 추가하고
 * 여기서 `homeScore` / `awayScore`(또는 백엔드 필드명에 맞게)로 넘기면
 * `buildUpcomingMatchDisplay` → `UpcomingMatchDisplay.matchScore` → VS 대신 점수 표기.
 */
export function mapFindMatchNodesToMatchForUpcomingDisplay(
  nodes: ReadonlyArray<FindMatchRelayNode> | null | undefined,
): MatchForUpcomingDisplay[] {
  if (nodes == null || nodes.length === 0) return [];
  return nodes.map((n) => ({
    id: n.id,
    matchDate: normalizeMatchDateScalar(n.matchDate),
    startTime: n.startTime ?? null,
    endTime: n.endTime ?? null,
    quarterCount: n.quarterCount ?? 0,
    quarterDuration: n.quarterDuration ?? 0,
    voteDeadline: n.voteDeadline ?? null,
    isFormationDraft: n.isFormationDraft,
    matchType: matchTypeForUpcomingDisplay(n.matchType),
    createdTeam: n.createdTeam,
    opponentTeam: n.opponentTeam,
    // homeScore / awayScore — 스키마·쿼리 반영 후 예: n.homeScore ?? null
  }));
}
