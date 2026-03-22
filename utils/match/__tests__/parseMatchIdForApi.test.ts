import { parseMatchIdForApi } from "../parseMatchIdForApi";

describe("parseMatchIdForApi", () => {
  describe("정수로 변환되는 경우", () => {
    it.each([
      { name: "양의 정수 number", input: 42 as const, want: 42 },
      { name: "0", input: 0 as const, want: 0 },
      { name: "숫자만 있는 문자열", input: "99", want: 99 },
      { name: "앞뒤 공백 제거 후 숫자", input: "  7  ", want: 7 },
      {
        name: "콜론 뒤 숫자 (평문)",
        input: "MatchModel:123",
        want: 123,
      },
    ] as const)("$name → $want", ({ input, want }) => {
      expect(parseMatchIdForApi(input)).toBe(want);
    });

    it("base64 디코드 후 콜론 뒤 숫자를 반환한다", () => {
      const encoded = Buffer.from("MatchModel:42", "utf8").toString("base64");
      expect(parseMatchIdForApi(encoded)).toBe(42);
    });
  });

  describe("null을 반환하는 경우", () => {
    it.each([
      { name: "null", input: null as null },
      { name: "undefined", input: undefined as undefined },
      { name: "빈 문자열", input: "" },
      { name: "공백만", input: "   " },
      { name: "소수 number", input: 3.14 as const },
      { name: "음수 number", input: -1 as const },
      { name: "숫자 없는 문자열", input: "not-a-number" },
      { name: "콜론 뒤가 숫자가 아님", input: "Foo:bar" },
    ] as const)("$name", ({ input }) => {
      expect(parseMatchIdForApi(input)).toBeNull();
    });

    it("안전한 정수 범위를 넘는 숫자 문자열이면 null이다", () => {
      expect(parseMatchIdForApi("9007199254740992")).toBeNull();
    });
  });
});
