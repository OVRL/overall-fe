"use client";

import React from "react";
import QuarterFormationBoard from "./QuarterFormationBoard";
import { QuarterData } from "@/types/formation";

interface FormationBoardListProps {
  quarters: QuarterData[];
  setQuarters: React.Dispatch<React.SetStateAction<QuarterData[]>>;
}

const FormationBoardList: React.FC<FormationBoardListProps> = ({
  quarters,
  setQuarters,
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
            onPositionSelect={() => {}}
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
