"use client";

import ObjectField from "@/components/formation/ObjectField";
import OnboardingPositionChip from "@/components/OnboardingPositionChip";
import { Position } from "@/types/position";

interface OnboardingFormationSelectorProps {
  value: Position[];
  onChange: (positions: Position[]) => void;
  className?: string;
  disabledPositions?: Position[];
  multiSelect?: boolean;
}

/**
 * 포지션별 경기장 위 좌표 (가시 영역 crop 기준 % 값)
 */
const FORMATION_COORDINATES: Partial<
  Record<Position, { top: string; left: string }>
> = {
  ST: { top: "12%", left: "50.5%" },
  LW: { top: "16%", left: "21%" },
  RW: { top: "16%", left: "79%" },
  CAM: { top: "29%", left: "50.5%" },
  LM: { top: "44%", left: "30%" },
  CM: { top: "44%", left: "50.5%" },
  RM: { top: "44%", left: "70.5%" },
  CDM: { top: "59%", left: "50.5%" },
  LB: { top: "67%", left: "16%" },
  LCB: { top: "75%", left: "38%" },
  RCB: { top: "75%", left: "62%" },
  RB: { top: "67%", left: "84%" },
  GK: { top: "89%", left: "50.5%" },
} as const;

const OnboardingFormationSelector = ({
  value,
  onChange,
  className,
  disabledPositions = [],
  multiSelect = false,
}: OnboardingFormationSelectorProps) => {
  const handlePositionClick = (pos: Position) => {
    if (multiSelect) {
      if (value.includes(pos)) {
        onChange(value.filter((p) => p !== pos));
      } else {
        onChange([...value, pos]);
      }
    } else {
      onChange([pos]);
    }
  };
  return (
    <div className={className}>
      <div className="relative w-full rounded-3xl overflow-hidden border">
        <ObjectField
          crop={{ x: 0.24, y: 0.1, width: 0.52, height: 0.87 }}
          objectFit="cover"
          className="w-full"
        />

        <div className="absolute inset-0 pointer-events-none">
          {Object.entries(FORMATION_COORDINATES).map(([pos, coords]) => {
            const isDisabled = disabledPositions.includes(pos as Position);
            return (
              <div
                key={pos}
                className="absolute transition-all duration-300 ease-out"
                style={{
                  ...coords,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <OnboardingPositionChip
                  position={pos as Position}
                  selected={value.includes(pos as Position)}
                  disabled={isDisabled}
                  onClick={() =>
                    !isDisabled && handlePositionClick(pos as Position)
                  }
                  className="pointer-events-auto"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFormationSelector;
