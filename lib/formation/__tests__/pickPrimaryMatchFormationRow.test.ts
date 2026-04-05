import { pickPrimaryMatchFormationRow } from "../pickPrimaryMatchFormationRow";

describe("pickPrimaryMatchFormationRow", () => {
  it("확정본이 있으면 드래프트보다 우선한다", () => {
    const row = pickPrimaryMatchFormationRow([
      { isDraft: true, updatedAt: "2026-01-02T00:00:00.000Z" },
      { isDraft: false, updatedAt: "2026-01-01T00:00:00.000Z" },
    ]);
    expect(row?.isDraft).toBe(false);
  });

  it("같은 풀에서 updatedAt이 가장 최근인 행을 고른다", () => {
    const row = pickPrimaryMatchFormationRow([
      { isDraft: false, updatedAt: "2026-01-01T00:00:00.000Z" },
      { isDraft: false, updatedAt: "2026-01-03T00:00:00.000Z" },
      { isDraft: false, updatedAt: "2026-01-02T00:00:00.000Z" },
    ]);
    expect(row?.updatedAt).toBe("2026-01-03T00:00:00.000Z");
  });

  it("확정본이 없으면 드래프트 중 최신을 고른다", () => {
    const row = pickPrimaryMatchFormationRow([
      { isDraft: true, updatedAt: "2026-01-01T00:00:00.000Z" },
      { isDraft: true, updatedAt: "2026-01-04T00:00:00.000Z" },
    ]);
    expect(row?.updatedAt).toBe("2026-01-04T00:00:00.000Z");
  });

  it("빈 배열이면 null", () => {
    expect(pickPrimaryMatchFormationRow([])).toBeNull();
    expect(pickPrimaryMatchFormationRow(undefined)).toBeNull();
  });
});
