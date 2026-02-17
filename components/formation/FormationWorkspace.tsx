import { motion, AnimatePresence } from "motion/react";
import React from "react";
import QuarterFormationBoard from "@/components/formation/QuarterFormationBoard";
import FormationLayout from "@/components/formation/layout/FormationLayout";
import FormationPlayerList from "@/components/formation/FormationPlayerList";
import { Player, QuarterData } from "@/types/formation";

interface FormationWorkspaceProps {
  quarters: QuarterData[];
  playersWithCounts: Player[];
  selectedListPlayer: Player | null;
  setSelectedListPlayer: (player: Player | null) => void;
  handleAddPlayer: (name: string) => void;
  onRemovePlayer: (playerId: number) => void;
  isLineupFull: boolean;
  activePosition: { quarterId: number; index: number; role: string } | null;
  setActivePosition: (
    pos: { quarterId: number; index: number; role: string } | null
  ) => void;
  onAssignPlayer: (player: Player) => void;
  onQuarterFormationChange?: (quarterId: number, formation: string) => void;
  children?: React.ReactNode;
}

const FormationWorkspace: React.FC<FormationWorkspaceProps> = ({
  quarters = [],
  playersWithCounts,
  selectedListPlayer,
  setSelectedListPlayer,
  handleAddPlayer,
  onRemovePlayer,
  isLineupFull,
  activePosition,
  setActivePosition,
  onAssignPlayer,
  onQuarterFormationChange,
  children,
}) => {
  return (
    <FormationLayout
      sidebar={
        <div className="h-full flex flex-col">
          <FormationPlayerList
            players={playersWithCounts}
            // 지금은 단순화하거나 적절한 라인업을 전달합니다.
            // 단일 쿼터 포커스에서 벗어나고 있으므로 조정이 필요할 수 있습니다.
            // 하지만 당장은 기존 prop 구조를 유지합니다.
            currentQuarterLineups={quarters.map((q) => q.lineup || {})}
            selectedPlayer={selectedListPlayer}
            onSelectPlayer={(player) => {
              if (activePosition) {
                onAssignPlayer(player);
              } else {
                setSelectedListPlayer(player);
              }
            }}
            isLineupFull={isLineupFull}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={onRemovePlayer}
            activePosition={activePosition}
          />
        </div>
      }
    >
      {/* 1. 컨트롤 (Controls) */}
      {children}

      <div className="flex-1 w-full overflow-x-auto">
        <div
          className={`grid w-full gap-3 grid-cols-1 ${
            quarters.length > 1 ? "md:grid-cols-2" : ""
          }`}
        >
          <AnimatePresence mode="popLayout">
            {quarters.map((quarter) => (
              <motion.div
                key={quarter.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              >
                <QuarterFormationBoard
                  quarter={quarter}
                  activePosition={activePosition}
                  onPositionSelect={setActivePosition}
                  onFormationChange={(fmt) =>
                    onQuarterFormationChange?.(quarter.id, fmt)
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </FormationLayout>
  );
};

export default FormationWorkspace;
