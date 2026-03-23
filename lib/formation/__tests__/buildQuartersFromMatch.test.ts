import { buildQuartersFromMatch } from "../buildQuartersFromMatch";

describe("buildQuartersFromMatch", () => {
  it("quarterCount만큼 id 1..N 쿼터를 만든다", () => {
    const list = buildQuartersFromMatch(4, "MATCH");
    expect(list).toHaveLength(4);
    expect(list.map((q) => q.id)).toEqual([1, 2, 3, 4]);
    expect(list.every((q) => q.type === "MATCHING")).toBe(true);
  });

  it("INTERNAL이면 IN_HOUSE 타입이다", () => {
    const list = buildQuartersFromMatch(2, "INTERNAL");
    expect(list.every((q) => q.type === "IN_HOUSE")).toBe(true);
  });

  it("범위는 1~10으로 제한한다", () => {
    expect(buildQuartersFromMatch(0, "MATCH")).toHaveLength(1);
    expect(buildQuartersFromMatch(99, "MATCH")).toHaveLength(10);
  });
});
