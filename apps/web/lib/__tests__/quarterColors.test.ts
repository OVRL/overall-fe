import {
  QUARTER_COLORS,
  getQuarterColor,
  getQuarterChipStyle,
} from "../quarterColors";

describe("quarterColors 유틸", () => {
  describe("QUARTER_COLORS", () => {
    it("1~10번 쿼터에 대한 border, bg, text 키를 가진다", () => {
      for (let q = 1; q <= 10; q++) {
        expect(QUARTER_COLORS[q]).toBeDefined();
        expect(QUARTER_COLORS[q]).toHaveProperty("border");
        expect(QUARTER_COLORS[q]).toHaveProperty("bg");
      }
    });

    it("1번 쿼터는 DF-Blue 색상을 사용한다", () => {
      expect(QUARTER_COLORS[1].bg).toBe("bg-Position-DF-Blue");
      expect(QUARTER_COLORS[1].border).toBe("border-Position-DF-Blue");
    });

    it("4번 쿼터는 FW-Red 색상을 사용한다", () => {
      expect(QUARTER_COLORS[4].bg).toBe("bg-Position-FW-Red");
    });
  });

  describe("getQuarterColor", () => {
    it("1~10 쿼터에 대해 해당 bg 클래스를 반환한다", () => {
      expect(getQuarterColor(1)).toBe("bg-Position-DF-Blue");
      expect(getQuarterColor(2)).toBe("bg-Position-MF-Green");
      expect(getQuarterColor(3)).toBe("bg-Position-GK-Yellow");
      expect(getQuarterColor(4)).toBe("bg-Position-FW-Red");
      expect(getQuarterColor(5)).toBe("bg-purple-500");
      expect(getQuarterColor(10)).toBe("bg-indigo-500");
    });

    it("정의되지 않은 쿼터 번호는 fallback bg-gray-600을 반환한다", () => {
      expect(getQuarterColor(0)).toBe("bg-gray-600");
      expect(getQuarterColor(11)).toBe("bg-gray-600");
      expect(getQuarterColor(99)).toBe("bg-gray-600");
    });
  });

  describe("getQuarterChipStyle", () => {
    it("1~10 쿼터에 대해 'border' + 해당 border + bg 클래스 문자열을 반환한다", () => {
      expect(getQuarterChipStyle(1)).toContain("border");
      expect(getQuarterChipStyle(1)).toContain("border-Position-DF-Blue");
      expect(getQuarterChipStyle(1)).toContain("bg-Position-DF-Blue");

      expect(getQuarterChipStyle(4)).toContain("border-Position-FW-Red");
      expect(getQuarterChipStyle(4)).toContain("bg-Position-FW-Red");
    });

    it("정의되지 않은 쿼터 번호는 fallback border-gray-600, bg-gray-600을 반환한다", () => {
      const style = getQuarterChipStyle(0);
      expect(style).toContain("border");
      expect(style).toContain("border-gray-600");
      expect(style).toContain("bg-gray-600");
    });
  });
});
