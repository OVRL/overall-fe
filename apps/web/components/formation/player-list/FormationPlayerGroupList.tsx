import React, { useMemo } from "react";
import { Player } from "@/types/formation";
import FormationPlayerRow, {
  type FormationPlayerListRowMode,
} from "./FormationPlayerRow";
import {
  getFormationRosterPlayerKey,
  isSameFormationRosterPlayer,
} from "@/lib/formation/roster/formationRosterPlayerKey";
import type { InHouseDraftTeamChoice } from "@/hooks/formation/useInHouseDraftTeamAssignments";
import { sortPlayersForFormationLineupList } from "@/lib/formation/roster/sortPlayersForFormationLineupList";

interface FormationPlayerGroupListProps {
  filteredPlayers: Player[];
  currentQuarterLineups: Record<number, Player | null>[];
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player) => void;
  onRemovePlayer?: (id: number) => void;
  /** 팀 드래프트 모드 등에서 보드 배치용 드래그 비활성화 */
  disableRowDrag?: boolean;
  listRowMode?: FormationPlayerListRowMode;
  getDraftTeam?: (player: Player) => InHouseDraftTeamChoice;
  onDraftTeamSelect?: (player: Player, team: InHouseDraftTeamChoice) => void;
}

const FormationPlayerGroupList: React.FC<FormationPlayerGroupListProps> = ({
  filteredPlayers,
  currentQuarterLineups,
  selectedPlayer,
  onSelectPlayer,
  onRemovePlayer,
  disableRowDrag = false,
  listRowMode = "lineup",
  getDraftTeam,
  onDraftTeamSelect,
}) => {
  const sortedPlayers = useMemo(
    () => sortPlayersForFormationLineupList(filteredPlayers),
    [filteredPlayers],
  );

  const getPlayerQuarters = (target: Player): number[] => {
    const quarters: number[] = [];
    currentQuarterLineups.forEach((quarterData, index) => {
      if (
        Object.values(quarterData || {}).some(
          (p) => p != null && isSameFormationRosterPlayer(p, target),
        )
      ) {
        quarters.push(index + 1);
      }
    });
    return quarters;
  };

  const handleRemoveClick = (e: React.MouseEvent, player: Player) => {
    e.stopPropagation();
    if (
      confirm(
        `'${player.name}' 선수를 정말 삭제하시겠습니까?\n모든 분기 라인업에서 제거됩니다.`,
      )
    ) {
      onRemovePlayer?.(player.id);
    }
  };

  // Render Row Helper
  const renderRow = (player: Player) => {
    const isSelected =
      selectedPlayer != null &&
      isSameFormationRosterPlayer(selectedPlayer, player);
    const activeQuarters = getPlayerQuarters(player);
    const rosterKey = getFormationRosterPlayerKey(player);

    return (
      <FormationPlayerRow
        key={rosterKey}
        player={player}
        isSelected={isSelected}
        activeQuarters={activeQuarters}
        onSelect={onSelectPlayer}
        onRemove={handleRemoveClick}
        disableDrag={disableRowDrag}
        listRowMode={listRowMode}
        draftTeam={getDraftTeam?.(player) ?? null}
        onDraftTeamChange={
          listRowMode === "draft" && onDraftTeamSelect
            ? (team) => onDraftTeamSelect(player, team)
            : undefined
        }
      />
    );
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-hide space-y-4 pr-1">
      <div className="flex flex-col gap-2">
        {sortedPlayers.map((p) => renderRow(p))}
      </div>

      {sortedPlayers.length === 0 && (
        <div className="text-center text-gray-500 py-10 text-sm">
          선수가 없습니다.
        </div>
      )}
    </div>
  );
};

export default FormationPlayerGroupList;
