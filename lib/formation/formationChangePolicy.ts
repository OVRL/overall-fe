import type { FormationType } from "@/constants/formation";
import type { Player, QuarterData } from "@/types/formation";

/** 포메이션 드롭다운 변경이 적용되는 보드 범위 */
export type FormationChangeScope =
  | { kind: "MATCHING" }
  | { kind: "IN_HOUSE"; team: "A" | "B" };

export function hasOccupiedSlots(
  slots: Record<number, Player | null> | undefined,
): boolean {
  if (slots == null) return false;
  return Object.values(slots).some((p) => p != null);
}

export function getCurrentFormationForScope(
  q: QuarterData,
  scope: FormationChangeScope,
): FormationType {
  if (q.type === "MATCHING" || scope.kind === "MATCHING") {
    return q.formation;
  }
  return scope.team === "A"
    ? (q.formationTeamA ?? q.formation)
    : (q.formationTeamB ?? q.formation);
}

function slotsForScope(
  q: QuarterData,
  scope: FormationChangeScope,
): Record<number, Player | null> | undefined {
  if (scope.kind === "MATCHING") return q.lineup;
  return scope.team === "A" ? q.teamA : q.teamB;
}

/** 라인업이 비어 있지 않으면 포메이션 변경 전 사용자 확인이 필요하다. */
export function needsFormationChangeConfirm(
  q: QuarterData,
  scope: FormationChangeScope,
): boolean {
  return hasOccupiedSlots(slotsForScope(q, scope));
}

/**
 * 포메이션만 바꾸거나(keep), 해당 범위 슬롯을 비운다(clear).
 * IN_HOUSE + clear 시 `lineup`은 현재 탭 미러이므로 함께 비운다.
 */
export function applyFormationChangeDecision(
  q: QuarterData,
  nextFormation: FormationType,
  decision: "keep" | "clear",
  scope: FormationChangeScope,
): QuarterData {
  if (q.type === "MATCHING" || scope.kind === "MATCHING") {
    if (decision === "keep") {
      return { ...q, formation: nextFormation };
    }
    return { ...q, formation: nextFormation, lineup: {} };
  }

  if (q.type !== "IN_HOUSE") return q;

  if (scope.team === "A") {
    if (decision === "keep") {
      return { ...q, formationTeamA: nextFormation, formation: nextFormation };
    }
    return {
      ...q,
      formationTeamA: nextFormation,
      formation: nextFormation,
      teamA: {},
      lineup: {},
    };
  }

  if (decision === "keep") {
    return { ...q, formationTeamB: nextFormation, formation: nextFormation };
  }
  return {
    ...q,
    formationTeamB: nextFormation,
    formation: nextFormation,
    teamB: {},
    lineup: {},
  };
}
