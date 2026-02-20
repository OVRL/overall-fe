import React from "react";
import { Player } from "@/types/formation";
import FormationPlayerRow from "./FormationPlayerRow";

interface FormationPlayerGroupListProps {
  filteredPlayers: Player[];
  currentQuarterLineups: Record<number, Player | null>[];
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player) => void;
  onRemovePlayer?: (id: number) => void;
}

const FormationPlayerGroupList: React.FC<FormationPlayerGroupListProps> = ({
  filteredPlayers,
  currentQuarterLineups,
  selectedPlayer,
  onSelectPlayer,
  onRemovePlayer,
}) => {
  // Helper to determine player's active quarters
  const getPlayerQuarters = (playerId: number): number[] => {
    const quarters: number[] = [];
    currentQuarterLineups.forEach((quarterData, index) => {
      if (Object.values(quarterData || {}).some((p) => p?.id === playerId)) {
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
    const isSelected = selectedPlayer?.id === player.id;
    const activeQuarters = getPlayerQuarters(player.id);

    return (
      <FormationPlayerRow
        key={player.id}
        player={player}
        isSelected={isSelected}
        activeQuarters={activeQuarters}
        onSelect={onSelectPlayer}
        onRemove={handleRemoveClick}
      />
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 pr-1">
      <div className="flex flex-col gap-2">
        {filteredPlayers.map((p) => renderRow(p))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center text-gray-500 py-10 text-sm">
          선수가 없습니다.
        </div>
      )}
    </div>
  );
};

export default FormationPlayerGroupList;
