import { buildHomeUpcomingMatchLayoutSnapshot } from "../buildHomeUpcomingMatchLayoutSnapshot";

describe("buildHomeUpcomingMatchLayoutSnapshot", () => {
  it("경기가 없으면 empty 레이아웃을 담는다", () => {
    const r = buildHomeUpcomingMatchLayoutSnapshot(1, [], 0);
    expect(r.createdTeamId).toBe(1);
    expect(r.layout.kind).toBe("empty");
    expect(typeof r.computedAtMs).toBe("number");
  });
});
