import { matchAttendanceRowsToAttendingPlayers } from "@/lib/formation/matchAttendanceToPlayers";
import {
  getTeamMemberProfileImageFallbackUrl,
  getTeamMemberProfileImageRawUrl,
} from "@/lib/playerPlaceholderImage";
import type { MatchAttendanceRowSSR } from "@/utils/fetchFindMatchAttendanceSSR";

describe("matchAttendanceRowsToAttendingPlayers", () => {
  const baseRow = (
    overrides: Partial<MatchAttendanceRowSSR> & {
      teamMember?: MatchAttendanceRowSSR["teamMember"];
    },
  ): MatchAttendanceRowSSR => ({
    attendanceStatus: "ATTEND",
    teamMember: {
      id: 1,
      backNumber: 10,
      position: "CM",
      profileImg: null,
      overall: { ovr: 85 },
      user: {
        id: "UserModel:99",
        name: "  홍길동  ",
        preferredNumber: null,
        profileImage: null,
      },
    },
    ...overrides,
  });

  it("attendanceStatus가 ATTEND이고 teamMember가 있을 때만 Player로 변환한다", () => {
    const rows: MatchAttendanceRowSSR[] = [
      baseRow({}),
      baseRow({
        attendanceStatus: "ABSENT",
        teamMember: baseRow({}).teamMember,
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
        id: tm.id,
        user: tm.user,
      }),
    });
    expect(
      getTeamMemberProfileImageRawUrl({
        profileImg: tm.profileImg,
        user: tm.user,
      }),
    ).toBe("");
  });

  it("backNumber가 없으면 preferredNumber를 반올림해 등번호로 쓴다", () => {
    const rows: MatchAttendanceRowSSR[] = [
      baseRow({
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
      }),
    ];

    const [p] = matchAttendanceRowsToAttendingPlayers(rows);
    const tm = rows[0].teamMember!;

    expect(p.number).toBe(8);
    expect(p.position).toBe("ST");
    expect(p.name).toBe("이름 없음");
    expect(p.overall).toBe(0);
    expect(p.image).toBe("/p.png");
    expect(p.imageFallbackUrl).toBe(
      getTeamMemberProfileImageFallbackUrl({ id: tm.id, user: tm.user }),
    );
  });

  it("profileImg가 있으면 image로 우선 사용한다", () => {
    const rows: MatchAttendanceRowSSR[] = [
      baseRow({
        teamMember: {
          id: 3,
          backNumber: 1,
          position: "GK",
          profileImg: "/tm.png",
          overall: { ovr: 90 },
          user: {
            id: "u",
            name: "키퍼",
            preferredNumber: null,
            profileImage: "/user.png",
          },
        },
      }),
    ];

    const [p] = matchAttendanceRowsToAttendingPlayers(rows);
    const tm = rows[0].teamMember!;
    expect(p.image).toBe("/tm.png");
    expect(p.imageFallbackUrl).toBe(
      getTeamMemberProfileImageFallbackUrl({ id: tm.id, user: tm.user }),
    );
  });

  it("빈 배열이면 빈 배열을 반환한다", () => {
    expect(matchAttendanceRowsToAttendingPlayers([])).toEqual([]);
  });
});
