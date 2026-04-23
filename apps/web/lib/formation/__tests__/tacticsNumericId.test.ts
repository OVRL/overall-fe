import { parseTacticsNumericId } from "../tacticsNumericId";

describe("parseTacticsNumericId", () => {
  it("정수 숫자는 그대로", () => {
    expect(parseTacticsNumericId(9)).toBe(9);
  });
  it("숫자 전용 문자열", () => {
    expect(parseTacticsNumericId("26")).toBe(26);
  });
  it("TypeName:id 형태", () => {
    expect(parseTacticsNumericId("MatchMercenaryModel:9")).toBe(9);
  });
  it("파싱 불가면 null", () => {
    expect(parseTacticsNumericId("abc")).toBeNull();
    expect(parseTacticsNumericId(null)).toBeNull();
    expect(parseTacticsNumericId(3.14)).toBeNull();
  });
});
