import type { MatchAttendanceRow } from "./findMyCommittedMatchAttendanceRow";

export type { MatchAttendanceRow };

/** 참석·불참만 집계 (미투표 등은 제외) */
export function partitionMatchAttendanceByStatus(
  rows: readonly MatchAttendanceRow[],
) {
  const attend: MatchAttendanceRow[] = [];
  const absent: MatchAttendanceRow[] = [];
  for (const row of rows) {
    if (row.attendanceStatus === "ATTEND") attend.push(row);
    else if (row.attendanceStatus === "ABSENT") absent.push(row);
  }
  const byUser = (a: MatchAttendanceRow, b: MatchAttendanceRow) =>
    a.userId - b.userId;
  attend.sort(byUser);
  absent.sort(byUser);
  return { attend, absent };
}
