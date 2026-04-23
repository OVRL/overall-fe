/** 경기(findMatch) 기준 쿼터 수·시간 — 전달 시 탭·보드가 API와 동기화됩니다. */
export type MatchQuarterSpec = {
  quarterCount: number;
  quarterDurationMinutes: number;
  matchType: "MATCH" | "INTERNAL";
};
