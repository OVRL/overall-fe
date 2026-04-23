import type { Player } from "@/types/formation";
import { filterPlayersForInHouseLineupTab } from "../filterPlayersForInHouseLineupTab";

const base = (id: number, name: string): Player =>
  ({
    id,
    name,
    position: "ST",
    number: id,
    overall: 70,
  }) as Player;

describe("filterPlayersForInHouseLineupTab", () => {
  const aOnly = base(1, "A만");
  const bOnly = base(2, "B만");
  const unassigned = base(3, "미배정");

  const getDraftTeam = (p: Player) => {
    if (p.id === 1) return "A" as const;
    if (p.id === 2) return "B" as const;
    return null;
  };

  const all = [aOnly, bOnly, unassigned];

  it("draft 모드이면 전체 명단을 그대로 둔다", () => {
    expect(
      filterPlayersForInHouseLineupTab(all, "draft", getDraftTeam),
    ).toEqual(all);
  });

  it("A 탭이면 A에 배정된 선수만 남긴다", () => {
    expect(filterPlayersForInHouseLineupTab(all, "A", getDraftTeam)).toEqual([
      aOnly,
    ]);
  });

  it("B 탭이면 B에 배정된 선수만 남긴다", () => {
    expect(filterPlayersForInHouseLineupTab(all, "B", getDraftTeam)).toEqual([
      bOnly,
    ]);
  });

  it("getDraftTeam이 없으면 필터하지 않는다", () => {
    expect(filterPlayersForInHouseLineupTab(all, "A", undefined)).toEqual(all);
  });

  it("formationRosterViewMode가 undefined면 전체 명단을 그대로 둔다", () => {
    expect(
      filterPlayersForInHouseLineupTab(all, undefined, getDraftTeam),
    ).toEqual(all);
  });
});
