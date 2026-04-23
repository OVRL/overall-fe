import type { FormationType } from "@/constants/formation";
import type { InHouseDraftTeamByPlayerKey } from "@/types/inHouseDraftTeam";
import type { MatchFormationTacticsPlayerRef } from "@/types/matchFormationTactics";

/**
 * 매치+팀당 1행 드래프트의 `tactics` JSON 계약 (스냅샷 문서).
 * GraphQL `MatchType` enum 문자열과 동일하게 둡니다.
 *
 * 필드·의미·`schemaVersion` 정책: `docs/match-formation-tactics-document-contract.md`
 *
 * IN_HOUSE: `teams.A` / `teams.B` 각각 `formation` + `lineup`을 갖는다.
 * 두 `formation` 문자열은 **서로 달라도 계약상 유효**하며, 슬롯 키는 **v4부터 `"0"`…`"10"`**이며
 * 각 보드의 `formation`으로 해석한다 (동일 번호가 A/B에서 다른 포지션을 가리킬 수 있음).
 */
export const MATCH_FORMATION_TACTICS_DOCUMENT_VERSION = 4 as const;

/** v2 문서 — 슬롯 ref에 `teamMemberId`만 있음 (팀원 전용) */
export const MATCH_FORMATION_TACTICS_DOCUMENT_VERSION_LEGACY = 2 as const;

/** v3 문서 — 슬롯 키 `"1"`…`"11"` (읽기 시 UI 0~10으로 변환). 신규 저장은 v4 사용 */
export const MATCH_FORMATION_TACTICS_DOCUMENT_VERSION_V3 = 3 as const;

/** tactics `lineup` — v4는 `"0"`…`"10"`, 구버전은 `"1"`…`"11"` 등 혼재 가능 */
export type MatchFormationTacticsLineupRecord = Partial<
  Record<string, MatchFormationTacticsPlayerRef>
>;

export type FormationDocumentMatchType = "MATCH" | "INTERNAL";

export interface MatchFormationTacticsTeamBoardSnapshot {
  formation: FormationType;
  lineup: MatchFormationTacticsLineupRecord;
}

export interface MatchFormationQuarterMatchingSnapshot {
  quarterId: number;
  updatedAt: string;
  kind: "MATCHING";
  formation: FormationType;
  lineup: MatchFormationTacticsLineupRecord;
}

export interface MatchFormationQuarterInternalSnapshot {
  quarterId: number;
  updatedAt: string;
  kind: "IN_HOUSE";
  teams: {
    A: MatchFormationTacticsTeamBoardSnapshot;
    B: MatchFormationTacticsTeamBoardSnapshot;
  };
}

export type MatchFormationQuarterSnapshot =
  | MatchFormationQuarterMatchingSnapshot
  | MatchFormationQuarterInternalSnapshot;

export interface MatchFormationTacticsDocument {
  schemaVersion: typeof MATCH_FORMATION_TACTICS_DOCUMENT_VERSION;
  matchType: FormationDocumentMatchType;
  quarters: MatchFormationQuarterSnapshot[];
  /**
   * INTERNAL 전용 — 명단 탭 A/B 필터용 팀 드래프트.
   * 키: `getFormationRosterPlayerKey` (`t:` / `m:`).
   */
  inHouseDraftTeamByKey?: InHouseDraftTeamByPlayerKey;
}
