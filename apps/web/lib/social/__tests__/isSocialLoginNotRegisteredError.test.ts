import { isSocialLoginNotRegisteredError } from "@/lib/social/isSocialLoginNotRegisteredError";

describe("isSocialLoginNotRegisteredError", () => {
  it("미가입 관련 문구가 포함되면 true", () => {
    expect(isSocialLoginNotRegisteredError("가입되지 않은 사용자입니다.")).toBe(
      true,
    );
    expect(isSocialLoginNotRegisteredError("회원가입을 진행해 주세요.")).toBe(
      true,
    );
    expect(isSocialLoginNotRegisteredError("Not Found")).toBe(true);
    expect(isSocialLoginNotRegisteredError("status 404")).toBe(true);
  });

  it("그 외 메시지는 false", () => {
    expect(isSocialLoginNotRegisteredError("invalid password")).toBe(false);
    expect(isSocialLoginNotRegisteredError("")).toBe(false);
  });
});
