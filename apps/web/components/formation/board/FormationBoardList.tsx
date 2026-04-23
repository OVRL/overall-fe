import React from "react";
import { cn } from "@/lib/utils";
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
  /**
   * `formationDesktop`: 포메이션 경기 빌더(lg+)에서 좌측 영역 높이에 맞춰 세로 스크롤만 사용(2열 그리드).
   * 그 외 패널은 기본값 유지.
   */
  scrollLayout?: "default" | "formationDesktop";
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
  scrollLayout = "default",
}) => {
  const isFormationDesktop = scrollLayout === "formationDesktop";

  return (
    <div
      className={cn(
        "w-full",
        isFormationDesktop
          ? "flex min-h-0 flex-1 flex-col overflow-hidden"
          : "flex-1 overflow-x-auto",
      )}
    >
      {/* 그리드: 기본은 md+ 2열 / formationDesktop은 lg+ 2열(데스크 빌더와 동일 브레이크포인트) */}
      <div
        className={cn(
          "grid w-full gap-3 grid-cols-1",
          quarters.length > 1 &&
            (isFormationDesktop ? "lg:grid-cols-2" : "md:grid-cols-2"),
          isFormationDesktop &&
            "min-h-0 flex-1 overflow-y-auto overscroll-y-contain overflow-x-hidden scrollbar-hide pr-1",
        )}
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
