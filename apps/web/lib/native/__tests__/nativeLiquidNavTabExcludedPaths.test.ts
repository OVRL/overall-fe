import { isNativeLiquidNavTabExcludedPath } from "../nativeLiquidNavTabExcludedPaths";

describe("isNativeLiquidNavTabExcludedPath", () => {
  it("/login 및 하위 경로는 제외한다", () => {
    expect(isNativeLiquidNavTabExcludedPath("/login")).toBe(true);
    expect(isNativeLiquidNavTabExcludedPath("/login/social")).toBe(true);
  });

  it("탭 셸 홈(/)은 제외하지 않는다", () => {
    expect(isNativeLiquidNavTabExcludedPath("/")).toBe(false);
  });

  it("/team-data 는 제외하지 않는다", () => {
    expect(isNativeLiquidNavTabExcludedPath("/team-data")).toBe(false);
  });
});
