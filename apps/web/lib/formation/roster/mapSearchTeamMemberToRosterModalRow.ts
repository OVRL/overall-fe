import type { searchTeamMemberQuery } from "@/__generated__/searchTeamMemberQuery.graphql";
import {
  getTeamMemberProfileImageFallbackUrl,
  getTeamMemberProfileImageRawUrl,
} from "@/lib/playerPlaceholderImage";
import type { PendingTeamMemberRow } from "@/types/formationRosterModal";

type TeamMemberNode = NonNullable<
  searchTeamMemberQuery["response"]["searchTeamMember"]
>[number];

/**
 * `searchTeamMember` 한 행 → 모달용 팀원 행 (참석 상태는 호출부에서 덧씀).
 */
export function mapSearchTeamMemberToRosterModalRow(
  tm: TeamMemberNode,
): Omit<
  PendingTeamMemberRow,
  "currentStatus" | "originalStatus"
> {
  const user = tm.user;
  const memberPref = tm.preferredNumber;
  const userPref = user?.preferredNumber;
  const number =
    memberPref != null
      ? memberPref
      : userPref != null
        ? Math.round(userPref)
        : 0;
  const name = user?.name?.trim() || "이름 없음";
  const position = tm.preferredPosition ?? "ST";
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
    teamMemberId: tm.id,
    userId: Number(tm.userId ?? user?.id ?? 0),
    rosterKind: "TEAM_MEMBER",
    name,
    position,
    number,
    overall,
    image: profileRaw || undefined,
    imageFallbackUrl,
  };
}
