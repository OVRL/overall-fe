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
  // Helper to determine player's team in current quarter
  const getPlayerTeamCurrentQuarter = (playerId: number): string | null => {
    for (let i = 0; i < currentQuarterLineups.length; i++) {
      if (
        Object.values(currentQuarterLineups[i] || {}).some(
          (p) => p?.id === playerId,
        )
      ) {
        // Assume index 0=A, 1=B, 2=C, 3=D based on current logic
        return ["A", "B", "C", "D"][i];
      }
    }
    return null; // Unassigned
  };

  // Helper to determine player's active quarters
  const getPlayerQuarters = (playerId: number): number[] => {
    const quarters: number[] = [];
    currentQuarterLineups.forEach((quarterData, index) => {
      // index 0 -> 1Q, 1 -> 2Q, etc.
      // QuarterData usually has quarter number but if not we assume index+1
      // based on FormationWorkspace logic.
      if (Object.values(quarterData || {}).some((p) => p?.id === playerId)) {
        quarters.push(index + 1);
      }
    });
    return quarters;
  };

  // Sort Helper
  const sortByCount = (a: Player, b: Player) =>
    (a.quarterCount || 0) - (b.quarterCount || 0);

  // Grouping Logic
  const unassignedPlayers = filteredPlayers
    .filter((p) => getPlayerTeamCurrentQuarter(p.id) === null)
    .sort(sortByCount);

  const teamGroups: Record<string, Player[]> = {};
  ["A", "B", "C", "D"].forEach((team) => {
    teamGroups[team] = filteredPlayers
      .filter((p) => getPlayerTeamCurrentQuarter(p.id) === team)
      .sort(sortByCount);
  });

  // Handlers
  const handleDragStart = (e: React.DragEvent, player: Player) => {
    e.dataTransfer.setData("player", JSON.stringify(player));
    e.dataTransfer.effectAllowed = "copy";
    onSelectPlayer(player);
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
    const currentTeam = getPlayerTeamCurrentQuarter(player.id);
    const isSelected = selectedPlayer?.id === player.id;
    const activeQuarters = getPlayerQuarters(player.id);

    return (
      <FormationPlayerRow
        key={player.id}
        player={player}
        currentTeam={currentTeam}
        isSelected={isSelected}
        activeQuarters={activeQuarters}
        onSelect={onSelectPlayer}
        onRemove={handleRemoveClick}
        onDragStart={handleDragStart}
      />
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4 pr-1">
      {/* 1. Unassigned Section */}
      {unassignedPlayers.length > 0 && (
        <div>
          <div className="flex flex-col gap-1 min-w-80">
            {unassignedPlayers.map((p) => renderRow(p))}
          </div>
        </div>
      )}

      {/* 2. Team Sections */}
      {["A", "B", "C", "D"].map((team) => {
        const group = teamGroups[team];
        if (group.length === 0) return null;
        return (
          <div key={team}>
            <div
              className={`text-xs font-bold mb-2 uppercase tracking-wider px-1 border-b pb-1 flex justify-between items-center ${
                team === "A"
                  ? "text-blue-400 border-blue-900/30"
                  : team === "B"
                    ? "text-red-400 border-red-900/30"
                    : team === "C"
                      ? "text-green-400 border-green-900/30"
                      : "text-purple-400 border-purple-900/30"
              }`}
            >
              <span>
                {team}팀 ({group.length})
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {group.map((p) => renderRow(p))}
            </div>
          </div>
        );
      })}

      {filteredPlayers.length === 0 && (
        <div className="text-center text-gray-500 py-10 text-sm">
          선수가 없습니다.
        </div>
      )}
    </div>
  );
};

export default FormationPlayerGroupList;
