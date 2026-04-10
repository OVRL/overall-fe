import { buildQuarterDataFromTacticsDocument } from "../buildQuarterDataFromTacticsDocument";
import { MATCH_FORMATION_TACTICS_DOCUMENT_VERSION } from "@/types/matchFormationTacticsDocument";
import type { Player } from "@/types/formation";

describe("buildQuarterDataFromTacticsDocument", () => {
  const p1: Player = {
    id: 101,
    name: "김",
    position: "ST",
    number: 9,
    overall: 80,
  };

  it("스키마가 맞지 않으면 기본 쿼터만 반환한다", () => {
    const out = buildQuarterDataFromTacticsDocument(
      { schemaVersion: 1, matchType: "INTERNAL", quarters: [] },
      { quarterCount: 2, matchType: "INTERNAL" },
      () => null,
    );
    expect(out).toHaveLength(2);
    expect(out[0]?.formation).toBe("4-3-3");
  });

  it("MATCHING 쿼터에 라인업을 복원한다", () => {
    const doc = {
      schemaVersion: MATCH_FORMATION_TACTICS_DOCUMENT_VERSION,
      matchType: "MATCH" as const,
      quarters: [
        {
          quarterId: 1,
          updatedAt: "2026-01-01T00:00:00.000Z",
          kind: "MATCHING" as const,
          formation: "4-3-3",
          lineup: {
            "1": { teamMemberId: 101, displayName: "김", backNumber: 9 },
          },
        },
      ],
    };
    const out = buildQuarterDataFromTacticsDocument(doc, {
      quarterCount: 1,
      matchType: "MATCH",
    }, (id) => (id === 101 ? p1 : null));
    expect(out[0]?.type).toBe("MATCHING");
    expect(out[0]?.lineup?.[1]).toEqual(p1);
  });

  it("IN_HOUSE는 teamA/B와 기본 lineup(teamA 복사)을 채운다", () => {
    const doc = {
      schemaVersion: MATCH_FORMATION_TACTICS_DOCUMENT_VERSION,
      matchType: "INTERNAL" as const,
      quarters: [
        {
          quarterId: 1,
          updatedAt: "2026-01-01T00:00:00.000Z",
          kind: "IN_HOUSE" as const,
          teams: {
            A: {
              formation: "4-4-2",
              lineup: {
                "11": { teamMemberId: 101, displayName: "김", backNumber: 9 },
              },
            },
            B: { formation: "4-4-2", lineup: {} },
          },
        },
      ],
    };
    const out = buildQuarterDataFromTacticsDocument(doc, {
      quarterCount: 1,
      matchType: "INTERNAL",
    }, (id) => (id === 101 ? p1 : null));
    expect(out[0]?.type).toBe("IN_HOUSE");
    expect(out[0]?.formation).toBe("4-4-2");
    expect(out[0]?.teamA?.[11]).toEqual(p1);
    expect(out[0]?.lineup?.[11]).toEqual(p1);
  });
});
