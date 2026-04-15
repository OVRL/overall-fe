import type { QuarterData } from "@/types/formation";

const MAX_QUARTERS = 10;

/**
 * 경기 API의 quarterCount·matchType에 맞춰 포메이션용 QuarterData 배열을 만듭니다.
 */
export function buildQuartersFromMatch(
  quarterCount: number,
  matchType: "MATCH" | "INTERNAL",
): QuarterData[] {
  const n = Math.min(
    Math.max(Math.floor(Number(quarterCount)) || 1, 1),
    MAX_QUARTERS,
  );
  const type: QuarterData["type"] =
    matchType === "INTERNAL" ? "IN_HOUSE" : "MATCHING";

  return Array.from({ length: n }, (_, i) => {
    const base = {
      id: i + 1,
      type,
      formation: "4-3-3" as const,
      matchup: { home: "A" as const, away: "B" as const },
      lineup: {},
    };
    if (type === "IN_HOUSE") {
      return {
        ...base,
        formationTeamA: "4-3-3" as const,
        formationTeamB: "4-3-3" as const,
      };
    }
    return base;
  });
}
