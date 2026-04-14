import type { Player } from "@/types/formation";
import type { FormationRosterViewMode } from "@/types/formationRosterViewMode";
import type { InHouseDraftTeamChoice } from "@/hooks/formation/useInHouseDraftTeamAssignments";

/**
 * 내전에서 A팀/B팀 라인업 탭일 때 — 팀 드래프트로 해당 서브팀에 배정된 선수만 명단 후보로 남긴다.
 * `draft` 모드·미배정(null) 선수는 여기서 걸러지지 않음(호출부에서 모드 분기).
 */
export function filterPlayersForInHouseLineupTab(
  players: Player[],
  formationRosterViewMode: FormationRosterViewMode | undefined,
  getDraftTeam: ((player: Player) => InHouseDraftTeamChoice) | undefined,
): Player[] {
  if (getDraftTeam == null) return players;
  if (formationRosterViewMode !== "A" && formationRosterViewMode !== "B") {
    return players;
  }
  const subTeam = formationRosterViewMode;
  return players.filter((p) => getDraftTeam(p) === subTeam);
}
