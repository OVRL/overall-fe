import {
  areAllQuartersFormationComplete,
  isQuarterFormationBoardComplete,
} from "../areAllQuartersFormationComplete";
import type { Player } from "@/types/formation";

const p = (id: number): Player => ({
  id,
  name: `p${id}`,
  position: "ST",
  number: id,
  overall: 70,
});

describe("isQuarterFormationBoardComplete", () => {
  it("MATCHING: 11슬롯이 모두 차야 true", () => {
    const lineup: Record<number, Player | null> = {};
    for (let i = 1; i <= 11; i += 1) lineup[i] = p(i);
    expect(
      isQuarterFormationBoardComplete({
        id: 1,
        type: "MATCHING",
        formation: "4-3-3",
        lineup,
        matchup: { home: "A", away: "B" },
      }),
    ).toBe(true);
  });

  it("MATCHING: 빈 슬롯이 있으면 false", () => {
    expect(
      isQuarterFormationBoardComplete({
        id: 1,
        type: "MATCHING",
        formation: "4-3-3",
        lineup: { 1: p(1) },
        matchup: { home: "A", away: "B" },
      }),
    ).toBe(false);
  });
});

describe("areAllQuartersFormationComplete", () => {
  it("모든 쿼터가 완성일 때만 true", () => {
    const fullLineup: Record<number, Player | null> = {};
    for (let i = 1; i <= 11; i += 1) fullLineup[i] = p(i);
    expect(
      areAllQuartersFormationComplete([
        {
          id: 1,
          type: "MATCHING",
          formation: "4-3-3",
          lineup: fullLineup,
          matchup: { home: "A", away: "B" },
        },
        {
          id: 2,
          type: "MATCHING",
          formation: "4-3-3",
          lineup: fullLineup,
          matchup: { home: "A", away: "B" },
        },
      ]),
    ).toBe(true);
  });

  it("하나라도 미완이면 false", () => {
    const fullLineup: Record<number, Player | null> = {};
    for (let i = 1; i <= 11; i += 1) fullLineup[i] = p(i);
    expect(
      areAllQuartersFormationComplete([
        {
          id: 1,
          type: "MATCHING",
          formation: "4-3-3",
          lineup: fullLineup,
          matchup: { home: "A", away: "B" },
        },
        {
          id: 2,
          type: "MATCHING",
          formation: "4-3-3",
          lineup: {},
          matchup: { home: "A", away: "B" },
        },
      ]),
    ).toBe(false);
  });
});
