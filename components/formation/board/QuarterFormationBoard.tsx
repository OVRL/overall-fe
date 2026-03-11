import DroppableSlot from "./DroppableSlot";
import Dropdown from "../../ui/Dropdown";
import ObjectField from "../../ui/ObjectField";
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
  isSelected: boolean;
  hasSelection: boolean;
  onPositionSelect: (
    pos: { quarterId: number; index: number; role: string } | null,
  ) => void;
  onPositionRemove: (quarterId: number, index: number) => void;
  /** 모바일: 선수 선택 후 빈 포지션 탭 시 해당 슬롯에 배치 */
  onPlaceSelectedPlayer?: (quarterId: number, index: number) => void;
  onFormationChange?: (formation: string) => void;
}

const QuarterFormationBoard: React.FC<QuarterFormationBoardProps> = ({
  quarter,
  activePosition,
  selectedPlayer,
  isSelected,
  hasSelection,
  onPositionSelect,
  onPositionRemove,
  onPlaceSelectedPlayer,
  onFormationChange,
}) => {
  const formationPositions = FORMATION_POSITIONS[quarter.formation] || [];
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <article
      id={`quarter-board-${quarter.id}`}
      data-quarter-id={quarter.id}
      aria-label={`${quarter.id}쿼터 포메이션 보드`}
      className={`flex flex-col gap-3 p-3 rounded-xl bg-surface-card h-full transition-all duration-300 ease-in-out border-2 ${
        !hasSelection
          ? "border-border-card opacity-100"
          : isSelected
          ? "border-Fill_AccentPrimary opacity-100 shadow-md"
          : "border-border-card opacity-60"
      }`}
    >
      <div className="flex justify-between items-center">
        <span className="font-bold text-Label-Primary w-9.75 h-4.75 flex items-center justify-center">
          {quarter.id}Q
        </span>
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
                  className="absolute pointer-events-auto flex items-center justify-center w-12 h-12"
                  style={{
                    left: styleCoords.left,
                    top: styleCoords.top,
                    marginLeft: "-1.5rem",
                    marginTop: "-1.5rem",
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
                    onPositionSelect={
                      onPlaceSelectedPlayer && selectedPlayer && !player
                        ? () => onPlaceSelectedPlayer(quarter.id, index)
                        : () =>
                            onPositionSelect(
                              isActive
                                ? null
                                : {
                                    quarterId: quarter.id,
                                    index,
                                    role: position,
                                  },
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
