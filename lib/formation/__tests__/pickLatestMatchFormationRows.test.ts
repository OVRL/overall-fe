import {
  pickLatestConfirmedMatchFormationRow,
  pickLatestDraftMatchFormationRow,
} from "../pickLatestMatchFormationRows";

describe("pickLatestConfirmedMatchFormationRow", () => {
  it("확정 행만 골라 updatedAt 최신 1건을 반환한다", () => {
    const row = pickLatestConfirmedMatchFormationRow([
      { id: 1, isDraft: false, updatedAt: "2026-01-01T00:00:00.000Z" },
      { id: 2, isDraft: true, updatedAt: "2026-01-10T00:00:00.000Z" },
      { id: 3, isDraft: false, updatedAt: "2026-01-05T00:00:00.000Z" },
    ]);
    expect(row?.id).toBe(3);
  });

  it("확정이 없으면 null", () => {
    expect(
      pickLatestConfirmedMatchFormationRow([
        { id: 1, isDraft: true, updatedAt: "2026-01-01T00:00:00.000Z" },
      ]),
    ).toBeNull();
  });
});

describe("pickLatestDraftMatchFormationRow", () => {
  it("드래프트만 골라 updatedAt 최신 1건을 반환한다", () => {
    const row = pickLatestDraftMatchFormationRow([
      { id: 1, isDraft: true, updatedAt: "2026-01-01T00:00:00.000Z" },
      { id: 2, isDraft: false, updatedAt: "2026-01-10T00:00:00.000Z" },
      { id: 3, isDraft: true, updatedAt: "2026-01-08T00:00:00.000Z" },
    ]);
    expect(row?.id).toBe(3);
  });

  it("드래프트가 없으면 null", () => {
    expect(
      pickLatestDraftMatchFormationRow([
        { id: 1, isDraft: false, updatedAt: "2026-01-01T00:00:00.000Z" },
      ]),
    ).toBeNull();
  });
});
