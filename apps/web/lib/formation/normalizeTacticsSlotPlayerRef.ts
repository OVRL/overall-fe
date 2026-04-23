import type { MatchFormationTacticsPlayerRef } from "@/types/matchFormationTactics";
import { parseTacticsNumericId } from "@/lib/formation/tacticsNumericId";

/**
 * `tactics` JSON 슬롯에 들어있는 ref(알 수 없는 객체)를 정규 타입으로 바꿉니다.
 * v2 레거시: `{ teamMemberId }` 만 존재 → 팀원으로 간주합니다.
 * `mercenaryId` / `teamMemberId`는 숫자 또는 `"TypeName:123"`·`"123"` 문자열도 허용합니다.
 */
export function normalizeTacticsSlotPlayerRef(
  raw: unknown,
): MatchFormationTacticsPlayerRef | null {
  if (raw == null || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (r.kind === "MERCENARY") {
    const mercenaryId = parseTacticsNumericId(r.mercenaryId);
    if (mercenaryId == null) return null;
    return {
      kind: "MERCENARY",
      mercenaryId,
      displayName: typeof r.displayName === "string" ? r.displayName : undefined,
      backNumber: typeof r.backNumber === "number" ? r.backNumber : undefined,
      position: typeof r.position === "string" ? r.position : undefined,
    };
  }
  const teamMemberId = parseTacticsNumericId(r.teamMemberId);
  if (teamMemberId != null) {
    return {
      kind: "TEAM_MEMBER",
      teamMemberId,
      displayName: typeof r.displayName === "string" ? r.displayName : undefined,
      backNumber: typeof r.backNumber === "number" ? r.backNumber : undefined,
      position: typeof r.position === "string" ? r.position : undefined,
    };
  }
  return null;
}
