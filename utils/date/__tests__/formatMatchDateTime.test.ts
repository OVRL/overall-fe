import { formatMatchDateTime } from "../formatMatchDateTime";

describe("formatMatchDateTime", () => {
  describe("기본 포맷 (MM.DD (요일) HH:mm)", () => {
    it("matchDate(YYYY-MM-DD)와 startTime(HH:mm:ss)을 '01.25 (토) 15:00' 형태로 포맷한다", () => {
      expect(formatMatchDateTime("2025-01-25", "15:00:00")).toBe("01.25 (토) 15:00");
    });

    it("한 자리 월·일은 앞에 0을 채워 두 자리로 표시한다", () => {
      expect(formatMatchDateTime("2025-01-05", "09:00:00")).toBe("01.05 (일) 09:00");
      expect(formatMatchDateTime("2025-12-01", "18:30:00")).toBe("12.01 (월) 18:30");
    });

    it("자정(00:00:00)을 올바르게 포맷한다", () => {
      expect(formatMatchDateTime("2025-06-15", "00:00:00")).toBe("06.15 (일) 00:00");
    });

    it("23시 59분을 올바르게 포맷한다", () => {
      expect(formatMatchDateTime("2025-12-31", "23:59:00")).toBe("12.31 (수) 23:59");
    });
  });

  describe("요일 표시", () => {
    it("일요일을 (일)로 표시한다", () => {
      expect(formatMatchDateTime("2025-01-05", "10:00:00")).toBe("01.05 (일) 10:00");
    });

    it("월요일을 (월)로 표시한다", () => {
      expect(formatMatchDateTime("2025-01-06", "10:00:00")).toBe("01.06 (월) 10:00");
    });

    it("토요일을 (토)로 표시한다", () => {
      expect(formatMatchDateTime("2025-01-04", "10:00:00")).toBe("01.04 (토) 10:00");
    });

    it("수요일을 (수)로 표시한다", () => {
      expect(formatMatchDateTime("2025-01-01", "12:00:00")).toBe("01.01 (수) 12:00");
    });
  });

  describe("시간 포맷", () => {
    it("시·분만 사용하고 초는 버린다 (HH:mm:ss → HH:mm)", () => {
      expect(formatMatchDateTime("2025-01-25", "15:30:45")).toBe("01.25 (토) 15:30");
    });

    it("한 자리 시·분은 0을 채워 두 자리로 표시한다", () => {
      expect(formatMatchDateTime("2025-01-25", "09:05:00")).toBe("01.25 (토) 09:05");
    });
  });

  describe("엣지 케이스", () => {
    it("연말(12월 31일)을 올바르게 포맷한다", () => {
      expect(formatMatchDateTime("2025-12-31", "20:00:00")).toBe("12.31 (수) 20:00");
    });

    it("연초(1월 1일)를 올바르게 포맷한다", () => {
      expect(formatMatchDateTime("2025-01-01", "00:00:00")).toBe("01.01 (수) 00:00");
    });

    it("2월(윤년 아님) 28일을 올바르게 포맷한다", () => {
      expect(formatMatchDateTime("2025-02-28", "14:00:00")).toBe("02.28 (금) 14:00");
    });

    it("윤년 2월 29일을 올바르게 포맷한다", () => {
      expect(formatMatchDateTime("2024-02-29", "14:00:00")).toBe("02.29 (목) 14:00");
    });
  });
});
