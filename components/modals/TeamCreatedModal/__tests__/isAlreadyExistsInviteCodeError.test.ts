import { isAlreadyExistsInviteCodeError } from "../isAlreadyExistsInviteCodeError";
import { INVITE_CODE_ALREADY_EXISTS_MESSAGE } from "../constants";

jest.mock("@/lib/relay/getGraphQLErrorMessage", () => ({
  getGraphQLErrorMessage: jest.fn((_error: unknown, fallback?: string) =>
    fallback ?? "요청 처리 중 오류가 발생했습니다.",
  ),
}));

const getGraphQLErrorMessage =
  jest.requireMock<typeof import("@/lib/relay/getGraphQLErrorMessage")>(
    "@/lib/relay/getGraphQLErrorMessage",
  ).getGraphQLErrorMessage;

describe("isAlreadyExistsInviteCodeError", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("이미 팀 초대 코드가 존재하는 에러인 경우", () => {
    it("getGraphQLErrorMessage가 해당 메시지를 반환하면 true를 반환한다", () => {
      (
        getGraphQLErrorMessage as jest.Mock
      ).mockReturnValue(INVITE_CODE_ALREADY_EXISTS_MESSAGE);

      expect(isAlreadyExistsInviteCodeError(new Error("any"))).toBe(true);
      expect(getGraphQLErrorMessage).toHaveBeenCalledWith(
        expect.any(Error),
        "",
      );
    });

    it("메시지 앞뒤에 공백이 있어도 포함 여부로 true를 반환한다", () => {
      (
        getGraphQLErrorMessage as jest.Mock
      ).mockReturnValue(`  ${INVITE_CODE_ALREADY_EXISTS_MESSAGE}  `);

      expect(isAlreadyExistsInviteCodeError(new Error())).toBe(true);
    });
  });

  describe("그 외 에러인 경우", () => {
    it("getGraphQLErrorMessage가 다른 메시지를 반환하면 false를 반환한다", () => {
      (getGraphQLErrorMessage as jest.Mock).mockReturnValue(
        "다른 오류 메시지",
      );

      expect(isAlreadyExistsInviteCodeError(new Error())).toBe(false);
    });

    it("getGraphQLErrorMessage가 빈 문자열을 반환하면 false를 반환한다", () => {
      (getGraphQLErrorMessage as jest.Mock).mockReturnValue("");

      expect(isAlreadyExistsInviteCodeError(new Error())).toBe(false);
    });
  });
});
