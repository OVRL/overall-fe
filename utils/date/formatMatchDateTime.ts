const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"] as const;

/**
 * matchDate (YYYY-MM-DD)와 startTime (HH:mm:ss)을
 * "01.25 (토) 15:00" 형태로 포맷합니다.
 */
export function formatMatchDateTime(matchDate: string, startTime: string): string {
  const [year, month, day] = matchDate.split("-").map(Number);
  const [hours, minutes] = startTime.split(":").map(Number);
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);

  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const weekday = WEEKDAY_KO[date.getDay()];
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${mm}.${dd} (${weekday}) ${hh}:${min}`;
}
