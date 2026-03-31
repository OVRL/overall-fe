import type { Player } from "@/types/formation";
import {
  getTeamMemberProfileImageFallbackUrl,
  getTeamMemberProfileImageRawUrl,
} from "@/lib/playerPlaceholderImage";
import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";

/**
 * findMatchAttendance 응답 행 타입 (Relay 및 SSR 공통 지원을 위한 느슨한 인터페이스)
 */
export interface GenericMatchAttendanceRow {
  readonly attendanceStatus?: string | null;
  readonly teamMember?: {
    /** GraphQL Int 또는 레거시 Relay `Type:id` 문자열 */
    readonly id: string | number;
    readonly backNumber?: number | null;
    readonly position?: string | null;
    readonly profileImg?: string | null;
    readonly overall?: {
      readonly ovr?: number | null;
    } | null;
    readonly user?: {
      /** GraphQL Int 또는 레거시 Relay `Type:id` 문자열 */
      readonly id: string | number;
      readonly name?: string | null;
      readonly preferredNumber?: number | null;
      readonly profileImage?: string | null;
    } | null;
  } | null;
}

/**
 * 참석 확정(ATTEND) 행만 포메이션 `Player` DTO로 변환합니다.
 */
export function matchAttendanceRowsToAttendingPlayers(
  rows: readonly (GenericMatchAttendanceRow | null)[],
): Player[] {
  const attending = rows.filter(
    (row): row is GenericMatchAttendanceRow =>
      row != null && row.attendanceStatus === "ATTEND" && row.teamMember != null,
  );

  return attending.map((row) => {
    const tm = row.teamMember!;
    const user = tm.user;
    const back = tm.backNumber;
    const preferred = user?.preferredNumber;

    const numericId =
      parseNumericIdFromRelayGlobalId(tm.id) ?? Number(String(tm.id));

    const number =
      back != null ? back : preferred != null ? Math.round(preferred) : 0;

    const name = user?.name?.trim() || "이름 없음";
    const position = tm.position ?? "ST";
    const overall = tm.overall?.ovr ?? 0;

    const profileRaw = getTeamMemberProfileImageRawUrl({
      profileImg: tm.profileImg,
      user: user
        ? { id: user.id, profileImage: user.profileImage }
        : null,
    });
    const imageFallbackUrl = getTeamMemberProfileImageFallbackUrl({
      id: numericId,
      user: user ? { id: user.id } : null,
    });

    return {
      id: numericId,
      name,
      position,
      number,
      overall,
      image: profileRaw || undefined,
      imageFallbackUrl,
    };
  });
}
