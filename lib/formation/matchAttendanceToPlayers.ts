import type { Player } from "@/types/formation";
import {
  getTeamMemberProfileImageFallbackUrl,
  getTeamMemberProfileImageRawUrl,
} from "@/lib/playerPlaceholderImage";
import type { MatchAttendanceRowSSR } from "@/utils/fetchFindMatchAttendanceSSR";

/**
 * 참석 확정(ATTEND) 행만 포메이션 `Player` DTO로 변환합니다.
 * 프로필 URL·플레이스홀더는 홈 로스터와 동일 규칙 (`getTeamMemberProfileImage*`).
 */
export function matchAttendanceRowsToAttendingPlayers(
  rows: MatchAttendanceRowSSR[],
): Player[] {
  const attending = rows.filter(
    (row) => row.attendanceStatus === "ATTEND" && row.teamMember != null,
  );

  return attending.map((row) => {
    const tm = row.teamMember!;
    const user = tm.user;
    const back = tm.backNumber;
    const preferred = user?.preferredNumber;
    const number =
      back != null
        ? back
        : preferred != null
          ? Math.round(preferred)
          : 0;

    const name = user?.name?.trim() || "이름 없음";
    const position = tm.position ?? "ST";
    const overall = tm.overall?.ovr ?? 0;

    const profileRaw = getTeamMemberProfileImageRawUrl({
      profileImg: tm.profileImg,
      user: tm.user ?? undefined,
    });
    const imageFallbackUrl = getTeamMemberProfileImageFallbackUrl({
      id: tm.id,
      user: tm.user ?? undefined,
    });

    return {
      id: tm.id,
      name,
      position,
      number,
      overall,
      image: profileRaw || undefined,
      imageFallbackUrl,
    } satisfies Player;
  });
}
