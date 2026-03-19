import React from "react";
import QuarterFormationBoard from "./QuarterFormationBoard";
import { QuarterData, Player, FormationType } from "@/types/formation";

/** 포지션 선택 시 콜백 인자 (QuarterFormationBoard와 동일) */
export type PositionSelectPayload =
  | { quarterId: number; index: number; role: string }
  | null;

interface FormationBoardListProps {
  quarters: QuarterData[];
  selectedPlayer: Player | null;
  setQuarters: React.Dispatch<React.SetStateAction<QuarterData[]>>;
  onPositionRemove: (quarterId: number, index: number) => void;
  currentQuarterId: number | null;
  setCurrentQuarterId: (id: number | null) => void;
  /** 포지션 클릭 시 호출 (선택 시 포지션 지정 모달 등에 사용) */
  onPositionSelect?: (pos: PositionSelectPayload) => void;
}

const FormationBoardList: React.FC<FormationBoardListProps> = ({
  quarters,
  selectedPlayer,
  setQuarters,
  onPositionRemove,
  currentQuarterId,
  onPositionSelect,
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
            selectedPlayer={selectedPlayer}
            isSelected={currentQuarterId === quarter.id}
            hasSelection={currentQuarterId !== null}
            onPositionSelect={onPositionSelect ?? (() => {})}
            onPositionRemove={onPositionRemove}
            onFormationChange={(fmt) => {
              setQuarters((prev) =>
                prev.map((q) =>
                  q.id === quarter.id
                    ? {
                        ...q,
                        formation: fmt as FormationType,
                      }
                    : q,
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
