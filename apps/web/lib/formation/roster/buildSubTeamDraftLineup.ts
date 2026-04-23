import type { Player } from "@/types/formation";
import type { MainPosition } from "@/types/position";
import { getMainPositionFromRole } from "@/lib/positionUtils";
import { getFormationRosterPlayerKey } from "@/lib/formation/roster/formationRosterPlayerKey";

const MAIN_POSITION_ORDER: readonly MainPosition[] = ["FW", "MF", "DF", "GK"];

function mainPositionSortIndex(role: string): number {
  const g = getMainPositionFromRole(role);
  if (g === "전체") return MAIN_POSITION_ORDER.length;
  const idx = MAIN_POSITION_ORDER.indexOf(g);
  return idx >= 0 ? idx : MAIN_POSITION_ORDER.length;
}

/**
 * 팀 드래프트에서 서브팀(A/B)에 배정된 선수만 모은 뒤, FW→MF→DF→GK 순으로 정렬한다.
 * 그룹 라벨 없이 한 열에 나열할 때 사용한다.
 */
export function buildSubTeamDraftLineupOrderedPlayers(
  players: Player[],
  draftTeamByKey: Readonly<Record<string, "A" | "B">>,
  subTeam: "A" | "B",
): Player[] {
  const ranked = players
    .map((player, rosterIndex) => ({ player, rosterIndex }))
    .filter(({ player }) => {
      const key = getFormationRosterPlayerKey(player);
      if (draftTeamByKey[key] !== subTeam) return false;
      return getMainPositionFromRole(player.position) !== "전체";
    });

  ranked.sort((a, b) => {
    const cmp =
      mainPositionSortIndex(a.player.position) -
      mainPositionSortIndex(b.player.position);
    if (cmp !== 0) return cmp;
    return a.rosterIndex - b.rosterIndex;
  });

  return ranked.map((r) => r.player);
}
