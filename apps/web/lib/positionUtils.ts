import type { MainPosition } from "@/types/position";

/** 포지션 역할(세부) → 메인 포지션(FW/MF/DF/GK) 매핑 */
const POSITION_TO_MAIN: Record<string, MainPosition> = {
  ST: "FW",
  CF: "FW",
  RW: "FW",
  LW: "FW",
  RF: "FW",
  LF: "FW",
  RS: "FW",
  LS: "FW",
  CAM: "MF",
  CM: "MF",
  CDM: "MF",
  RM: "MF",
  LM: "MF",
  LCM: "MF",
  RCM: "MF",
  LDM: "MF",
  RDM: "MF",
  RAM: "MF",
  LAM: "MF",
  RCAM: "MF",
  LCAM: "MF",
  CB: "DF",
  LB: "DF",
  RB: "DF",
  LWB: "DF",
  RWB: "DF",
  SW: "DF",
  LCB: "DF",
  RCB: "DF",
  GK: "GK",
};

/**
 * 포지션 역할 문자열을 메인 포지션(탭 라벨)으로 변환.
 * @returns "FW" | "MF" | "DF" | "GK" | "전체" (매핑 없으면 "전체")
 */
export function getMainPositionFromRole(role: string): MainPosition | "전체" {
  // 경기 용병 행 — `constants/position`의 POSITION_CATEGORY_MAP(용병→MF)과 동일
  if (role === "용병") return "MF";
  const main = POSITION_TO_MAIN[role.toUpperCase()];
  return main ?? "전체";
}
