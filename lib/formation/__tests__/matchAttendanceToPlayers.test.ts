import {
  matchAttendanceRowsToAttendingPlayers,
  type GenericMatchAttendanceRow,
} from "@/lib/formation/matchAttendanceToPlayers";
import { getTeamMemberProfileImageFallbackUrl } from "@/lib/playerPlaceholderImage";

describe("matchAttendanceRowsToAttendingPlayers", () => {
  const baseRow = (overrides: Partial<GenericMatchAttendanceRow>): GenericMatchAttendanceRow => ({
    attendanceStatus: "ATTEND",
    teamMember: {
      id: 1,
      backNumber: 10,
      position: "CM",
      profileImg: null,
      overall: { ovr: 85 },
      user: {
        id: 99,
        name: "  홍길동  ",
        preferredNumber: null,
        profileImage: null,
      },
    },
    ...overrides,
  });

  it("attendanceStatus가 ATTEND이고 teamMember가 있을 때만 Player로 변환한다", () => {
    const rows: GenericMatchAttendanceRow[] = [
      baseRow({}),
      baseRow({
        attendanceStatus: "ABSENT",
      }),
      baseRow({ attendanceStatus: null }),
      baseRow({ teamMember: null }),
    ];

    const players = matchAttendanceRowsToAttendingPlayers(rows);
    const tm = baseRow({}).teamMember!;

    expect(players).toHaveLength(1);
    expect(players[0]).toEqual({
      id: 1,
      name: "홍길동",
      position: "CM",
      number: 10,
      overall: 85,
      image: undefined,
      imageFallbackUrl: getTeamMemberProfileImageFallbackUrl({
        id: Number(tm.id),
        user: { id: tm.user?.id ?? null },
      }),
    });
  });

  it("Relay 글로벌 ID(string)가 들어와도 숫자 ID로 파싱하여 Player를 생성한다", () => {
    const rows: GenericMatchAttendanceRow[] = [
      {
        attendanceStatus: "ATTEND",
        teamMember: {
          id: "TeamMember:555",
          backNumber: 7,
          position: "ST",
          profileImg: null,
          overall: { ovr: 99 },
          user: {
            id: "UserModel:777",
            name: "릴레이",
            preferredNumber: null,
            profileImage: null,
          },
        },
      },
    ];

    const [p] = matchAttendanceRowsToAttendingPlayers(rows);

    expect(p.id).toBe(555); // "TeamMember:555" -> 555
    expect(p.name).toBe("릴레이");
    expect(p.number).toBe(7);
  });

  it("backNumber가 없으면 preferredNumber를 반올림해 등번호로 쓴다", () => {
    const rows: GenericMatchAttendanceRow[] = [
      {
        attendanceStatus: "ATTEND",
        teamMember: {
          id: 2,
          backNumber: null,
          position: null,
          profileImg: null,
          overall: null,
          user: {
            id: "u",
            name: null,
            preferredNumber: 7.6,
            profileImage: "/p.png",
          },
        },
      },
    ];

    const [p] = matchAttendanceRowsToAttendingPlayers(rows);

    expect(p.number).toBe(8);
    expect(p.position).toBe("ST");
    expect(p.name).toBe("이름 없음");
  });

  it("빈 배열이면 빈 배열을 반환한다", () => {
    expect(matchAttendanceRowsToAttendingPlayers([])).toEqual([]);
  });
});
