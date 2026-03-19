import type { MatchForUpcomingDisplay } from "@/components/home/UpcomingMatch/upcomingMatchDisplay";
import { pickSoonestMatch } from "../pickSoonestMatch";

/** 테스트용 경기 객체 생성 (matchDate, startTime만 시각 비교에 사용됨, id는 어설션용) */
function 경기(
  matchDate: string,
  startTime: string,
  id?: string,
): MatchForUpcomingDisplay {
  return {
    id,
    matchDate,
    startTime,
    matchType: "MATCH",
    createdTeam: null,
    opponentTeam: null,
  };
}

describe("pickSoonestMatch", () => {
  describe("빈 배열 / 단일 경기", () => {
    it("경기가 없으면 null을 반환한다", () => {
      expect(pickSoonestMatch([])).toBeNull();
    });

    it("경기가 하나면 그 경기를 그대로 반환한다", () => {
      const 단일 = [경기("2025-03-20", "15:00:00")];
      expect(pickSoonestMatch(단일)).toBe(단일[0]);
    });
  });

  describe("가장 가까운 시각의 경기 선택", () => {
    it("여러 경기 중 시각이 가장 빠른 경기 하나를 반환한다", () => {
      const 목록 = [
        경기("2025-03-25", "18:00:00", "나중"),
        경기("2025-03-20", "15:00:00", "가장빠름"),
        경기("2025-03-22", "10:00:00", "중간"),
      ];
      const 결과 = pickSoonestMatch(목록);
      expect(결과?.id).toBe("가장빠름");
      expect(결과?.matchDate).toBe("2025-03-20");
      expect(결과?.startTime).toBe("15:00:00");
    });

    it("같은 날이면 startTime이 더 빠른 경기를 반환한다", () => {
      const 목록 = [
        경기("2025-03-20", "20:00:00", "저녁"),
        경기("2025-03-20", "10:00:00", "오전"),
        경기("2025-03-20", "15:00:00", "오후"),
      ];
      const 결과 = pickSoonestMatch(목록);
      expect(결과?.id).toBe("오전");
      expect(결과?.startTime).toBe("10:00:00");
    });

    it("날짜가 다르면 matchDate가 더 이른 경기를 반환한다", () => {
      const 목록 = [
        경기("2025-04-01", "09:00:00", "4월"),
        경기("2025-03-01", "18:00:00", "3월"),
        경기("2025-05-01", "09:00:00", "5월"),
      ];
      const 결과 = pickSoonestMatch(목록);
      expect(결과?.id).toBe("3월");
      expect(결과?.matchDate).toBe("2025-03-01");
    });
  });

  describe("과거 경기 포함 시 동작", () => {
    it("과거 경기만 있어도 시각이 가장 빠른(가장 과거) 경기를 반환한다", () => {
      const 목록 = [
        경기("2024-01-15", "14:00:00", "가장과거"),
        경기("2024-06-01", "10:00:00", "중간"),
        경기("2024-12-31", "20:00:00", "덜과거"),
      ];
      const 결과 = pickSoonestMatch(목록);
      expect(결과?.id).toBe("가장과거");
      expect(결과?.matchDate).toBe("2024-01-15");
    });
  });

  describe("동일 시각 엣지 케이스", () => {
    it("가장 빠른 시각이 여러 개면 배열에서 먼저 나온 경기를 반환한다", () => {
      const 첫번째 = 경기("2025-03-20", "15:00:00", "첫번째");
      const 목록: MatchForUpcomingDisplay[] = [
        첫번째,
        경기("2025-03-25", "18:00:00"),
        경기("2025-03-20", "15:00:00"),
      ];
      const 결과 = pickSoonestMatch(목록);
      expect(결과?.id).toBe("첫번째");
      expect(결과).toBe(첫번째);
    });

    it("모든 경기가 같은 날 같은 시각이면 첫 번째 경기를 반환한다", () => {
      const 목록 = [
        경기("2025-03-20", "15:00:00", "A"),
        경기("2025-03-20", "15:00:00", "B"),
        경기("2025-03-20", "15:00:00", "C"),
      ];
      const 결과 = pickSoonestMatch(목록);
      expect(결과?.id).toBe("A");
    });
  });

  describe("자정·연말 등 시각 경계", () => {
    it("자정(00:00:00) 경기가 있으면 그 경기가 가장 빠른 것으로 선택된다", () => {
      const 목록 = [
        경기("2025-03-20", "15:00:00", "오후"),
        경기("2025-03-20", "00:00:00", "자정"),
        경기("2025-03-20", "23:59:00", "밤"),
      ];
      const 결과 = pickSoonestMatch(목록);
      expect(결과?.id).toBe("자정");
    });

    it("연말(12-31)과 연초(01-01)가 있으면 연초 경기가 선택된다", () => {
      const 목록 = [
        경기("2025-12-31", "23:59:00", "연말"),
        경기("2025-01-01", "00:00:00", "연초"),
      ];
      const 결과 = pickSoonestMatch(목록);
      expect(결과?.id).toBe("연초");
    });
  });
});
