import { getVenueErrorMessage } from "../../lib/getVenueErrorMessage";

describe("getVenueErrorMessage", () => {
  it("error가 undefined이면 undefined를 반환한다", () => {
    expect(getVenueErrorMessage(undefined)).toBeUndefined();
  });

  it("address.message가 있으면 해당 문자열을 반환한다", () => {
    const error = { address: { message: "경기 장소를 입력해주세요." } };
    expect(getVenueErrorMessage(error as never)).toBe(
      "경기 장소를 입력해주세요.",
    );
  });

  it("message만 있으면 해당 문자열을 반환한다", () => {
    const error = { message: "주소 형식이 올바르지 않습니다." };
    expect(getVenueErrorMessage(error as never)).toBe(
      "주소 형식이 올바르지 않습니다.",
    );
  });

  it("address.message가 우선한다", () => {
    const error = {
      address: { message: "주소 에러" },
      message: "일반 에러",
    };
    expect(getVenueErrorMessage(error as never)).toBe("주소 에러");
  });
});
