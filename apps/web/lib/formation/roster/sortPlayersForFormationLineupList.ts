import type { Player } from "@/types/formation";
import type { MainPosition } from "@/types/position";
import { getMainPositionFromRole } from "@/lib/positionUtils";
import { isMercenaryFormationPlayer } from "@/lib/formation/roster/isMercenaryFormationPlayer";

/** 팀원 포지션만 — 대분류(GK·DF·MF·FW), 용병 행은 `getLineupListSortCategory`에서 별도 처리 */
function getLineupMainCategoryFromRole(role: string): MainPosition | "기타" {
  const main = getMainPositionFromRole(role);
  if (main !== "전체") return main;
  const u = role.trim().toUpperCase();
  if (u === "FW" || u === "MF" || u === "DF" || u === "GK") {
    return u as MainPosition;
  }
  return "기타";
}

/**
 * 명단 정렬 키: GK → DF → MF → FW → 용병 → 기타, 동일 키는 이름순.
 * 용병(`rosterKind` / `position === "용병"`)은 MF와 섞지 않는다.
 */
export function getLineupListSortCategory(
  p: Player,
): MainPosition | "용병" | "기타" {
  if (isMercenaryFormationPlayer(p)) return "용병";
  return getLineupMainCategoryFromRole(p.position);
}

const SORT_ORDER: Record<MainPosition | "용병", number> = {
  GK: 0,
  DF: 1,
  MF: 2,
  FW: 3,
  용병: 4,
};

export function comparePlayersForFormationLineupList(
  a: Player,
  b: Player,
): number {
  const ca = getLineupListSortCategory(a);
  const cb = getLineupListSortCategory(b);
  const oa = ca === "기타" ? 5 : SORT_ORDER[ca];
  const ob = cb === "기타" ? 5 : SORT_ORDER[cb];
  if (oa !== ob) return oa - ob;
  return a.name.localeCompare(b.name, "ko", { sensitivity: "base" });
}

/** 데스크톱 `FormationPlayerGroupList`·모바일 `FormationPlayerListMobile` 공통 정렬 */
export function sortPlayersForFormationLineupList(
  players: readonly Player[],
): Player[] {
  return [...players].sort(comparePlayersForFormationLineupList);
}
