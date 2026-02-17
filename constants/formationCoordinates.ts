import { Position } from "@/types/position";
import { FIELD_HEIGHT, FIELD_WIDTH } from "@/components/formation/ObjectField";

/**
 * 절대적인 경기장 위 좌표 (0.0 ~ 1.0)
 * 기존 모바일 크롭(cropX=0.24, width=0.52) 기준 좌표를 역산하여 정의함.
 */
export const BASE_FIELD_COORDINATES: Partial<
  Record<Position, { top: number; left: number }>
> = {
  ST: { top: 0.2044, left: 0.5026 },
  LST: { top: 0.2044, left: 0.35 }, // 추정치
  RST: { top: 0.2044, left: 0.65 }, // 추정치
  CF: { top: 0.25, left: 0.5026 },
  LW: { top: 0.2392, left: 0.2 }, // 더 넓게 조정
  RW: { top: 0.2392, left: 0.8 }, // 더 넓게 조정
  RS: { top: 0.2044, left: 0.65 },
  LS: { top: 0.2044, left: 0.35 },
  RF: { top: 0.25, left: 0.65 },
  LF: { top: 0.25, left: 0.35 },

  CAM: { top: 0.3523, left: 0.5026 },
  LAM: { top: 0.3523, left: 0.3 },
  RAM: { top: 0.3523, left: 0.7 },
  LM: { top: 0.4828, left: 0.2 }, // 더 넓게 조정
  CM: { top: 0.4828, left: 0.5026 },
  LCM: { top: 0.4828, left: 0.35 },
  RCM: { top: 0.4828, left: 0.65 },
  RM: { top: 0.4828, left: 0.8 }, // 더 넓게 조정
  CDM: { top: 0.6133, left: 0.5026 },
  LDM: { top: 0.6133, left: 0.35 },
  RDM: { top: 0.6133, left: 0.65 },

  LB: { top: 0.6829, left: 0.2 }, // 더 넓게 조정
  LCB: { top: 0.7525, left: 0.4 }, // 조정됨
  CB: { top: 0.7525, left: 0.5026 },
  RCB: { top: 0.7525, left: 0.6 }, // 조정됨
  RB: { top: 0.6829, left: 0.8 }, // 더 넓게 조정
  LWB: { top: 0.65, left: 0.15 },
  RWB: { top: 0.65, left: 0.85 },
  SW: { top: 0.8, left: 0.5026 },

  GK: { top: 0.89, left: 0.5026 },
} as const;

export const MOBILE_CROP = { x: 0, y: 0, width: 1.0, height: 1.0 };
export const DESKTOP_CROP = { x: 0, y: 0, width: 1.0, height: 1.0 };

export const getRelativePosition = (
  fieldPos: { top: number; left: number },
  isDesktop: boolean,
) => {
  const crop = isDesktop ? DESKTOP_CROP : MOBILE_CROP;
  const relativeLeft = (fieldPos.left - crop.x) / crop.width;
  const relativeTop = (fieldPos.top - crop.y) / crop.height;
  return {
    left: `${relativeLeft * 100}%`,
    top: `${relativeTop * 100}%`,
  };
};

export const getFieldAspectRatio = (isDesktop: boolean) => {
  const crop = isDesktop ? DESKTOP_CROP : MOBILE_CROP;
  return (crop.width * FIELD_WIDTH) / (crop.height * FIELD_HEIGHT);
};
