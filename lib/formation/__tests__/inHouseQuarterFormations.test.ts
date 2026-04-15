import {
  getInHouseFormationForTeam,
  withInHouseFormationsNormalized,
} from "../inHouseQuarterFormations";
import type { QuarterData } from "@/types/formation";

describe("inHouseQuarterFormations", () => {
  it("getInHouseFormationForTeam은 formationTeam* 미설정 시 formation으로 폴백한다", () => {
    const q: QuarterData = {
      id: 1,
      type: "IN_HOUSE",
      formation: "4-4-2",
      matchup: { home: "A", away: "B" },
      lineup: {},
    };
    expect(getInHouseFormationForTeam(q, "A")).toBe("4-4-2");
    expect(getInHouseFormationForTeam(q, "B")).toBe("4-4-2");
  });

  it("getInHouseFormationForTeam은 팀별 필드를 우선한다", () => {
    const q: QuarterData = {
      id: 1,
      type: "IN_HOUSE",
      formation: "4-3-3",
      formationTeamA: "4-3-3",
      formationTeamB: "3-5-2",
      matchup: { home: "A", away: "B" },
      lineup: {},
    };
    expect(getInHouseFormationForTeam(q, "A")).toBe("4-3-3");
    expect(getInHouseFormationForTeam(q, "B")).toBe("3-5-2");
  });

  it("withInHouseFormationsNormalized는 IN_HOUSE에 formationTeam*를 채운다", () => {
    const q: QuarterData = {
      id: 1,
      type: "IN_HOUSE",
      formation: "4-4-2",
      matchup: { home: "A", away: "B" },
      lineup: {},
    };
    const n = withInHouseFormationsNormalized(q);
    expect(n.formationTeamA).toBe("4-4-2");
    expect(n.formationTeamB).toBe("4-4-2");
  });
});
