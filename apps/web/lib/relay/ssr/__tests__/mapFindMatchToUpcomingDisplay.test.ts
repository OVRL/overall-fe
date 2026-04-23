import { mapFindMatchNodesToMatchForUpcomingDisplay } from "../mapFindMatchToUpcomingDisplay";

describe("mapFindMatchNodesToMatchForUpcomingDisplay", () => {
  it("빈 배열이면 빈 배열을 반환한다", () => {
    expect(mapFindMatchNodesToMatchForUpcomingDisplay([])).toEqual([]);
    expect(mapFindMatchNodesToMatchForUpcomingDisplay(null)).toEqual([]);
  });
});
