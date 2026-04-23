import type { ProfileTeamMemberRow } from "@/app/(main)/profile/types/profileTeamMemberTypes";
import { formatRegionSearchDisplay } from "@/lib/region/formatRegionSearchDisplay";
import type { Position } from "@/types/position";
import type { ProfileEditFoot, ProfileEditFormInitial } from "./types";

function formatBirthDateInput(value: unknown): string {
  if (value == null || value === "") return "";
  if (typeof value === "string") {
    const isoDay = value.match(/^(\d{4}-\d{2}-\d{2})/);
    if (isoDay) return isoDay[1];
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      const y = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, "0");
      const da = String(d.getDate()).padStart(2, "0");
      return `${y}-${mo}-${da}`;
    }
    return value;
  }
  return "";
}

function toPositionList(
  positions: readonly string[] | null | undefined,
): Position[] {
  if (positions == null) return [];
  return positions.filter((p): p is Position => p !== "용병") as Position[];
}

export function mapMemberToProfileEditInitial(
  member: ProfileTeamMemberRow | null,
): ProfileEditFormInitial {
  const user = member?.user;
  const rawActivity =
    typeof user?.activityArea === "string" ? user.activityArea.trim() : "";
  const activityAreaCode =
    user?.region?.code != null ? String(user.region.code).trim() : "";

  const regionLabel = formatRegionSearchDisplay(user?.region ?? null);

  /** API가 `activityArea`에 행정코드만 넣는 경우 UI에는 지역명을 쓴다. */
  const activityFromUserIsProbablyCode =
    activityAreaCode !== "" && rawActivity === activityAreaCode;
  const activityArea =
    regionLabel ||
    (!activityFromUserIsProbablyCode && rawActivity ? rawActivity : "");

  const mainRaw = user?.mainPosition ?? null;
  const mainPosition =
    mainRaw != null && String(mainRaw) !== "용병"
      ? (mainRaw as Position)
      : null;

  const subPositions = toPositionList(user?.subPositions);

  const footRaw = member?.foot ?? user?.foot;
  const foot: ProfileEditFoot =
    footRaw === "L" || footRaw === "R" || footRaw === "B" ? footRaw : "B";

  const prefNum = user?.preferredNumber ?? member?.preferredNumber ?? null;
  const preferredNumber =
    prefNum != null && !Number.isNaN(Number(prefNum)) ? String(prefNum) : "";

  return {
    name: user?.name?.trim() ?? "",
    birthDate: formatBirthDateInput(user?.birthDate),
    activityArea,
    activityAreaCode,
    mainPosition,
    subPositions,
    foot,
    preferredNumber,
    favoritePlayer: user?.favoritePlayer?.trim() ?? "",
    introduction: member?.introduction?.trim() ?? "",
    profilePreviewUrl:
      member?.profileImg?.trim() || user?.profileImage?.trim() || null,
  };
}
