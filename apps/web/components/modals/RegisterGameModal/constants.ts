export const MATCH_TYPE = {
  MATCH: "매칭",
  INTERNAL: "내전",
} as const;

export const MATCH_TYPE_OPTIONS = [
  { value: "MATCH" as const, label: MATCH_TYPE.MATCH },
  { value: "INTERNAL" as const, label: MATCH_TYPE.INTERNAL },
];

export const UNIFORM = {
  HOME: "홈",
  AWAY: "어웨이",
} as const;

export const QUARTER_COUNT_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}));

/** 5분 단위, 5분 ~ 55분 */
export const QUARTER_DURATION_OPTIONS = Array.from({ length: 11 }, (_, i) => {
  const minutes = (i + 1) * 5;
  return { label: `${minutes}분`, value: String(minutes) };
});

export const VOTE_DEADLINE_OPTIONS = [
  { label: "당일", value: "SAME_DAY" },
  { label: "하루 전", value: "1_DAY_BEFORE" },
  { label: "이틀 전", value: "2_DAYS_BEFORE" },
  { label: "3일 전", value: "3_DAYS_BEFORE" },
  { label: "일주일 전", value: "1_WEEK_BEFORE" },
];
