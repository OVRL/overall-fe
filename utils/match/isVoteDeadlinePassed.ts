/**
 * 경기 투표 마감 시각(GraphQLDateTime 문자열)이 기준 시각보다 이전이면 true.
 * 파싱 불가·누락이면 false (클라이언트에서 막지 않고 API에 맡김).
 */
export function isVoteDeadlinePassedAt(
  voteDeadline: string | null | undefined,
  nowMs: number,
): boolean {
  if (voteDeadline == null || voteDeadline === "") return false;
  const ms = Date.parse(voteDeadline);
  if (Number.isNaN(ms)) return false;
  return nowMs > ms;
}

/**
 * 경기 투표 마감 시각(GraphQLDateTime 문자열)이 현재 시각보다 이전이면 true.
 * 파싱 불가·누락이면 false (클라이언트에서 막지 않고 API에 맡김).
 */
export function isVoteDeadlinePassed(
  voteDeadline: string | null | undefined,
): boolean {
  return isVoteDeadlinePassedAt(voteDeadline, Date.now());
}
