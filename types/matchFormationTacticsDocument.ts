import type { FormationType } from "@/constants/formation";
import type {
  FormationSlotKey,
  MatchFormationTacticsPlayerRef,
} from "@/types/matchFormationTactics";

/**
 * 매치+팀당 1행 드래프트의 `tactics` JSON 계약 (스냅샷 문서).
 * GraphQL `MatchType` enum 문자열과 동일하게 둡니다.
 */
export const MATCH_FORMATION_TACTICS_DOCUMENT_VERSION = 2 as const;

export type FormationDocumentMatchType = "MATCH" | "INTERNAL";

export interface MatchFormationTacticsTeamBoardSnapshot {
  formation: FormationType;
  lineup: Partial<Record<FormationSlotKey, MatchFormationTacticsPlayerRef>>;
}

export interface MatchFormationQuarterMatchingSnapshot {
  quarterId: number;
  updatedAt: string;
  kind: "MATCHING";
  formation: FormationType;
  lineup: Partial<Record<FormationSlotKey, MatchFormationTacticsPlayerRef>>;
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
}
