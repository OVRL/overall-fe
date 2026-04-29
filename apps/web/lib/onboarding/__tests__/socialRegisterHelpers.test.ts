import {
  buildSocialRegisterInput,
  graphQLProviderFromData,
  pickLatestToken,
} from "@/lib/onboarding/socialRegisterHelpers";

const baseInfo = {
  gender: "M" as const,
  activityArea: "서울",
  activityAreaCode: "11",
  foot: "R" as const,
  preferredNumber: "10",
  favoritePlayer: "Son",
};

describe("socialRegisterHelpers", () => {
  describe("graphQLProviderFromData", () => {
    it("kakao·naver·google 매핑", () => {
      expect(graphQLProviderFromData("kakao")).toBe("KAKAO");
      expect(graphQLProviderFromData("naver")).toBe("NAVER");
      expect(graphQLProviderFromData("google")).toBe("GOOGLE");
      expect(graphQLProviderFromData("other")).toBeUndefined();
    });
  });

  describe("buildSocialRegisterInput", () => {
    const validData = {
      email: "a@b.com",
      provider: "kakao",
      phone: "01012345678",
      name: "홍길동",
      birthDate: "1990-01-01",
      mainPosition: "FW",
      subPositions: ["GK", "CB"],
    };

    it("필수값 부족 시 null", () => {
      expect(
        buildSocialRegisterInput(
          { ...validData, email: undefined },
          baseInfo,
          true,
        ),
      ).toBeNull();
    });

    it("includeAdditional true 일 때 활동지역·선호번호 등 반영", () => {
      const input = buildSocialRegisterInput(validData, baseInfo, true);
      expect(input).not.toBeNull();
      if (!input) return;
      expect(input.activityArea).toBe("11");
      expect(input.preferredNumber).toBe(10);
      expect(input.favoritePlayer).toBe("Son");
    });

    it("includeAdditional false 일 때 추가 필드 null", () => {
      const input = buildSocialRegisterInput(validData, baseInfo, false);
      expect(input).not.toBeNull();
      if (!input) return;
      expect(input.activityArea).toBeNull();
      expect(input.preferredNumber).toBeNull();
      expect(input.favoritePlayer).toBeNull();
    });
  });

  describe("pickLatestToken", () => {
    it("accessToken 없는 항목 제외 후 id 최대", () => {
      const t = pickLatestToken([
        { id: 1, accessToken: "a" },
        { id: 3, accessToken: "c" },
        { id: 2, accessToken: "b" },
      ]);
      expect(t?.id).toBe(3);
      expect(t?.accessToken).toBe("c");
    });

    it("빈 배열이면 null", () => {
      expect(pickLatestToken([])).toBeNull();
    });
  });
});
