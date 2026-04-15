import { buildMatchFormationTacticsDocumentFromQuarters } from "../buildMatchFormationTacticsDocument";
import type { QuarterData } from "@/types/formation";
import { MATCH_FORMATION_TACTICS_DOCUMENT_VERSION } from "@/types/matchFormationTacticsDocument";

describe("buildMatchFormationTacticsDocumentFromQuarters", () => {
  const fixedNow = new Date("2026-03-15T12:00:00.000Z");

  it("MATCHING 쿼터는 formation·lineup 슬롯을 담는다", () => {
    const quarters: QuarterData[] = [
      {
        id: 1,
        type: "MATCHING",
        formation: "4-3-3",
        matchup: { home: "A", away: "B" },
        lineup: {
          1: {
            id: 101,
            name: "김정수",
            position: "GK",
            number: 1,
            overall: 80,
          },
        },
      },
    ];
    const doc = buildMatchFormationTacticsDocumentFromQuarters(
      quarters,
      "MATCH",
      fixedNow,
    );
    expect(doc.schemaVersion).toBe(MATCH_FORMATION_TACTICS_DOCUMENT_VERSION);
    expect(doc.matchType).toBe("MATCH");
    expect(doc.quarters).toHaveLength(1);
    const q0 = doc.quarters[0];
    expect(q0.kind).toBe("MATCHING");
    if (q0.kind !== "MATCHING") throw new Error("narrow");
    expect(q0.quarterId).toBe(1);
    expect(q0.updatedAt).toBe(fixedNow.toISOString());
    expect(q0.formation).toBe("4-3-3");
    expect(q0.lineup["1"]).toEqual({
      kind: "TEAM_MEMBER",
      teamMemberId: 101,
      displayName: "김정수",
      backNumber: 1,
      position: "GK",
    });
  });

  it("IN_HOUSE 쿼터는 teams A/B 라인업을 담는다", () => {
    const quarters: QuarterData[] = [
      {
        id: 2,
        type: "IN_HOUSE",
        formation: "4-4-2",
        matchup: { home: "A", away: "B" },
        lineup: {},
        teamA: {
          11: {
            id: 201,
            name: "A선수",
            position: "ST",
            number: 9,
            overall: 85,
          },
        },
        teamB: {
          1: {
            id: 301,
            name: "B키퍼",
            position: "GK",
            number: 1,
            overall: 82,
          },
        },
      },
    ];
    const doc = buildMatchFormationTacticsDocumentFromQuarters(
      quarters,
      "INTERNAL",
      fixedNow,
    );
    expect(doc.matchType).toBe("INTERNAL");
    const q0 = doc.quarters[0];
    expect(q0.kind).toBe("IN_HOUSE");
    if (q0.kind !== "IN_HOUSE") throw new Error("narrow");
    expect(q0.teams.A.formation).toBe("4-4-2");
    expect(q0.teams.B.formation).toBe("4-4-2");
    expect(q0.teams.A.lineup["11"]).toMatchObject({
      kind: "TEAM_MEMBER",
      teamMemberId: 201,
    });
    expect(q0.teams.B.lineup["1"]).toMatchObject({
      kind: "TEAM_MEMBER",
      teamMemberId: 301,
    });
  });

  it("IN_HOUSE는 formationTeamA·formationTeamB가 있으면 tactics 팀별 formation에 반영한다", () => {
    const quarters: QuarterData[] = [
      {
        id: 1,
        type: "IN_HOUSE",
        formation: "4-3-3",
        formationTeamA: "4-3-3",
        formationTeamB: "4-4-2",
        matchup: { home: "A", away: "B" },
        lineup: {},
        teamA: {},
        teamB: {},
      },
    ];
    const doc = buildMatchFormationTacticsDocumentFromQuarters(
      quarters,
      "INTERNAL",
      fixedNow,
    );
    const q0 = doc.quarters[0];
    if (q0.kind !== "IN_HOUSE") throw new Error("narrow");
    expect(q0.teams.A.formation).toBe("4-3-3");
    expect(q0.teams.B.formation).toBe("4-4-2");
  });

  it("IN_HOUSE에서 teamA/B가 비어 있고 lineup만 있으면 A팀 tactics로 폴백한다", () => {
    const quarters: QuarterData[] = [
      {
        id: 1,
        type: "IN_HOUSE",
        formation: "4-3-3",
        matchup: { home: "A", away: "B" },
        lineup: {
          5: {
            id: 99,
            name: "레거시",
            position: "ST",
            number: 10,
            overall: 70,
          },
        },
      },
    ];
    const doc = buildMatchFormationTacticsDocumentFromQuarters(
      quarters,
      "INTERNAL",
      fixedNow,
    );
    const q0 = doc.quarters[0];
    if (q0.kind !== "IN_HOUSE") throw new Error("narrow");
    expect(q0.teams.A.lineup["5"]).toMatchObject({
      kind: "TEAM_MEMBER",
      teamMemberId: 99,
    });
    expect(Object.keys(q0.teams.B.lineup)).toHaveLength(0);
  });

  it("INTERNAL이면 inHouseDraftTeamByKey를 tactics 루트에 넣는다", () => {
    const quarters: QuarterData[] = [
      {
        id: 1,
        type: "IN_HOUSE",
        formation: "4-3-3",
        matchup: { home: "A", away: "B" },
        lineup: {},
        teamA: {},
        teamB: {},
      },
    ];
    const doc = buildMatchFormationTacticsDocumentFromQuarters(
      quarters,
      "INTERNAL",
      {
        inHouseDraftTeamByKey: { "t:1": "A", "m:9": "B" },
      },
    );
    expect(doc.inHouseDraftTeamByKey).toEqual({ "t:1": "A", "m:9": "B" });
  });

  it("INTERNAL이고 드래프트 옵션 없으면 inHouseDraftTeamByKey는 빈 객체", () => {
    const quarters: QuarterData[] = [
      {
        id: 1,
        type: "IN_HOUSE",
        formation: "4-3-3",
        matchup: { home: "A", away: "B" },
        lineup: {},
      },
    ];
    const doc = buildMatchFormationTacticsDocumentFromQuarters(
      quarters,
      "INTERNAL",
      fixedNow,
    );
    expect(doc.inHouseDraftTeamByKey).toEqual({});
  });
});
