import QuarterButton from "../ui/QuarterButton";
import Dropdown from "../ui/Dropdown";
import ObjectField from "./ObjectField";
import { QuarterData } from "@/types/formation";
import { FORMATION_OPTIONS, FORMATION_POSITIONS } from "@/constants/formations";
import { Position } from "@/types/position";
import {
  BASE_FIELD_COORDINATES,
  DESKTOP_CROP,
  MOBILE_CROP,
  getRelativePosition,
} from "@/constants/formationCoordinates";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface QuarterFormationBoardProps {
  quarter: QuarterData;
  activePosition: { quarterId: number; index: number; role: string } | null;
  onPositionSelect: (
    pos: { quarterId: number; index: number; role: string } | null,
  ) => void;
  onFormationChange?: (formation: string) => void; // Optional for now
}

const QuarterFormationBoard: React.FC<QuarterFormationBoardProps> = ({
  quarter,
  activePosition,
  onPositionSelect,
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
      <div className="relative w-full rounded-lg overflow-hidden border border-border-card bg-card-bg">
        <ObjectField
          type="full"
          className="w-full"
          crop={isDesktop ? DESKTOP_CROP : MOBILE_CROP}
          autoAspect={true}
        >
          <div className="absolute inset-0 pointer-events-none">
            {formationPositions.map((posKey, index) => {
              const position = posKey as Position;
              const fieldCoords = BASE_FIELD_COORDINATES[position];

              if (!fieldCoords) return null;

              const styleCoords = getRelativePosition(fieldCoords, isDesktop);

              const player = quarter.lineup?.[index];
              const isActive =
                activePosition?.quarterId === quarter.id &&
                activePosition?.index === index;

              return (
                <motion.div
                  key={`${quarter.id}-${index}-${position}`} // 애니메이션을 위한 고유 키
                  layoutId={`${quarter.id}-${index}`} // 포지션 변경 시 부드러운 전환을 위해 layoutId 시도?
                  // 사실, 포지션 이름이 바뀌면 일관된 키로 layout을 잡기가 까다로울 수 있음.
                  // 새로운 위치로 "이동"하는 것을 원한다면 index를 안정적인 키 부분으로 사용해야 할까?
                  // 포메이션은 항상 11명이므로, 인덱스 0(GK)은 새로운 GK 위치로 이동함.
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
                  <QuarterButton
                    variant={isActive ? "selected" : "assistive"}
                    size="sm"
                    className={cn(
                      "shadow-lg transition-transform hover:scale-110",
                      player ? "bg-surface-primary" : "bg-surface-tertiary/80",
                    )}
                    onClick={() =>
                      onPositionSelect(
                        isActive
                          ? null
                          : { quarterId: quarter.id, index, role: position },
                      )
                    }
                  >
                    {player ? (
                      <div className="flex flex-col items-center justify-center text-xs leading-tight">
                        <span className="font-bold truncate max-w-16">
                          {player.name}
                        </span>
                        {/* <span className="text-[10px] opacity-80">{position}</span> */}
                      </div>
                    ) : (
                      <span className="text-sm font-bold">{position}</span>
                    )}
                  </QuarterButton>
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
