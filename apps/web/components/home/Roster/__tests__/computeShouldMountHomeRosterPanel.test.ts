import { computeShouldMountHomeRosterPanel } from "../computeShouldMountHomeRosterPanel";

describe("computeShouldMountHomeRosterPanel", () => {
  it("팀 미선택이면 모바일·뷰포트와 관계없이 마운트", () => {
    expect(
      computeShouldMountHomeRosterPanel({
        hasSelectedTeam: false,
        isLayoutMobile: true,
        isInView: false,
        unblockAfterTeamSwitch: false,
      }),
    ).toBe(true);
  });

  it("데스크톱 레이아웃이면 팀이 있어도 즉시 마운트", () => {
    expect(
      computeShouldMountHomeRosterPanel({
        hasSelectedTeam: true,
        isLayoutMobile: false,
        isInView: false,
        unblockAfterTeamSwitch: false,
      }),
    ).toBe(true);
  });

  it("모바일·팀 선택 시 뷰포트 진입 전에는 마운트하지 않음", () => {
    expect(
      computeShouldMountHomeRosterPanel({
        hasSelectedTeam: true,
        isLayoutMobile: true,
        isInView: false,
        unblockAfterTeamSwitch: false,
      }),
    ).toBe(false);
  });

  it("모바일·팀 선택 시 뷰포트 진입 후 마운트", () => {
    expect(
      computeShouldMountHomeRosterPanel({
        hasSelectedTeam: true,
        isLayoutMobile: true,
        isInView: true,
        unblockAfterTeamSwitch: false,
      }),
    ).toBe(true);
  });

  it("모바일에서 팀 전환 우회가 있으면 뷰포트 밖에서도 마운트", () => {
    expect(
      computeShouldMountHomeRosterPanel({
        hasSelectedTeam: true,
        isLayoutMobile: true,
        isInView: false,
        unblockAfterTeamSwitch: true,
      }),
    ).toBe(true);
  });
});
