import type { findMatchAttendanceQuery } from "@/__generated__/findMatchAttendanceQuery.graphql";

export type MatchAttendanceRow =
  findMatchAttendanceQuery["response"]["findMatchAttendance"][number];

/**
 * findMatchAttendance 행 중 현재 사용자가 참석/불참으로 확정 투표한 행을 찾습니다.
 * (미투표·null 상태는 제외)
 */
export function findMyCommittedMatchAttendanceRow(
  rows: readonly MatchAttendanceRow[],
  userId: number | null,
): MatchAttendanceRow | null {
  if (userId == null) return null;
  for (const row of rows) {
    if (row.userId !== userId) continue;
    if (row.attendanceStatus === "ATTEND" || row.attendanceStatus === "ABSENT") {
      return row;
    }
  }
  return null;
}
