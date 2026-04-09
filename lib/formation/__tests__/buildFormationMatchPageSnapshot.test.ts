import { buildFormationMatchPageSnapshot } from "../buildFormationMatchPageSnapshot";

const quarterSpec = { quarterCount: 1, matchType: "INTERNAL" as const };

describe("buildFormationMatchPageSnapshot", () => {
  it("확정+드래프트가 있으면 보드는 확정 기준이고 draftFormationId는 null이다", () => {
    const snap = buildFormationMatchPageSnapshot({
      players: [],
      formationRows: [
        {
          id: 72,
          isDraft: false,
          updatedAt: "2026-01-02T00:00:00.000Z",
          tactics: {
            schemaVersion: 2,
            matchType: "INTERNAL",
            quarters: [
              {
                quarterId: 1,
                updatedAt: "2026-01-01T00:00:00.000Z",
                kind: "IN_HOUSE",
                teams: {
                  A: { formation: "4-3-3", lineup: {} },
                  B: { formation: "4-3-3", lineup: {} },
                },
              },
            ],
          },
        },
        {
          id: 73,
          isDraft: true,
          updatedAt: "2026-01-10T00:00:00.000Z",
          tactics: {
            schemaVersion: 2,
            matchType: "INTERNAL",
            quarters: [
              {
                quarterId: 1,
                updatedAt: "2026-01-01T00:00:00.000Z",
                kind: "IN_HOUSE",
                teams: {
                  A: { formation: "4-4-2", lineup: {} },
                  B: { formation: "4-4-2", lineup: {} },
                },
              },
            ],
          },
        },
      ],
      quarterSpec,
    });

    expect(snap.initialBoardSource).toBe("confirmed");
    expect(snap.boardRowId).toBe(72);
    expect(snap.confirmedFormationId).toBe(72);
    expect(snap.draftFormationId).toBeNull();
    expect(snap.initialQuarters?.[0]?.formation).toBe("4-3-3");
  });

  it("드래프트만 있으면 draftFormationId가 채워진다", () => {
    const snap = buildFormationMatchPageSnapshot({
      players: [],
      formationRows: [
        {
          id: 73,
          isDraft: true,
          updatedAt: "2026-01-10T00:00:00.000Z",
          tactics: {
            schemaVersion: 2,
            matchType: "INTERNAL",
            quarters: [
              {
                quarterId: 1,
                updatedAt: "2026-01-01T00:00:00.000Z",
                kind: "IN_HOUSE",
                teams: {
                  A: { formation: "4-4-2", lineup: {} },
                  B: { formation: "4-4-2", lineup: {} },
                },
              },
            ],
          },
        },
      ],
      quarterSpec,
    });

    expect(snap.initialBoardSource).toBe("draft");
    expect(snap.boardRowId).toBe(73);
    expect(snap.confirmedFormationId).toBeNull();
    expect(snap.draftFormationId).toBe(73);
  });

  it("행이 없으면 empty", () => {
    const snap = buildFormationMatchPageSnapshot({
      players: [],
      formationRows: [],
      quarterSpec,
    });
    expect(snap.initialBoardSource).toBe("empty");
    expect(snap.initialQuarters).toBeNull();
    expect(snap.draftFormationId).toBeNull();
    expect(snap.confirmedFormationId).toBeNull();
  });
});
