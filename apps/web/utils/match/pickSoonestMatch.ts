import type { MatchForUpcomingDisplay } from "@/components/home/UpcomingMatch/upcomingMatchDisplay";

/** endTime·쿼터가 없을 때, 시작 직후 곧바로 '종료'로 분류되지 않게 하는 가정 경기 길이(2h) */
const DEFAULT_FALLBACK_MATCH_DURATION_MS = 2 * 60 * 60 * 1000;

/** `Date` 스칼라·ISO 문자열·YYYY-MM-DD를 YYYY-MM-DD로 통일. 실패 시 null */
function normalizeMatchDateYmd(matchDate: unknown): string | null {
  if (matchDate == null) return null;
  if (matchDate instanceof Date) {
    if (Number.isNaN(matchDate.getTime())) return null;
    const y = matchDate.getFullYear();
    const mo = String(matchDate.getMonth() + 1).padStart(2, "0");
    const d = String(matchDate.getDate()).padStart(2, "0");
    return `${y}-${mo}-${d}`;
  }
  const s = String(matchDate).trim();
  if (s === "" || s === "undefined" || s === "null") return null;
  const head = s.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(head)) return head;
  return null;
}

function normalizeClockPart(time: unknown): string | null {
  if (time == null) return null;
  const s = String(time).trim();
  if (s === "" || s === "undefined" || s === "null") return null;
  return s;
}

/**
 * matchDate (YYYY-MM-DD) + startTime (HH:mm:ss)를 합쳐
 * 타임스탬프(ms)로 변환합니다.
 * — 필드가 비어 있거나 날짜 형식이 아니면 `NaN` (비교 시 제외)
 */
export function matchStartMs(
  matchDate: string | null | undefined,
  startTime: string | null | undefined,
): number {
  const md = normalizeMatchDateYmd(matchDate);
  const st = normalizeClockPart(startTime);
  if (md == null || st == null) {
    return Number.NaN;
  }
  const [year, month, day] = md.split("-").map(Number);
  const [hours, minutes] = st.split(":").map(Number);
  if ([year, month, day, hours, minutes].some((n) => Number.isNaN(n))) {
    return Number.NaN;
  }
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  const t = date.getTime();
  return Number.isNaN(t) ? Number.NaN : t;
}

/** matchDate + endTime 기준 종료 시각(ms). endTime은 HH:mm(:ss) 형식을 가정합니다. */
export function matchEndMs(
  matchDate: string | null | undefined,
  endTime: string | null | undefined,
): number {
  const md = normalizeMatchDateYmd(matchDate);
  const et = normalizeClockPart(endTime);
  if (md == null || et == null) {
    return Number.NaN;
  }
  const [year, month, day] = md.split("-").map(Number);
  const [hours, minutes] = et.split(":").map(Number);
  if ([year, month, day, hours, minutes].some((n) => Number.isNaN(n))) {
    return Number.NaN;
  }
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  const t = date.getTime();
  return Number.isNaN(t) ? Number.NaN : t;
}

/**
 * 종료 시각(ms). 서버가 `endTime`을 비우거나 시작과 동일하게 둔 경우에도
 * 진행 중 경기가 곧바로 '종료'로 떨어지지 않게 추정합니다.
 *
 * — `endTime`이 있고 **시작보다 늦게** 파싱되면 그 값을 사용
 * — 그렇지 않으면 `quarterCount * quarterDuration`(분)을 시작에 더함
 * — 쿼터 정보가 없으면 `DEFAULT_FALLBACK_MATCH_DURATION_MS`(2h)를 더함
 */
export function effectiveMatchEndMs(m: MatchForUpcomingDisplay): number {
  const start = matchStartMs(m.matchDate, m.startTime);
  if (!Number.isFinite(start)) {
    return Number.NaN;
  }

  const raw = m.endTime;
  if (raw != null && String(raw).trim() !== "") {
    const fromEnd = matchEndMs(m.matchDate, String(raw).trim());
    if (Number.isFinite(fromEnd) && fromEnd > start) {
      return fromEnd;
    }
  }

  const qc = m.quarterCount ?? 0;
  const qdMin = m.quarterDuration ?? 0;
  if (qc > 0 && qdMin > 0) {
    return start + qc * qdMin * 60 * 1000;
  }
  return start + DEFAULT_FALLBACK_MATCH_DURATION_MS;
}

/**
 * findMatch 배열에서 경기 시작 시각이 가장 가까운 경기 하나를 반환합니다.
 * 과거 경기도 포함해 "가장 빠른" 경기를 반환합니다.
 * (다가오는 경기만 쓰려면 호출 측에서 now 이전 필터링 후 사용 가능)
 */
export function pickSoonestMatch<T extends MatchForUpcomingDisplay>(
  matches: T[],
): T | null {
  const valid = matches.filter((m) =>
    Number.isFinite(matchStartMs(m.matchDate, m.startTime)),
  );
  if (valid.length === 0) return null;
  if (valid.length === 1) return valid[0]!;

  let soonest = valid[0]!;
  let soonestTs = matchStartMs(soonest.matchDate, soonest.startTime);

  for (let i = 1; i < valid.length; i++) {
    const m = valid[i]!;
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
  const notEnded = matches.filter((m) => {
    const end = effectiveMatchEndMs(m);
    return Number.isFinite(end) && end > nowMs;
  });
  return pickSoonestMatch(notEnded);
}

/**
 * 이미 종료된 경기(end <= now)만 남기고, 종료 시각이 가장 늦은 1건을 반환합니다.
 */
export function pickMostRecentlyEndedMatch<T extends MatchForUpcomingDisplay>(
  matches: T[],
  nowMs: number = Date.now(),
): T | null {
  const ended = matches.filter((m) => {
    const end = effectiveMatchEndMs(m);
    return Number.isFinite(end) && end <= nowMs;
  });
  if (ended.length === 0) return null;
  let best = ended[0]!;
  let bestEnd = effectiveMatchEndMs(best);
  for (let i = 1; i < ended.length; i++) {
    const m = ended[i]!;
    const end = effectiveMatchEndMs(m);
    if (end > bestEnd) {
      best = m;
      bestEnd = end;
    }
  }
  return best;
}
