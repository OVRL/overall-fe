import type { MatchForUpcomingDisplay } from "@/components/home/UpcomingMatch/upcomingMatchDisplay";
import {
  pickMostRecentlyEndedMatch,
  pickSoonestAmongNotEndedMatch,
  pickSoonestMatch,
  pickSoonestUpcomingMatch,
} from "../pickSoonestMatch";

/** 테스트용 경기 객체 생성 (matchDate, startTime만 시각 비교에 사용됨, id는 어설션용) */
function 경기(
  matchDate: string,
  startTime: string,
  id?: string,
  /** 생략 시 기본 `"23:59:00"`. `null`이면 API처럼 종료 시각 없음(기본값으로 대체되지 않음) */
  endTime?: string | null,
  quarterDuration = 15,
): MatchForUpcomingDisplay {
  return {
    id,
    matchDate,
    startTime,
    endTime: endTime === undefined ? "23:59:00" : endTime,
    quarterCount: 4,
    quarterDuration,
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

describe("pickSoonestUpcomingMatch", () => {
  /** 고정 기준 시각: 2025-03-20 12:00:00 (로컬) */
  const 기준시각 = new Date(2025, 2, 20, 12, 0, 0, 0).getTime();

  it("과거·미래가 섞이면 가장 가까운 미래 경기만 반환한다", () => {
    const 목록 = [
      경기("2025-03-19", "10:00:00", "어제"),
      경기("2025-03-25", "18:00:00", "일주일뒤"),
      경기("2025-03-21", "09:00:00", "내일아침"),
    ];
    const 결과 = pickSoonestUpcomingMatch(목록, 기준시각);
    expect(결과?.id).toBe("내일아침");
  });

  it("모두 과거면 null을 반환한다", () => {
    const 목록 = [
      경기("2025-03-18", "10:00:00"),
      경기("2025-03-19", "23:59:00"),
    ];
    expect(pickSoonestUpcomingMatch(목록, 기준시각)).toBeNull();
  });

  it("기준 시각과 동일한 시작 시각이면 포함한다 (>=)", () => {
    const 목록 = [
      경기("2025-03-20", "11:59:00", "직전"),
      경기("2025-03-20", "12:00:00", "정오"),
    ];
    const 결과 = pickSoonestUpcomingMatch(목록, 기준시각);
    expect(결과?.id).toBe("정오");
  });

  it("빈 배열이면 null을 반환한다", () => {
    expect(pickSoonestUpcomingMatch([], 기준시각)).toBeNull();
  });
});

describe("pickSoonestAmongNotEndedMatch", () => {
  const 기준 = new Date(2025, 2, 20, 11, 0, 0, 0).getTime();

  it("진행 중(end > now)인 경기가 있으면 시작이 가장 이른 걸 고른다", () => {
    const 목록 = [
      경기("2025-03-20", "10:00:00", "진행중", "12:00:00"),
      경기("2025-03-21", "09:00:00", "내일"),
    ];
    const 결과 = pickSoonestAmongNotEndedMatch(목록, 기준);
    expect(결과?.id).toBe("진행중");
  });

  it("모두 종료(end <= now)면 null", () => {
    const 목록 = [경기("2025-03-19", "10:00:00", "어제", "12:00:00")];
    expect(pickSoonestAmongNotEndedMatch(목록, 기준)).toBeNull();
  });
});

describe("pickMostRecentlyEndedMatch", () => {
  const 기준 = new Date(2025, 2, 20, 11, 0, 0, 0).getTime();

  it("종료된 경기 중 종료가 가장 늦은 1건", () => {
    const 목록 = [
      경기("2025-03-18", "10:00:00", "더과거", "12:00:00"),
      경기("2025-03-19", "10:00:00", "최근", "14:00:00"),
    ];
    const 결과 = pickMostRecentlyEndedMatch(목록, 기준);
    expect(결과?.id).toBe("최근");
  });

  it("endTime이 비어 있어도 쿼터 길이로 종료 시각을 추정해 크래시하지 않는다", () => {
    /** 2025-03-20 10:00 시작, 4쿼터×15분 → 11:00 종료. 기준 11:30이면 종료됨 */
    const 목록 = [
      경기("2025-03-20", "10:00:00", "무종료시각", null, 15),
    ];
    const 기준1130 = new Date(2025, 2, 20, 11, 30, 0, 0).getTime();
    expect(pickMostRecentlyEndedMatch(목록, 기준1130)?.id).toBe("무종료시각");
  });
});

describe("endTime 누락 시 pickSoonestAmongNotEndedMatch", () => {
  it("쿼터 기준으로 아직 종료 전이면 not-ended로 남긴다", () => {
    /** 종료 추정 11:00, 기준 10:30이면 아직 not-ended */
    const 기준1030 = new Date(2025, 2, 20, 10, 30, 0, 0).getTime();
    const 목록 = [경기("2025-03-20", "10:00:00", "진행추정", null, 15)];
    expect(pickSoonestAmongNotEndedMatch(목록, 기준1030)?.id).toBe("진행추정");
  });

  it("endTime이 시작과 같으면 무시하고 쿼터·추정 길이로 종료를 잡는다", () => {
    /** 시작=종료 20:00(잘못된 데이터), 쿼터 60분 → 21:00 종료. 20:39엔 아직 진행 */
    const 기준2039 = new Date(2025, 2, 20, 20, 39, 0, 0).getTime();
    const 목록 = [경기("2025-03-20", "20:00:00", "시작동일종료", "20:00:00", 15)];
    expect(pickSoonestAmongNotEndedMatch(목록, 기준2039)?.id).toBe(
      "시작동일종료",
    );
  });

  it("쿼터 정보가 없으면 기본 2시간 동안은 종료로 보지 않는다", () => {
    const 기준2039 = new Date(2025, 2, 20, 20, 39, 0, 0).getTime();
    const 목록: MatchForUpcomingDisplay[] = [
      {
        id: "무쿼터",
        matchDate: "2025-03-20",
        startTime: "20:00:00",
        endTime: null,
        quarterCount: 0,
        quarterDuration: 0,
        matchType: "MATCH",
        createdTeam: null,
        opponentTeam: null,
      },
    ];
    expect(pickSoonestAmongNotEndedMatch(목록, 기준2039)?.id).toBe("무쿼터");
  });
});

describe("matchDate/startTime 누락", () => {
  it("시작 시각을 만들 수 없으면 pickSoonestMatch·ended/notEnded에서 제외된다", () => {
    const bad: MatchForUpcomingDisplay = {
      id: "bad",
      matchDate: undefined,
      startTime: undefined,
      endTime: "12:00:00",
      quarterCount: 4,
      quarterDuration: 15,
      matchType: "MATCH",
      createdTeam: null,
      opponentTeam: null,
    };
    const good = 경기("2025-03-20", "10:00:00", "ok", null, 15);
    expect(pickSoonestMatch([bad, good])).toBe(good);
    const 기준 = new Date(2025, 2, 20, 12, 0, 0, 0).getTime();
    expect(pickMostRecentlyEndedMatch([bad, good], 기준)?.id).toBe("ok");
    expect(() =>
      pickSoonestAmongNotEndedMatch([bad], 기준),
    ).not.toThrow();
  });
});
