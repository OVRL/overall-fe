import type { FormationType } from "@/constants/formation";

/**
 * GraphQL `MatchFormationModel.tactics` / `UpdateMatchFormationInput.tactics`에 넣는 JSON 계약.
 *
 * - `findMatchFormation` / `updateMatchFormation`는 팀·매치 단위 행으로 `teamId`·`matchId` 등을 갖고,
 *   이 페이로드는 그 한 행에 대응하는 보드 상태만 담습니다.
 * - 좌표·슬롯 라벨(role)은 저장하지 않고 `FORMATIONS[formation][slot]`에서만 해석합니다.
 *
 * @see schema.graphql — MatchFormationModel, UpdateMatchFormationInput
 */

export const MATCH_FORMATION_TACTICS_SCHEMA_VERSION = 1 as const;

/** 보드 슬롯 1~11 — `FORMATIONS[formation]`의 키와 동일 */
export type FormationSlotKey =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11";

export const FORMATION_SLOT_KEYS: readonly FormationSlotKey[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
] as const;

/**
 * 슬롯에 배치된 선수 ref.
 * - 팀원: `TeamMemberModel.id` — v2 문서는 `kind` 생략을 팀원으로 간주합니다.
 * - 용병: `MatchMercenaryModel.id` — v3부터 `kind: "MERCENARY"`로 구분합니다.
 */
export type MatchFormationTacticsPlayerRef =
  | MatchFormationTacticsTeamMemberRef
  | MatchFormationTacticsMercenaryRef;

export interface MatchFormationTacticsTeamMemberRef {
  /** 생략 시 팀원으로 해석 (레거시 v2) */
  kind?: "TEAM_MEMBER";
  teamMemberId: number;
  displayName?: string;
  backNumber?: number;
  position?: string;
}

export interface MatchFormationTacticsMercenaryRef {
  kind: "MERCENARY";
  mercenaryId: number;
  displayName?: string;
  backNumber?: number;
  position?: string;
}

export function isMercenaryTacticsRef(
  ref: MatchFormationTacticsPlayerRef,
): ref is MatchFormationTacticsMercenaryRef {
  return ref.kind === "MERCENARY";
}

/** 한 팀의 포메이션 + 라인업 (매칭 1팀 / 내전 한쪽) */
export interface MatchFormationTacticsTeamBoard {
  formation: FormationType;
  lineup: Partial<Record<FormationSlotKey, MatchFormationTacticsPlayerRef>>;
}

/**
 * 매칭 등 — 한 팀·한 쿼터 보드.
 * 상위 `MatchFormationModel.teamId`가 어느 팀인지 나타냅니다.
 */
export interface MatchFormationTacticsSingle {
  schemaVersion: typeof MATCH_FORMATION_TACTICS_SCHEMA_VERSION;
  formation: FormationType;
  lineup: Partial<Record<FormationSlotKey, MatchFormationTacticsPlayerRef>>;
}

/**
 * 내전 — 같은 formation 행의 `tactics`에 A/B 양쪽을 함께 저장할 때 사용.
 * (백엔드가 행을 팀별로 쪼개 저장한다면 `MatchFormationTacticsSingle`만 쓰면 됩니다.)
 */
export interface MatchFormationTacticsInternalDual {
  schemaVersion: typeof MATCH_FORMATION_TACTICS_SCHEMA_VERSION;
  teams: {
    A: MatchFormationTacticsTeamBoard;
    B: MatchFormationTacticsTeamBoard;
  };
}

/** `JSONObject`로 오가는 tactics 본문 — 뮤테이션/쿼리 직렬화 시 이 형태를 유지 */
export type MatchFormationTacticsPayload =
  | MatchFormationTacticsSingle
  | MatchFormationTacticsInternalDual;

/** 내전 듀얼 페이로드 여부 (런타임 분기용) */
export function isMatchFormationTacticsInternalDual(
  payload: MatchFormationTacticsPayload,
): payload is MatchFormationTacticsInternalDual {
  return (
    payload != null &&
    typeof payload === "object" &&
    "teams" in payload &&
    payload.teams != null &&
    typeof payload.teams === "object" &&
    "A" in payload.teams &&
    "B" in payload.teams
  );
}
