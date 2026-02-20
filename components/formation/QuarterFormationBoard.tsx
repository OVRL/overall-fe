import DroppableSlot from "./DroppableSlot";
import QuarterButton from "../ui/QuarterButton";
import Dropdown from "../ui/Dropdown";
import ObjectField from "./ObjectField";
import { QuarterData, Player } from "@/types/formation";
import { FORMATION_OPTIONS, FORMATION_POSITIONS } from "@/constants/formations";
import { Position } from "@/types/position";
import {
  DESKTOP_CROP,
  MOBILE_CROP,
  getRelativePosition,
  getFieldCoordinates,
} from "@/constants/formationCoordinates";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { motion } from "motion/react";

interface QuarterFormationBoardProps {
  quarter: QuarterData;
  activePosition: { quarterId: number; index: number; role: string } | null;
  selectedPlayer: Player | null;
  onPositionSelect: (
    pos: { quarterId: number; index: number; role: string } | null,
  ) => void;
  onPositionRemove: (quarterId: number, index: number) => void;
  onFormationChange?: (formation: string) => void;
}

const QuarterFormationBoard: React.FC<QuarterFormationBoardProps> = ({
  quarter,
  activePosition,
  selectedPlayer,
  onPositionSelect,
  onPositionRemove,
  onFormationChange,
}) => {
  const formationPositions = FORMATION_POSITIONS[quarter.formation] || [];
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <article
      aria-label={`${quarter.id}쿼터 포메이션 보드`}
      className="flex flex-col gap-3 p-3 rounded-xl border border-border-card shadow-card bg-surface-card h-full"
    >
      <div className="flex justify-between items-center">
        <QuarterButton variant="default" size="sm">
          {quarter.id}Q
        </QuarterButton>
        <Dropdown
          options={FORMATION_OPTIONS}
          value={quarter.formation}
          onChange={(val) => onFormationChange?.(val)}
          placeholder="포메이션"
        />
      </div>
      <div className="relative w-full rounded-lg overflow-hidden">
        <ObjectField
          type="full"
          className="w-full"
          crop={isDesktop ? DESKTOP_CROP : MOBILE_CROP}
          autoAspect={true}
        >
          <div className="absolute inset-0 pointer-events-none">
            {formationPositions.map((posKey, index) => {
              const position = posKey as Position;
              const fieldCoords = getFieldCoordinates(
                quarter.formation,
                position,
              );

              if (!fieldCoords) return null;

              const styleCoords = getRelativePosition(fieldCoords, isDesktop);

              const player = quarter.lineup?.[index] || null;
              const isActive =
                activePosition?.quarterId === quarter.id &&
                activePosition?.index === index;

              return (
                <motion.div
                  key={`${quarter.id}-${index}-${position}`}
                  layoutId={`${quarter.id}-${index}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  style={{
                    left: styleCoords.left,
                    top: styleCoords.top,
                  }}
                  initial={false}
                  animate={{
                    left: styleCoords.left,
                    top: styleCoords.top,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <DroppableSlot
                    quarterId={quarter.id}
                    index={index}
                    positionName={position}
                    player={player}
                    selectedPlayer={selectedPlayer}
                    isActive={isActive}
                    onPositionSelect={() =>
                      onPositionSelect(
                        isActive
                          ? null
                          : { quarterId: quarter.id, index, role: position },
                      )
                    }
                    onPlayerRemove={() => onPositionRemove(quarter.id, index)}
                  />
                </motion.div>
              );
            })}
          </div>
        </ObjectField>
      </div>
    </article>
  );
};

export default QuarterFormationBoard;
