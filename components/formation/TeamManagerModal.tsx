import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Player, QuarterData, TeamType } from "@/types/formation";
import FieldBoard from "@/components/formation/board/FieldBoard";
import { FORMATIONS } from "@/constants/formation";
import FormationPlayerList from "./FormationPlayerList";

interface TeamManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  quarterId: number;
  teamKey: string;
  teamName: string;
  currentLineup: Record<number, Player | null>;
  quarters: QuarterData[];
  allPlayers: Player[]; // playersWithCounts
  currentQuarterLineups: Record<number, Player | null>[];
  onUpdateLineup: (
    quarterId: number,
    team: string,
    posId: number,
    player: Player | null,
  ) => void;
}

const TeamManagerModal: React.FC<TeamManagerModalProps> = ({
  isOpen,
  onClose,
  quarterId,
  teamKey,
  teamName,
  currentLineup,
  quarters,
  allPlayers,
  currentQuarterLineups,
  onUpdateLineup,
}) => {
  const [selectedListPlayer, setSelectedListPlayer] = useState<Player | null>(
    null,
  );

  const currentQuarter = quarters.find((q) => q.id === quarterId);
  const formation = currentQuarter?.formation || "4-2-3-1";

  // When modal closes, reset selection
  useEffect(() => {
    if (!isOpen) {
      setSelectedListPlayer(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSwap = (pos1: number, pos2: number) => {
    const player1 = currentLineup[pos1];
    const player2 = currentLineup[pos2];
    onUpdateLineup(quarterId, teamKey, pos1, player2 || null);
    onUpdateLineup(quarterId, teamKey, pos2, player1 || null);
  };

  const handlePlaceListPlayer = (posId: number) => {
    if (selectedListPlayer) {
      onUpdateLineup(quarterId, teamKey, posId, selectedListPlayer);
      setSelectedListPlayer(null);
    }
  };

  const isLineupFull = Object.keys(currentLineup).length >= 11;

  // Simple add/remove handlers for the list (mocking for now or pass if needed)
  // For TeamManager, we reuse formatting from FormationPlayerList which mainly needs players and selection
  // The 'add/remove player' logic in list might refer to global roster or just available pool.
  // Assuming basic functionality:
  const handleAddPlayer = (name: string) => {
    console.log("Add not implemented in modal", name);
  };
  const handleRemovePlayer = (id: number) => {
    console.log("Remove not implemented in modal", id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div
        className="bg-surface-primary w-full max-w-6xl h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-surface-secondary border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="bg-primary text-black px-2 py-0.5 rounded text-sm">
              {quarterId}Q
            </span>
            {teamName} 팀 관리
            <span className="text-sm font-normal text-gray-400 ml-2">
              ({formation})
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2"
          >
            ✕ 닫기
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left: Field */}
          <div className="flex-1 bg-black/50 p-4 overflow-y-auto flex items-center justify-center">
            <div className="w-full max-w-3xl">
              <FieldBoard
                quarterId={quarterId}
                lineup={currentLineup}
                formation={formation}
                onUpdate={(pos, p) =>
                  onUpdateLineup(quarterId, teamKey, pos, p)
                }
                onSwap={handleSwap}
                selectedListPlayer={selectedListPlayer}
                onPlaceListPlayer={handlePlaceListPlayer}
                // onPositionClick - search not needed if we drag from right side?
                // But if click empty, maybe clear? or do nothing?
                onPositionClick={() => {}}
                className="border-gray-600"
              />
            </div>
          </div>

          {/* Right: Player List */}
          <div className="w-full lg:w-96 bg-surface-secondary border-l border-gray-700 flex flex-col">
            <FormationPlayerList
              players={allPlayers}
              currentQuarterLineups={[currentLineup]} // Only show usage for THIS team in this view? or all?
              // Probably want to show availability across all teams in this quarter if we want to valid collision?
              // But prop says 'currentQuarterLineups'. Let's pass all lineups for this quarter.
              // Actually `currentQuarterLineups` prop passed from parent is correct.
              selectedPlayer={selectedListPlayer}
              onSelectPlayer={setSelectedListPlayer}
              isLineupFull={isLineupFull}
              onAddPlayer={handleAddPlayer}
              onRemovePlayer={handleRemovePlayer}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagerModal;
