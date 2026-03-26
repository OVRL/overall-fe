/** 경기 승패 (요약 배지용) */
export type MatchResult = "win" | "draw" | "loss";

/** 쿼터별 스코어 */
export type QuarterScore = {
  home: number;
  away: number;
};

/** 타임라인 이벤트 종류 */
export type TimelineEventKind = "goal" | "conceded";

/** 경기 타임라인 한 줄 */
export type MatchTimelineEvent = {
  id: string;
  kind: TimelineEventKind;
  /** 1~4쿼터 (타임라인 구간 표시) */
  quarter: 1 | 2 | 3 | 4;
  /** 득점 선수명 */
  scorerName?: string;
  /** 도움 선수명 */
  assistName?: string;
  /** 기점(빌드업) 선수명 */
  buildUpName?: string;
  /** 실점 시 상대 정보 */
  opponentLabel?: string;
};

/** 경기 기록 한 건 (목업·추후 Relay 연동 시 동일 도메인 모델로 확장) */
export type MatchRecord = {
  id: string;
  /** 화면 표시용 날짜 문자열 */
  dateLabel: string;
  opponentName: string;
  ourScore: number;
  theirScore: number;
  result: MatchResult;
  quarters: [QuarterScore, QuarterScore, QuarterScore, QuarterScore];
  timeline: MatchTimelineEvent[];
};
