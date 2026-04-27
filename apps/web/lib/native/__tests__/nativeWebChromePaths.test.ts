import {
  isMainAppShellPath,
  isSharedHeaderTopbarPath,
} from "../nativeWebChromePaths";

describe("nativeWebChromePaths", () => {
  describe("isMainAppShellPath", () => {
    it("루트 / 는 메인 셸", () => {
      expect(isMainAppShellPath("/")).toBe(true);
    });

    it("(main) 하위 경로는 true", () => {
      expect(isMainAppShellPath("/team-data")).toBe(true);
      expect(isMainAppShellPath("/team-data/season")).toBe(true);
      expect(isMainAppShellPath("/profile")).toBe(true);
      expect(isMainAppShellPath("/profile/edit")).toBe(true);
      expect(isMainAppShellPath("/team-management")).toBe(true);
      expect(isMainAppShellPath("/team-management/settings")).toBe(true);
      expect(isMainAppShellPath("/match-record")).toBe(true);
      expect(isMainAppShellPath("/mom")).toBe(true);
      expect(isMainAppShellPath("/mom/vote")).toBe(true);
      expect(isMainAppShellPath("/player/foo")).toBe(true);
    });

    it("로그인·온보딩 등은 false", () => {
      expect(isMainAppShellPath("/login")).toBe(false);
      expect(isMainAppShellPath("/login/social")).toBe(false);
      expect(isMainAppShellPath("/onboarding")).toBe(false);
      expect(isMainAppShellPath("/create-team")).toBe(false);
    });

    it("null·빈 문자열은 false", () => {
      expect(isMainAppShellPath(null)).toBe(false);
      expect(isMainAppShellPath("")).toBe(false);
    });
  });

  describe("isSharedHeaderTopbarPath", () => {
    it("온보딩·팀 생성은 true", () => {
      expect(isSharedHeaderTopbarPath("/onboarding")).toBe(true);
      expect(isSharedHeaderTopbarPath("/onboarding/step")).toBe(true);
      expect(isSharedHeaderTopbarPath("/create-team")).toBe(true);
      expect(isSharedHeaderTopbarPath("/create-team/extra")).toBe(true);
    });

    it("(main) 과 로그인은 false", () => {
      expect(isSharedHeaderTopbarPath("/")).toBe(false);
      expect(isSharedHeaderTopbarPath("/profile")).toBe(false);
      expect(isSharedHeaderTopbarPath("/login/social")).toBe(false);
    });

    it("null·빈 문자열은 false", () => {
      expect(isSharedHeaderTopbarPath(null)).toBe(false);
      expect(isSharedHeaderTopbarPath("")).toBe(false);
    });
  });
});
