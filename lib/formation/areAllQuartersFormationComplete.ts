import { FORMATIONS, type FormationType } from "@/constants/formation";
import type { QuarterData } from "@/types/formation";

function slotKeysForFormation(formation: FormationType): number[] {
  const board = FORMATIONS[formation];
  return Object.keys(board).map(Number);
}

function isSlotMapFull(
  slots: Record<number, unknown>,
  requiredIndices: number[],
): boolean {
  return requiredIndices.every((i) => slots[i] != null);
}

/** 내전: buildMatchFormationTacticsDocumentFromQuarters와 동일한 effective A/B */
function getInHouseEffectiveSides(q: QuarterData) {
  const teamA = q.teamA ?? {};
  const teamB = q.teamB ?? {};
  const hasTeamSlots =
    Object.keys(teamA).length > 0 || Object.keys(teamB).length > 0;
  const effectiveA = hasTeamSlots ? teamA : (q.lineup ?? {});
  const effectiveB = hasTeamSlots ? teamB : {};
  return { effectiveA, effectiveB };
}

/**
 * 단일 쿼터에 포메이션 타입에 맞는 슬롯(1~11)이 모두 배정되었는지.
 */
export function isQuarterFormationBoardComplete(q: QuarterData): boolean {
  const formation = q.formation as FormationType;
  if (!(formation in FORMATIONS)) return false;
  const keys = slotKeysForFormation(formation);

  if (q.type === "MATCHING") {
    return isSlotMapFull(q.lineup ?? {}, keys);
  }

  if (q.type === "IN_HOUSE") {
    const { effectiveA, effectiveB } = getInHouseEffectiveSides(q);
    return (
      isSlotMapFull(effectiveA, keys) && isSlotMapFull(effectiveB, keys)
    );
  }

  return false;
}

/**
 * 기획: 모든 쿼터에 포메이션이 등록되어야 확정 가능.
 */
export function areAllQuartersFormationComplete(
  quarters: QuarterData[],
): boolean {
  if (quarters.length === 0) return false;
  return quarters.every(isQuarterFormationBoardComplete);
}
