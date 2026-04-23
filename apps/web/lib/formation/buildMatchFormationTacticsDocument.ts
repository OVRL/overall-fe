import type { Player, QuarterData } from "@/types/formation";
import type { FormationSlotKey } from "@/types/matchFormationTactics";
import type { MatchFormationTacticsPlayerRef } from "@/types/matchFormationTactics";
import type { InHouseDraftTeamByPlayerKey } from "@/types/inHouseDraftTeam";
import {
  MATCH_FORMATION_TACTICS_DOCUMENT_VERSION,
  type FormationDocumentMatchType,
  type MatchFormationTacticsDocument,
} from "@/types/matchFormationTacticsDocument";

/** `buildMatchFormationTacticsDocumentFromQuarters` 세 번째 인자 — `Date`만 주면 기존 호환 */
export type BuildMatchFormationTacticsDocumentOptions = {
  now?: Date;
  /** INTERNAL일 때 tactics 루트에 함께 저장 (미주입 시 `{}`) */
  inHouseDraftTeamByKey?: InHouseDraftTeamByPlayerKey;
};

function playerToRef(p: Player): MatchFormationTacticsPlayerRef {
  if (p.rosterKind === "MERCENARY" && p.mercenaryId != null) {
    return {
      kind: "MERCENARY",
      mercenaryId: p.mercenaryId,
      displayName: p.name,
      backNumber: p.number,
      position: p.position,
    };
  }
  return {
    kind: "TEAM_MEMBER",
    teamMemberId: p.id,
    displayName: p.name,
    backNumber: p.number,
    position: p.position,
  };
}

/**
 * UI `QuarterData` 슬롯 맵(0~10) → 저장용 슬롯 키 맵(`"0"`…`"10"`).
 */
export function lineupRecordToSlotMap(
  slots: Record<number, Player | null> | undefined,
): Partial<Record<FormationSlotKey, MatchFormationTacticsPlayerRef>> {
  if (slots == null) return {};
  const out: Partial<Record<FormationSlotKey, MatchFormationTacticsPlayerRef>> =
    {};
  for (let i = 0; i <= 10; i += 1) {
    const p = slots[i];
    if (p == null) continue;
    const key = String(i) as FormationSlotKey;
    out[key] = playerToRef(p);
  }
  return out;
}

/**
 * 현재 빌더 상태를 드래프트 1행 `tactics` 문서로 직렬화합니다.
 * (서버: match+팀당 드래프트 1행 — GraphQL `quarter`는 스키마 필수값용으로 별도 전달)
 */
export function buildMatchFormationTacticsDocumentFromQuarters(
  quarters: QuarterData[],
  matchType: FormationDocumentMatchType,
  third?: Date | BuildMatchFormationTacticsDocumentOptions,
): MatchFormationTacticsDocument {
  let now = new Date();
  let inHouseDraftTeamByKey: InHouseDraftTeamByPlayerKey | undefined;
  if (third instanceof Date) {
    now = third;
  } else if (third != null && typeof third === "object") {
    if (third.now != null) now = third.now;
    inHouseDraftTeamByKey = third.inHouseDraftTeamByKey;
  }

  const updatedAt = now.toISOString();
  const doc: MatchFormationTacticsDocument = {
    schemaVersion: MATCH_FORMATION_TACTICS_DOCUMENT_VERSION,
    matchType,
    quarters: quarters.map((q) => {
      if (q.type === "IN_HOUSE") {
        const teamA = q.teamA ?? {};
        const teamB = q.teamB ?? {};
        const hasTeamSlots =
          Object.keys(teamA).length > 0 || Object.keys(teamB).length > 0;
        /** 구버전: lineup만 채우고 teamA/B는 비어 있던 경우 → A팀으로 저장 */
        const effectiveA = hasTeamSlots ? teamA : (q.lineup ?? {});
        const effectiveB = hasTeamSlots ? teamB : {};
        const formationTeamA = q.formationTeamA ?? q.formation;
        const formationTeamB = q.formationTeamB ?? q.formation;
        return {
          quarterId: q.id,
          updatedAt,
          kind: "IN_HOUSE",
          teams: {
            A: {
              formation: formationTeamA,
              lineup: lineupRecordToSlotMap(effectiveA),
            },
            B: {
              formation: formationTeamB,
              lineup: lineupRecordToSlotMap(effectiveB),
            },
          },
        };
      }
      return {
        quarterId: q.id,
        updatedAt,
        kind: "MATCHING",
        formation: q.formation,
        lineup: lineupRecordToSlotMap(q.lineup),
      };
    }),
  };

  if (matchType === "INTERNAL") {
    doc.inHouseDraftTeamByKey = inHouseDraftTeamByKey ?? {};
  }

  return doc;
}
