import { INVITE_CODE_ALREADY_EXISTS_MESSAGE } from "../constants";

describe("TeamCreatedModal constants", () => {
  describe("INVITE_CODE_ALREADY_EXISTS_MESSAGE", () => {
    it("서버 에러 메시지와 동일한 문자열을 내보낸다", () => {
      expect(INVITE_CODE_ALREADY_EXISTS_MESSAGE).toBe(
        "이미 팀 초대 코드가 존재합니다.",
      );
    });

    it("비어 있지 않은 문자열이다", () => {
      expect(INVITE_CODE_ALREADY_EXISTS_MESSAGE.length).toBeGreaterThan(0);
      expect(INVITE_CODE_ALREADY_EXISTS_MESSAGE.trim()).toBe(
        INVITE_CODE_ALREADY_EXISTS_MESSAGE,
      );
    });
  });
});
