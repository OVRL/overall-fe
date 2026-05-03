import type { ProfileTeamMemberRow } from "@/app/(main)/profile/types/profileTeamMemberTypes";
import { formatRegionSearchDisplay } from "@/lib/region/formatRegionSearchDisplay";
import type { Position } from "@/types/position";
import type { UserProfileEditFoot, UserProfileEditFormInitial } from "./types";

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

function parseRelayId(id: string | number | null | undefined): number {
  if (typeof id === "number") return id;
  if (typeof id === "string") {
    const parts = id.split(":");
    const num = parseInt(parts[parts.length - 1], 10);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

export function mapMemberToUserProfileEditInitial(
  member: ProfileTeamMemberRow | null,
): UserProfileEditFormInitial {
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
  const foot: UserProfileEditFoot =
    footRaw === "L" || footRaw === "R" || footRaw === "B" ? footRaw : "B";

  return {
    id: parseRelayId(user?.id),
    name: user?.name?.trim() ?? "",
    birthDate: formatBirthDateInput(user?.birthDate),
    activityArea,
    activityAreaCode,
    mainPosition,
    subPositions,
    foot,
    height: user?.height ? String(user.height) : "",
    weight: user?.weight ? String(user.weight) : "",
    favoritePlayer: user?.favoritePlayer?.trim() ?? "",
  };
}
