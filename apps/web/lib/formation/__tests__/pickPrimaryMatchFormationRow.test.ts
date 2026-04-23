import {
  pickLatestConfirmedMatchFormationRow,
  pickLatestDraftMatchFormationRow,
  pickPrimaryMatchFormationRow,
} from "../pickPrimaryMatchFormationRow";

describe("pickPrimaryMatchFormationRow", () => {
  it("확정본이 있으면 드래프트보다 우선하고, 확정 중 id가 가장 큰 행을 고른다", () => {
    const row = pickPrimaryMatchFormationRow([
      { id: 10, isDraft: true },
      { id: 5, isDraft: false },
      { id: 7, isDraft: false },
    ]);
    expect(row?.id).toBe(7);
    expect(row?.isDraft).toBe(false);
  });

  it("확정본이 없으면 드래프트 중 id가 가장 큰 행을 고른다", () => {
    const row = pickPrimaryMatchFormationRow([
      { id: 3, isDraft: true },
      { id: 9, isDraft: true },
    ]);
    expect(row?.id).toBe(9);
    expect(row?.isDraft).toBe(true);
  });

  it("빈 배열이면 null", () => {
    expect(pickPrimaryMatchFormationRow([])).toBeNull();
    expect(pickPrimaryMatchFormationRow(undefined)).toBeNull();
  });
});

describe("pickLatestDraftMatchFormationRow", () => {
  it("드래프트만 id 최대", () => {
    expect(
      pickLatestDraftMatchFormationRow([
        { id: 1, isDraft: false },
        { id: 100, isDraft: true },
        { id: 50, isDraft: true },
      ])?.id,
    ).toBe(100);
  });

  it("드래프트 없으면 null", () => {
    expect(
      pickLatestDraftMatchFormationRow([{ id: 1, isDraft: false }]),
    ).toBeNull();
  });
});

describe("pickLatestConfirmedMatchFormationRow", () => {
  it("확정만 id 최대", () => {
    expect(
      pickLatestConfirmedMatchFormationRow([
        { id: 200, isDraft: true },
        { id: 77, isDraft: false },
        { id: 10, isDraft: false },
      ])?.id,
    ).toBe(77);
  });

  it("확정 없으면 null", () => {
    expect(
      pickLatestConfirmedMatchFormationRow([{ id: 1, isDraft: true }]),
    ).toBeNull();
  });
});
