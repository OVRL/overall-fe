import { Position } from "@/types/position";
import { FIELD_HEIGHT, FIELD_WIDTH } from "@/components/formation/ObjectField";

/**
 * 절대적인 경기장 위 좌표 (0.0 ~ 1.0)
 * 기존 모바일 크롭(cropX=0.24, width=0.52) 기준 좌표를 역산하여 정의함.
 */
export const BASE_FIELD_COORDINATES: Partial<
  Record<Position, { top: number; left: number }>
> = {
  ST: { top: 0.0844, left: 0.5026 },
  LST: { top: 0.2044, left: 0.35 },
  RST: { top: 0.2044, left: 0.65 },
  CF: { top: 0.25, left: 0.5026 },
  LW: { top: 0.1592, left: 0.2 },
  RW: { top: 0.1592, left: 0.8 },
  RS: { top: 0.15, left: 0.65 },
  LS: { top: 0.15, left: 0.35 },
  RF: { top: 0.25, left: 0.65 },
  LF: { top: 0.25, left: 0.35 },

  CAM: { top: 0.3023, left: 0.5026 },
  LAM: { top: 0.3023, left: 0.3 },
  RAM: { top: 0.3023, left: 0.7 },
  LM: { top: 0.3, left: 0.2 },
  CM: { top: 0.3, left: 0.5026 },
  LCM: { top: 0.3, left: 0.4 },
  RCM: { top: 0.3, left: 0.6 },
  RM: { top: 0.3, left: 0.8 },
  CDM: { top: 0.4728, left: 0.5 },
  LDM: { top: 0.4433, left: 0.3 },
  RDM: { top: 0.4433, left: 0.7 },

  LB: { top: 0.6029, left: 0.15 },
  LCB: { top: 0.6725, left: 0.38 },
  CB: { top: 0.6725, left: 0.5026 },
  RCB: { top: 0.6725, left: 0.62 },
  RB: { top: 0.6029, left: 0.85 },
  LWB: { top: 0.65, left: 0.15 },
  RWB: { top: 0.65, left: 0.85 },
  SW: { top: 0.8, left: 0.5026 },

  GK: { top: 0.87, left: 0.5026 },
} as const;

export const FORMATION_COORDINATE_OVERRIDES: Record<
  string,
  Partial<Record<Position, { top: number; left: number }>>
> = {
  "4-4-2": {
    LM: { top: 0.35, left: 0.15 },
    RM: { top: 0.35, left: 0.85 },
    LCM: { top: 0.39, left: 0.4 },
    RCM: { top: 0.39, left: 0.6 },
  },
  "4-2-3-1": {
    CAM: { top: 0.28, left: 0.5026 },
  },
  "4-3-3": {
    LCM: { top: 0.33, left: 0.33 },
    RCM: { top: 0.33, left: 0.67 },
  },
  "4-3-2-1": {
    LCM: { top: 0.25, left: 0.33 },
    RCM: { top: 0.25, left: 0.67 },
    LM: { top: 0.3, left: 0.15 },
    RM: { top: 0.3, left: 0.85 },
    CDM: { top: 0.43, left: 0.5 },
  },
  "4-2-2-2": {
    LAM: { top: 0.3023, left: 0.2 },
    RAM: { top: 0.3023, left: 0.8 },
    LM: { top: 0.3, left: 0.2 },
    RM: { top: 0.3, left: 0.8 },
    LDM: { top: 0.47, left: 0.35 },
    RDM: { top: 0.47, left: 0.65 },
  },
  "3-5-2": {
    LWB: { top: 0.48, left: 0.15 },
    RWB: { top: 0.48, left: 0.85 },
    LDM: { top: 0.4433, left: 0.35 },
    RDM: { top: 0.4433, left: 0.65 },
    RCB: { top: 0.6725, left: 0.7 },
    LCB: { top: 0.6725, left: 0.3 },
  },
  "3-4-3": {
    LCM: { top: 0.45, left: 0.4 },
    RCM: { top: 0.45, left: 0.6 },
    LM: { top: 0.45, left: 0.2 },
    RM: { top: 0.45, left: 0.8 },
    LW: { top: 0.2, left: 0.2 },
    RW: { top: 0.2, left: 0.8 },
    RCB: { top: 0.6725, left: 0.7 },
    LCB: { top: 0.6725, left: 0.3 },
  },
  "3-4-1-2": {
    LCM: { top: 0.45, left: 0.4 },
    RCM: { top: 0.45, left: 0.6 },
    LM: { top: 0.45, left: 0.2 },
    RM: { top: 0.45, left: 0.8 },
    LW: { top: 0.2, left: 0.2 },
    RW: { top: 0.2, left: 0.8 },
    RCB: { top: 0.6725, left: 0.7 },
    LCB: { top: 0.6725, left: 0.3 },
  },
  "5-3-2": {
    LWB: { top: 0.48, left: 0.15 },
    RWB: { top: 0.48, left: 0.85 },
    LCM: { top: 0.4433, left: 0.35 },
    RCM: { top: 0.4433, left: 0.65 },
    RCB: { top: 0.6725, left: 0.7 },
    LCB: { top: 0.6725, left: 0.3 },
    CM: { top: 0.37, left: 0.5 },
    RS: { top: 0.15, left: 0.65 },
    LS: { top: 0.15, left: 0.35 },
  },
  "5-4-1": {
    LWB: { top: 0.6, left: 0.15 },
    RWB: { top: 0.6, left: 0.85 },
    LCM: { top: 0.4, left: 0.35 },
    RCM: { top: 0.4, left: 0.65 },
    RCB: { top: 0.6725, left: 0.7 },
    LCB: { top: 0.6725, left: 0.3 },
    CM: { top: 0.37, left: 0.5 },
    RS: { top: 0.15, left: 0.65 },
    LS: { top: 0.15, left: 0.35 },
    LM: { top: 0.3, left: 0.2 },
    RM: { top: 0.3, left: 0.8 },
  },
  "5-2-3": {
    LWB: { top: 0.55, left: 0.15 },
    RWB: { top: 0.55, left: 0.85 },
    LCM: { top: 0.4433, left: 0.35 },
    RCM: { top: 0.4433, left: 0.65 },
    RCB: { top: 0.6725, left: 0.7 },
    LCB: { top: 0.6725, left: 0.3 },
    CM: { top: 0.37, left: 0.5 },
    RS: { top: 0.15, left: 0.65 },
    LS: { top: 0.15, left: 0.35 },
    LM: { top: 0.3, left: 0.2 },
    RM: { top: 0.3, left: 0.8 },
    LW: { top: 0.25, left: 0.2 },
    RW: { top: 0.25, left: 0.8 },
  },
} as const;

export const getFieldCoordinates = (formation: string, position: Position) => {
  const baseCoords = BASE_FIELD_COORDINATES[position];
  const overrideCoords = FORMATION_COORDINATE_OVERRIDES[formation]?.[position];
  return overrideCoords || baseCoords;
};

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
