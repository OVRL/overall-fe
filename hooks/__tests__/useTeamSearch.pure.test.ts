import {
  isExternalTeam,
  type TeamSearchResult,
} from "../useTeamSearch";

describe("isExternalTeam", () => {
  it("id가 null이면 외부팀이다", () => {
    const item: TeamSearchResult = {
      id: null,
      name: "자체 리그",
      emblem: null,
    };
    expect(isExternalTeam(item)).toBe(true);
  });

  it("id가 숫자면 등록 팀이다", () => {
    const item: TeamSearchResult = {
      id: 1,
      name: "등록팀",
      emblem: null,
    };
    expect(isExternalTeam(item)).toBe(false);
  });
});
