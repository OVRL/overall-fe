import type { MatchFormationTacticsPlayerRef } from "@/types/matchFormationTactics";

/**
 * `tactics` JSON 슬롯에 들어있는 ref(알 수 없는 객체)를 정규 타입으로 바꿉니다.
 * v2 레거시: `{ teamMemberId }` 만 존재 → 팀원으로 간주합니다.
 */
export function normalizeTacticsSlotPlayerRef(
  raw: unknown,
): MatchFormationTacticsPlayerRef | null {
  if (raw == null || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (r.kind === "MERCENARY" && typeof r.mercenaryId === "number") {
    return {
      kind: "MERCENARY",
      mercenaryId: r.mercenaryId,
      displayName: typeof r.displayName === "string" ? r.displayName : undefined,
      backNumber: typeof r.backNumber === "number" ? r.backNumber : undefined,
      position: typeof r.position === "string" ? r.position : undefined,
    };
  }
  if (typeof r.teamMemberId === "number") {
    return {
      kind: "TEAM_MEMBER",
      teamMemberId: r.teamMemberId,
      displayName: typeof r.displayName === "string" ? r.displayName : undefined,
      backNumber: typeof r.backNumber === "number" ? r.backNumber : undefined,
      position: typeof r.position === "string" ? r.position : undefined,
    };
  }
  return null;
}
