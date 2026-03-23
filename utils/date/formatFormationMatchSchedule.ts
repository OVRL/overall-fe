const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"] as const;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** "18:00:00" | "18:00" → "18:00" */
function toHourMinute(time: string): string {
  const [h, m] = time.split(":");
  if (h == null || m == null) return time;
  return `${pad2(Number(h))}:${pad2(Number(m))}`;
}

/**
 * 포메이션 경기 일정 한 줄: `2026-02-03(목) 18:00~20:00`
 * matchDate: YYYY-MM-DD, startTime/endTime: HH:mm(:ss)
 */
export function formatFormationMatchSchedule(
  matchDate: string,
  startTime: string,
  endTime: string,
): string {
  const [y, mo, d] = matchDate.split("-").map(Number);
  if (
    Number.isNaN(y) ||
    Number.isNaN(mo) ||
    Number.isNaN(d)
  ) {
    return `${matchDate} ${toHourMinute(startTime)}~${toHourMinute(endTime)}`;
  }
  const date = new Date(y, mo - 1, d);
  const weekday = WEEKDAY_KO[date.getDay()];
  const datePart = `${y}-${pad2(mo)}-${pad2(d)}(${weekday})`;
  return `${datePart} ${toHourMinute(startTime)}~${toHourMinute(endTime)}`;
}
