import type { Player, QuarterData } from "@/types/formation";
import type { FormationSlotKey } from "@/types/matchFormationTactics";
import type { MatchFormationTacticsPlayerRef } from "@/types/matchFormationTactics";
import {
  MATCH_FORMATION_TACTICS_DOCUMENT_VERSION,
  type FormationDocumentMatchType,
  type MatchFormationTacticsDocument,
} from "@/types/matchFormationTacticsDocument";

function playerToRef(p: Player): MatchFormationTacticsPlayerRef {
  return {
    teamMemberId: p.id,
    displayName: p.name,
    backNumber: p.number,
  };
}

/**
 * UI `QuarterData` 슬롯 맵(1~11) → 저장용 슬롯 키 맵.
 */
export function lineupRecordToSlotMap(
  slots: Record<number, Player | null> | undefined,
): Partial<Record<FormationSlotKey, MatchFormationTacticsPlayerRef>> {
  if (slots == null) return {};
  const out: Partial<Record<FormationSlotKey, MatchFormationTacticsPlayerRef>> =
    {};
  for (let i = 1; i <= 11; i += 1) {
    const p = slots[i];
    if (p == null) continue;
    const key = String(i) as FormationSlotKey;
    out[key] = playerToRef(p);
  }
  return out;
}

/**
 * 현재 빌더 상태를 드래프트 1행 `tactics` 문서로 직렬화합니다.
 * (서버: match+team당 드래프트 1행 — GraphQL `quarter`는 스키마 필수값용으로 별도 전달)
 */
export function buildMatchFormationTacticsDocumentFromQuarters(
  quarters: QuarterData[],
  matchType: FormationDocumentMatchType,
  now: Date = new Date(),
): MatchFormationTacticsDocument {
  const updatedAt = now.toISOString();
  return {
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
        return {
          quarterId: q.id,
          updatedAt,
          kind: "IN_HOUSE",
          teams: {
            A: {
              formation: q.formation,
              lineup: lineupRecordToSlotMap(effectiveA),
            },
            B: {
              formation: q.formation,
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
}
