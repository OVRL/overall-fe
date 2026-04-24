import type { MatchAttendanceRow } from "../findMyCommittedMatchAttendanceRow";
import { findMyCommittedMatchAttendanceRow } from "../findMyCommittedMatchAttendanceRow";

function row(
  partial: Pick<MatchAttendanceRow, "userId" | "attendanceStatus"> &
    Partial<Omit<MatchAttendanceRow, "userId" | "attendanceStatus">>,
): MatchAttendanceRow {
  return {
    id: "1",
    user: null,
    ...partial,
  } as MatchAttendanceRow;
}

describe("findMyCommittedMatchAttendanceRow", () => {
  it("userId가 null이면 null을 반환한다", () => {
    expect(
      findMyCommittedMatchAttendanceRow(
        [row({ userId: 1, attendanceStatus: "ATTEND" })],
        null,
      ),
    ).toBeNull();
  });

  it("현재 사용자의 ATTEND 행을 반환한다", () => {
    const mine = row({ userId: 5, attendanceStatus: "ATTEND" });
    const other = row({ userId: 9, attendanceStatus: "ABSENT" });
    expect(findMyCommittedMatchAttendanceRow([other, mine], 5)).toBe(mine);
  });

  it("현재 사용자의 ABSENT 행을 반환한다", () => {
    const mine = row({ userId: 3, attendanceStatus: "ABSENT" });
    expect(findMyCommittedMatchAttendanceRow([mine], 3)).toBe(mine);
  });

  it("attendanceStatus가 null이면 해당 사용자 행은 확정 투표로 보지 않는다", () => {
    const pendingRow = {
      id: 1,
      userId: 2,
      matchId: 1,
      user: null,
      attendanceStatus: null,
    } as unknown as MatchAttendanceRow;
    expect(findMyCommittedMatchAttendanceRow([pendingRow], 2)).toBeNull();
  });

  it("일치하는 userId가 없으면 null이다", () => {
    expect(
      findMyCommittedMatchAttendanceRow(
        [row({ userId: 1, attendanceStatus: "ATTEND" })],
        99,
      ),
    ).toBeNull();
  });
});
