"use client";

import React from "react";
import QuarterFormationBoard from "./QuarterFormationBoard";
import { QuarterData, Player } from "@/types/formation";

interface FormationBoardListProps {
  quarters: QuarterData[];
  selectedPlayer: Player | null; // Added prop
  setQuarters: React.Dispatch<React.SetStateAction<QuarterData[]>>;
  onPositionRemove: (quarterId: number, index: number) => void;
}

const FormationBoardList: React.FC<FormationBoardListProps> = ({
  quarters,
  selectedPlayer, // Extracted
  setQuarters,
  onPositionRemove,
}) => {
  return (
    <div className="flex-1 w-full overflow-x-auto">
      {/* 그리드: 모바일 1열, quarter가 2개 이상일 때 md 이상에서 2열 */}
      <div
        className={`grid w-full gap-3 grid-cols-1 ${
          quarters.length > 1 ? "md:grid-cols-2" : ""
        }`}
      >
        {quarters.map((quarter) => (
          <QuarterFormationBoard
            key={quarter.id}
            quarter={quarter}
            activePosition={null}
            selectedPlayer={selectedPlayer} // Passed
            onPositionSelect={() => {}}
            onPositionRemove={onPositionRemove}
            onFormationChange={(fmt) => {
              setQuarters((prev) =>
                prev.map((q) =>
                  q.id === quarter.id ? { ...q, formation: fmt } : q,
                ),
              );
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FormationBoardList;
