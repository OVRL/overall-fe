import type { QuarterData } from "@/types/formation";

/**
 * `quarters` 기준으로 선수가 배치된 쿼터 id 목록 (오름차순).
 * 모바일 명단 `QuarterDotsMobile` 등에 전달하는 팩토리.
 */
export function getAssignedQuarterIdsForPlayerFromQuarters(
  quarters: QuarterData[],
): (playerId: number) => number[] {
  return (playerId: number): number[] => {
    return quarters
      .filter((q) => {
        if (q.type === "IN_HOUSE") {
          const inA = Object.values(q.teamA ?? {}).some(
            (p) => p?.id === playerId,
          );
          const inB = Object.values(q.teamB ?? {}).some(
            (p) => p?.id === playerId,
          );
          const inL = Object.values(q.lineup ?? {}).some(
            (p) => p?.id === playerId,
          );
          return inA || inB || inL;
        }
        return Object.values(q.lineup ?? {}).some((p) => p?.id === playerId);
      })
      .map((q) => q.id)
      .sort((a, b) => a - b);
  };
}
