"use client";

import { useNativeLiquidNavFabRegisterGameBridge } from "@/hooks/bridge/useNativeLiquidNavFabRegisterGameBridge";

/**
 * 루트에서 마운트되어 인앱 네이티브 FAB → 경기 등록 모달 브리지를 활성화한다.
 */
export function NativeLiquidNavFabRegisterGameBridge() {
  useNativeLiquidNavFabRegisterGameBridge();
  return null;
}
