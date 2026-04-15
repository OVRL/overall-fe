import React from "react";
import QuarterFormationBoard from "./QuarterFormationBoard";
import { QuarterData, Player, FormationType } from "@/types/formation";

/** 포지션 선택 시 콜백 인자 (QuarterFormationBoard와 동일) */
export type PositionSelectPayload =
  | { quarterId: number; index: number; role: string }
  | null;

interface FormationBoardListProps {
  quarters: QuarterData[];
  /** 내전 A/B 라인업 탭일 때만 — 포메이션 드롭다운이 해당 팀의 `formationTeamA|B`를 바꾼다. */
  inHouseBoardSubTeam?: "A" | "B";
  selectedPlayer: Player | null;
  setQuarters: React.Dispatch<React.SetStateAction<QuarterData[]>>;
  onPositionRemove: (quarterId: number, index: number) => void;
  currentQuarterId: number | null;
  setCurrentQuarterId: (id: number | null) => void;
  /** 포지션 클릭 시 호출 (선택 시 포지션 지정 모달 등에 사용) */
  onPositionSelect?: (pos: PositionSelectPayload) => void;
  /** 선택된 선수를 해당 포지션에 배치 */
  onPlaceSelectedPlayer?: (quarterId: number, index: number, label: string) => void;
  /**
   * 포메이션 변경 의도 — 있으면 확인 모달 등 상위 플로우로 위임.
   * 없으면 기존처럼 `setQuarters`로 즉시 반영(InHouseMatchPanel 등).
   */
  onFormationChangeIntent?: (
    quarterId: number,
    nextFormation: FormationType,
  ) => void;
  showBoardHeader?: boolean;
  boardClassName?: string;
}

const FormationBoardList: React.FC<FormationBoardListProps> = ({
  quarters,
  inHouseBoardSubTeam,
  selectedPlayer,
  setQuarters,
  onPositionRemove,
  currentQuarterId,
  onPositionSelect,
  onPlaceSelectedPlayer,
  onFormationChangeIntent,
  showBoardHeader = true,
  boardClassName,
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
            onPlaceSelectedPlayer={onPlaceSelectedPlayer}
            showHeader={showBoardHeader}
            boardClassName={boardClassName}
            onFormationChange={(fmt) => {
              const f = fmt as FormationType;
              if (onFormationChangeIntent) {
                onFormationChangeIntent(quarter.id, f);
                return;
              }
              setQuarters((prev) =>
                prev.map((q) => {
                  if (q.id !== quarter.id) return q;
                  if (q.type === "IN_HOUSE" && inHouseBoardSubTeam != null) {
                    if (inHouseBoardSubTeam === "A") {
                      return { ...q, formationTeamA: f, formation: f };
                    }
                    return { ...q, formationTeamB: f, formation: f };
                  }
                  return { ...q, formation: f };
                }),
              );
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FormationBoardList;
