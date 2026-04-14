import type { Player } from "@/types/formation";
import type { FormationRosterViewMode } from "@/types/formationRosterViewMode";
import type { InHouseDraftTeamChoice } from "@/hooks/formation/useInHouseDraftTeamAssignments";

export type InHouseListToBoardDnDResult =
  | { allowed: true }
  | { allowed: false; message: string };

/**
 * 내전 A/B 라인업에서 **명단(리스트) → 보드** 드롭만 검증한다.
 * 보드 슬롯 간 이동(`BoardPlayer`)은 기존 배치 조작이므로 여기서 막지 않는다.
 */
export function validateInHouseListToBoardDnD(
  matchType: "MATCH" | "INTERNAL" | undefined,
  formationRosterViewMode: FormationRosterViewMode,
  /** `event.active.data.current?.type` — BoardPlayer면 검증 생략 */
  dragSourceType: string | undefined,
  player: Player,
  getDraftTeam: ((p: Player) => InHouseDraftTeamChoice) | undefined,
): InHouseListToBoardDnDResult {
  if (dragSourceType === "BoardPlayer") {
    return { allowed: true };
  }
  if (matchType !== "INTERNAL") {
    return { allowed: true };
  }
  if (formationRosterViewMode !== "A" && formationRosterViewMode !== "B") {
    return { allowed: true };
  }
  if (getDraftTeam == null) {
    return { allowed: true };
  }

  const subTeam = formationRosterViewMode;
  const draft = getDraftTeam(player);
  if (draft === subTeam) {
    return { allowed: true };
  }
  if (draft === null) {
    return {
      allowed: false,
      message:
        "팀 드래프트에서 이 선수의 소속(A/B)을 먼저 정한 뒤 보드에 둘 수 있습니다.",
    };
  }
  return {
    allowed: false,
    message: "선택한 라인업과 팀 드래프트 소속이 맞지 않습니다.",
  };
}
