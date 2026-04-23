import type { Player } from "@/types/formation";
import type { MatchFormationTacticsPlayerRef } from "@/types/matchFormationTactics";
import { isMercenaryTacticsRef } from "@/types/matchFormationTactics";

/** 저장된 tactics 슬롯 ref → 현재 라인업 후보 `Player` */
export type FormationLineupResolver = (
  ref: MatchFormationTacticsPlayerRef,
) => Player | null;

/**
 * 팀원(`id` = teamMemberId)과 용병(`mercenaryId`)을 분리해 tactics 복원 시 충돌을 막습니다.
 */
export function createFormationLineupResolver(
  players: readonly Player[],
): FormationLineupResolver {
  const byTeamMemberId = new Map<number, Player>();
  const byMercenaryId = new Map<number, Player>();
  for (const p of players) {
    if (p.rosterKind === "MERCENARY" && p.mercenaryId != null) {
      byMercenaryId.set(p.mercenaryId, p);
    } else {
      byTeamMemberId.set(p.id, p);
    }
  }
  return (ref: MatchFormationTacticsPlayerRef) => {
    if (isMercenaryTacticsRef(ref)) {
      return byMercenaryId.get(ref.mercenaryId) ?? null;
    }
    return byTeamMemberId.get(ref.teamMemberId) ?? null;
  };
}
