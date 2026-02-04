"use client";

import ObjectField, {
  FIELD_HEIGHT,
  FIELD_WIDTH,
} from "@/components/formation/ObjectField";
import { cn } from "@/lib/utils";
import OnboardingPositionChip from "@/components/OnboardingPositionChip";
import { Position } from "@/types/position";

interface OnboardingFormationSelectorProps {
  value: Position[];
  onChange: (positions: Position[]) => void;
  className?: string;
  disabledPositions?: Position[];
  multiSelect?: boolean;
}

import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * 절대적인 경기장 위 좌표 (0.0 ~ 1.0)
 * 기존 모바일 크롭(cropX=0.24, width=0.52) 기준 좌표를 역산하여 정의함.
 */
const BASE_FIELD_COORDINATES: Partial<
  Record<Position, { top: number; left: number }>
> = {
  ST: { top: 0.2044, left: 0.5026 },
  LW: { top: 0.2392, left: 0.3492 },
  RW: { top: 0.2392, left: 0.6508 },
  CAM: { top: 0.3523, left: 0.5026 },
  LM: { top: 0.4828, left: 0.396 },
  CM: { top: 0.4828, left: 0.5026 },
  RM: { top: 0.4828, left: 0.6066 },
  CDM: { top: 0.6133, left: 0.5026 },
  LB: { top: 0.6829, left: 0.3232 },
  LCB: { top: 0.7525, left: 0.4376 },
  RCB: { top: 0.7525, left: 0.5624 },
  RB: { top: 0.6829, left: 0.6768 },
  GK: { top: 0.8743, left: 0.5026 },
} as const;

const MOBILE_CROP = { x: 0.24, y: 0.1, width: 0.52, height: 0.87 };
const DESKTOP_CROP = { x: 0, y: 0.1, width: 1.0, height: 0.87 };

const OnboardingFormationSelector = ({
  value,
  onChange,
  className,
  disabledPositions = [],
  multiSelect = false,
}: OnboardingFormationSelectorProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const currentCrop = isDesktop ? DESKTOP_CROP : MOBILE_CROP;

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

  const getRelativePosition = (
    fieldPos: { top: number; left: number },
    crop: typeof MOBILE_CROP,
  ) => {
    const relativeLeft = (fieldPos.left - crop.x) / crop.width;
    const relativeTop = (fieldPos.top - crop.y) / crop.height;
    return {
      left: `${relativeLeft * 100}%`,
      top: `${relativeTop * 100}%`,
    };
  };

  const aspectRatio =
    (currentCrop.width * FIELD_WIDTH) / (currentCrop.height * FIELD_HEIGHT);

  return (
    <div className={cn("relative", className)} style={{ aspectRatio }}>
      <div className="relative w-full h-full rounded-3xl overflow-hidden border border-transparent bg-card-bg">
        <ObjectField
          crop={currentCrop}
          autoAspect={false}
          className={cn("w-full", isDesktop ? "h-109" : "h-full")}
        >
          {" "}
          <div className="absolute inset-0 pointer-events-none  h-9/10 top-0">
            {Object.entries(BASE_FIELD_COORDINATES).map(
              ([pos, fieldCoords]) => {
                const isDisabled = disabledPositions.includes(pos as Position);
                const styleCoords = getRelativePosition(
                  fieldCoords,
                  currentCrop,
                );

                return (
                  <div
                    key={pos}
                    className="absolute transition-all duration-300 ease-out"
                    style={{
                      ...styleCoords,
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
              },
            )}
          </div>
        </ObjectField>
      </div>
    </div>
  );
};

export default OnboardingFormationSelector;
