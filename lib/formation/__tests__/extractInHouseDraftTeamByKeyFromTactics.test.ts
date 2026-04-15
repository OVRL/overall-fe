import { extractInHouseDraftTeamByKeyFromTactics } from "../extractInHouseDraftTeamByKeyFromTactics";
import { MATCH_FORMATION_TACTICS_DOCUMENT_VERSION } from "@/types/matchFormationTacticsDocument";

describe("extractInHouseDraftTeamByKeyFromTactics", () => {
  it("inHouseDraftTeamByKey를 추출한다", () => {
    const out = extractInHouseDraftTeamByKeyFromTactics({
      schemaVersion: MATCH_FORMATION_TACTICS_DOCUMENT_VERSION,
      matchType: "INTERNAL",
      quarters: [],
      inHouseDraftTeamByKey: { "t:20": "A", "m:9": "B" },
    });
    expect(out).toEqual({ "t:20": "A", "m:9": "B" });
  });

  it("잘못된 값은 건너뛴다", () => {
    const out = extractInHouseDraftTeamByKeyFromTactics({
      schemaVersion: MATCH_FORMATION_TACTICS_DOCUMENT_VERSION,
      matchType: "INTERNAL",
      quarters: [],
      inHouseDraftTeamByKey: { "t:1": "A", bad: "X", "m:2": "C" },
    });
    expect(out).toEqual({ "t:1": "A" });
  });

  it("필드 없으면 {}", () => {
    expect(
      extractInHouseDraftTeamByKeyFromTactics({
        schemaVersion: MATCH_FORMATION_TACTICS_DOCUMENT_VERSION,
        matchType: "INTERNAL",
        quarters: [],
      }),
    ).toEqual({});
  });
});
