"use client";

import React from "react";
import FormationControls from "@/components/formation/FormationControls";
import FormationBoardList from "@/components/formation/board/FormationBoardList";
import FormationPlayerList from "@/components/formation/player-list/FormationPlayerList";
import { QuarterData, Player } from "@/types/formation";

export interface FormationBuilderDesktopProps {
  scheduleCard: React.ReactNode;
  quarters: QuarterData[];
  setQuarters: React.Dispatch<React.SetStateAction<QuarterData[]>>;
  addQuarter: () => void;
  currentQuarterId: number | null;
  setCurrentQuarterId: (id: number | null) => void;
  selectedPlayer: Player | null;
  setSelectedPlayer: (player: Player | null) => void;
  onPositionRemove: (quarterId: number, index: number) => void;
  assignPlayer?: (quarterId: number, positionIndex: number, player: Player) => void;
  initialPlayers: Player[];
}

/**
 * 데스크톱 전용 레이아웃: 매치 카드 + FormationControls + FormationBoardList + FormationPlayerList.
 * 모바일 전용 컴포넌트를 import하지 않음.
 */
export default function FormationBuilderDesktop({
  scheduleCard,
  quarters,
  setQuarters,
  addQuarter,
  currentQuarterId,
  setCurrentQuarterId,
  selectedPlayer,
  setSelectedPlayer,
  onPositionRemove,
  initialPlayers,
}: FormationBuilderDesktopProps) {
  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 w-full max-w-screen-xl justify-center lg:items-stretch 2xl:max-w-none">
      <div className="w-full lg:flex-1 2xl:w-225 2xl:flex-none flex flex-col gap-4 shrink-0 transition-all duration-300">
        {scheduleCard}

        <FormationControls
          currentQuarterId={currentQuarterId}
          setCurrentQuarterId={setCurrentQuarterId}
          quarters={quarters}
          addQuarter={addQuarter}
        />

        <FormationBoardList
          quarters={quarters}
          selectedPlayer={selectedPlayer}
          setQuarters={setQuarters}
          onPositionRemove={onPositionRemove}
          currentQuarterId={currentQuarterId}
          setCurrentQuarterId={setCurrentQuarterId}
        />
      </div>

      <FormationPlayerList
        players={initialPlayers}
        currentQuarterLineups={quarters.map((q) => q.lineup || {})}
        selectedPlayer={selectedPlayer}
        onSelectPlayer={setSelectedPlayer}
        onAddPlayer={() => {}}
        onRemovePlayer={() => {}}
        activePosition={null}
      />
    </div>
  );
}
