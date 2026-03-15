import type { MatchForUpcoming } from "@/utils/fetchFindMatchSSR";

/**
 * matchDate (YYYY-MM-DD) + startTime (HH:mm:ss)를 합쳐
 * 타임스탬프(ms)로 변환합니다.
 */
function toTimestamp(matchDate: string, startTime: string): number {
  const [year, month, day] = matchDate.split("-").map(Number);
  const [hours, minutes] = startTime.split(":").map(Number);
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return date.getTime();
}

/**
 * findMatch 배열에서 경기 시작 시각이 가장 가까운 경기 하나를 반환합니다.
 * 과거 경기도 포함해 "가장 빠른" 경기를 반환합니다.
 * (다가오는 경기만 쓰려면 호출 측에서 now 이전 필터링 후 사용 가능)
 */
export function pickSoonestMatch(matches: MatchForUpcoming[]): MatchForUpcoming | null {
  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0]!;

  let soonest = matches[0]!;
  let soonestTs = toTimestamp(soonest.matchDate, soonest.startTime);

  for (let i = 1; i < matches.length; i++) {
    const m = matches[i]!;
    const ts = toTimestamp(m.matchDate, m.startTime);
    if (ts < soonestTs) {
      soonest = m;
      soonestTs = ts;
    }
  }
  return soonest;
}
