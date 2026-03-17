import { addDays, format, parseISO } from "date-fns";

/** 폼에서 사용하는 투표 마감 상대 옵션 */
export type VoteDeadlineOption =
  | "SAME_DAY"
  | "1_DAY_BEFORE"
  | "2_DAYS_BEFORE"
  | "3_DAYS_BEFORE"
  | "1_WEEK_BEFORE";

/**
 * 경기 시작일(matchDate) 기준으로 투표 마감일시를 계산합니다.
 * 백엔드 협의: 경기 시작일 기준으로 처리 (예: 3월 20일 경기 + 3일 전 → 3월 17일)
 * @param matchDate yyyy-MM-dd 형식의 경기 시작일
 * @param option 상대 옵션 (당일, 1일 전, ...)
 * @returns GraphQLDateTime 형식 (Y-m-d H:i:s)
 */
export function computeVoteDeadlineDateTime(
  matchDate: string,
  option: VoteDeadlineOption,
): string {
  const base = parseISO(matchDate);
  const daysToSubtract =
    option === "SAME_DAY"
      ? 0
      : option === "1_DAY_BEFORE"
        ? 1
        : option === "2_DAYS_BEFORE"
          ? 2
          : option === "3_DAYS_BEFORE"
            ? 3
            : option === "1_WEEK_BEFORE"
              ? 7
              : 0;
  const deadlineDate = addDays(base, -daysToSubtract);
  return format(deadlineDate, "yyyy-MM-dd HH:mm:ss");
}
