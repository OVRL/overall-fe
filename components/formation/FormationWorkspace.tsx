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
  children,
}) => {
  return (
    <FormationLayout
      sidebar={
        <div className="h-full flex flex-col">
          <FormationPlayerList
            players={playersWithCounts}
            // For now, simplify this or pass appropriate lineups.
            // Since we are moving away from single quarter focus, we might need adjustments here.
            // But preserving existing prop structure for now where applicable.
            currentQuarterLineups={quarters.map((q) => q.lineup || {})}
            selectedPlayer={selectedListPlayer}
            onSelectPlayer={setSelectedListPlayer}
            isLineupFull={isLineupFull}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={onRemovePlayer}
          />
        </div>
      }
    >
      {/* 1. Controls */}
      {children}

      <div className="flex-1 w-full overflow-x-auto">
        <div
          className="grid w-full gap-3"
          style={{
            gridTemplateColumns:
              quarters.length === 1 ? "1fr" : "repeat(2, minmax(0, 1fr))",
          }}
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
                <QuarterFormationBoard quarter={quarter} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </FormationLayout>
  );
};

export default FormationWorkspace;
