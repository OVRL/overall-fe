import type { Player, QuarterData } from "@/types/formation";
import { getAssignedQuarterIdsForPlayerFromQuarters } from "../getAssignedQuarterIdsForPlayerFromQuarters";

const matchup = { home: "A" as const, away: "B" as const };

const player = (id: number): Player => ({
  id,
  name: `p${id}`,
  position: "FW",
  number: id,
  overall: 70,
});

describe("getAssignedQuarterIdsForPlayerFromQuarters", () => {
  it("MATCHING 쿼터는 lineup에 있을 때만 포함한다", () => {
    const quarters: QuarterData[] = [
      {
        id: 1,
        type: "MATCHING",
        formation: "4-3-3",
        lineup: { 0: player(10) },
        matchup,
      },
      {
        id: 2,
        type: "MATCHING",
        formation: "4-3-3",
        lineup: {},
        matchup,
      },
    ];
    const getIds = getAssignedQuarterIdsForPlayerFromQuarters(quarters);
    expect(getIds(10)).toEqual([1]);
    expect(getIds(99)).toEqual([]);
  });

  it("IN_HOUSE는 teamA·teamB·lineup 중 한 곳에 있으면 포함한다", () => {
    const quarters: QuarterData[] = [
      {
        id: 1,
        type: "IN_HOUSE",
        formation: "4-3-3",
        teamA: { 0: player(5) },
        teamB: {},
        lineup: {},
        matchup,
      },
      {
        id: 2,
        type: "IN_HOUSE",
        formation: "4-3-3",
        teamA: {},
        teamB: { 1: player(5) },
        lineup: {},
        matchup,
      },
      {
        id: 3,
        type: "IN_HOUSE",
        formation: "4-3-3",
        teamA: {},
        teamB: {},
        lineup: { 0: player(7) },
        matchup,
      },
    ];
    const getIds = getAssignedQuarterIdsForPlayerFromQuarters(quarters);
    expect(getIds(5)).toEqual([1, 2]);
    expect(getIds(7)).toEqual([3]);
  });

  it("쿼터 id는 오름차순으로 정렬된다", () => {
    const quarters: QuarterData[] = [
      {
        id: 3,
        type: "MATCHING",
        formation: "4-3-3",
        lineup: { 0: player(1) },
        matchup,
      },
      {
        id: 1,
        type: "MATCHING",
        formation: "4-3-3",
        lineup: { 0: player(1) },
        matchup,
      },
    ];
    const getIds = getAssignedQuarterIdsForPlayerFromQuarters(quarters);
    expect(getIds(1)).toEqual([1, 3]);
  });
});
