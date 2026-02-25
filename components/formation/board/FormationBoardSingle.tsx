import React from "react";
import QuarterFormationBoard from "./QuarterFormationBoard";
import { QuarterData, Player, FormationType } from "@/types/formation";

export interface FormationBoardSingleProps {
  quarters: QuarterData[];
  currentQuarterId: number | null;
  selectedPlayer: Player | null;
  setQuarters: React.Dispatch<React.SetStateAction<QuarterData[]>>;
  onPositionRemove: (quarterId: number, index: number) => void;
  /** 모바일: 선수 선택 후 빈 포지션 탭 시 호출 */
  onPlaceSelectedPlayer?: (quarterId: number, index: number) => void;
}

/**
 * 모바일 전용: 선택된 쿼터 1개에 해당하는 보드만 렌더.
 * 쿼터 추가 시에도 보드 개수는 1개로 고정되고, 탭 전환 시 해당 쿼터 보드만 표시.
 */
const FormationBoardSingle: React.FC<FormationBoardSingleProps> = ({
  quarters,
  currentQuarterId,
  selectedPlayer,
  setQuarters,
  onPositionRemove,
  onPlaceSelectedPlayer,
}) => {
  const quarterToShow =
    quarters.find((q) => q.id === currentQuarterId) ?? quarters[0];

  if (quarters.length === 0) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-[200px] text-label-secondary">
        쿼터를 추가해 주세요.
      </div>
    );
  }

  return (
    <div className="flex-1 w-full overflow-x-auto">
      <QuarterFormationBoard
        key={quarterToShow.id}
        quarter={quarterToShow}
        activePosition={null}
        selectedPlayer={selectedPlayer}
        isSelected={true}
        hasSelection={true}
        onPositionSelect={() => {}}
        onPositionRemove={onPositionRemove}
        onPlaceSelectedPlayer={onPlaceSelectedPlayer}
        onFormationChange={(fmt) => {
          setQuarters((prev) =>
            prev.map((q) =>
              q.id === quarterToShow.id
                ? { ...q, formation: fmt as FormationType }
                : q,
            ),
          );
        }}
      />
    </div>
  );
};

export default FormationBoardSingle;
