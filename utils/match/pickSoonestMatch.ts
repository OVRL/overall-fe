import type { MatchForUpcomingDisplay } from "@/components/home/UpcomingMatch/upcomingMatchDisplay";

/**
 * matchDate (YYYY-MM-DD) + startTime (HH:mm:ss)를 합쳐
 * 타임스탬프(ms)로 변환합니다.
 */
export function matchStartMs(matchDate: string, startTime: string): number {
  const [year, month, day] = matchDate.split("-").map(Number);
  const [hours, minutes] = startTime.split(":").map(Number);
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return date.getTime();
}

/** matchDate + endTime 기준 종료 시각(ms). endTime은 HH:mm(:ss) 형식을 가정합니다. */
export function matchEndMs(matchDate: string, endTime: string): number {
  const [year, month, day] = matchDate.split("-").map(Number);
  const [hours, minutes] = endTime.split(":").map(Number);
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return date.getTime();
}

/**
 * findMatch 배열에서 경기 시작 시각이 가장 가까운 경기 하나를 반환합니다.
 * 과거 경기도 포함해 "가장 빠른" 경기를 반환합니다.
 * (다가오는 경기만 쓰려면 호출 측에서 now 이전 필터링 후 사용 가능)
 */
export function pickSoonestMatch<T extends MatchForUpcomingDisplay>(
  matches: T[],
): T | null {
  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0]!;

  let soonest = matches[0]!;
  let soonestTs = matchStartMs(soonest.matchDate, soonest.startTime);

  for (let i = 1; i < matches.length; i++) {
    const m = matches[i]!;
    const ts = matchStartMs(m.matchDate, m.startTime);
    if (ts < soonestTs) {
      soonest = m;
      soonestTs = ts;
    }
  }
  return soonest;
}

/**
 * 현재 시각(now) 이후에 시작하는 경기만 남기고, 그중 시작 시각이 가장 이른 경기 1건을 반환합니다.
 * (홈 "다가오는 경기"·출석 투표 대상 경기 등에 사용)
 *
 * @param nowMs 기준 시각(ms). 테스트용 주입 가능. 생략 시 `Date.now()`
 */
export function pickSoonestUpcomingMatch<T extends MatchForUpcomingDisplay>(
  matches: T[],
  nowMs: number = Date.now(),
): T | null {
  const upcoming = matches.filter(
    (m) => matchStartMs(m.matchDate, m.startTime) >= nowMs,
  );
  return pickSoonestMatch(upcoming);
}

/**
 * 아직 종료되지 않은 경기(endTime 기준 end > now)만 남기고,
 * 그중 시작 시각이 가장 이른 1건을 반환합니다.
 * (예정 경기 + 진행 중 경기를 "다가오는/현재" 카드에 쓸 때 사용)
 */
export function pickSoonestAmongNotEndedMatch<T extends MatchForUpcomingDisplay>(
  matches: T[],
  nowMs: number = Date.now(),
): T | null {
  const notEnded = matches.filter(
    (m) => matchEndMs(m.matchDate, m.endTime) > nowMs,
  );
  return pickSoonestMatch(notEnded);
}

/**
 * 이미 종료된 경기(end <= now)만 남기고, 종료 시각이 가장 늦은 1건을 반환합니다.
 */
export function pickMostRecentlyEndedMatch<T extends MatchForUpcomingDisplay>(
  matches: T[],
  nowMs: number = Date.now(),
): T | null {
  const ended = matches.filter(
    (m) => matchEndMs(m.matchDate, m.endTime) <= nowMs,
  );
  if (ended.length === 0) return null;
  let best = ended[0]!;
  let bestEnd = matchEndMs(best.matchDate, best.endTime);
  for (let i = 1; i < ended.length; i++) {
    const m = ended[i]!;
    const end = matchEndMs(m.matchDate, m.endTime);
    if (end > bestEnd) {
      best = m;
      bestEnd = end;
    }
  }
  return best;
}
