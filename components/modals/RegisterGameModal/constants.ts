export const GAME_TYPE = {
  MATCH: "매칭",
  INTERNAL: "내전",
} as const;

export const UNIFORM = {
  HOME: "홈",
  AWAY: "어웨이",
} as const;

export const QUARTER_COUNT_OPTIONS = [
  { label: "4", value: "4" },
  { label: "6", value: "6" },
  { label: "8", value: "8" },
];

export const QUARTER_DURATION_OPTIONS = [
  { label: "10분", value: "10" },
  { label: "15분", value: "15" },
  { label: "25분", value: "25" },
];

export const VOTE_DEADLINE_OPTIONS = [
  { label: "당일", value: "SAME_DAY" },
  { label: "하루 전", value: "1_DAY_BEFORE" },
  { label: "이틀 전", value: "2_DAYS_BEFORE" },
];
