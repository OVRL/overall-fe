"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import useModal from "@/hooks/useModal";
import { useBridge } from "@/hooks/bridge/useBridge";
import {
  clearNativeLiquidNavFabPressHandlers,
  setNativeLiquidNavFabPressHandlers,
} from "@/lib/native/nativeLiquidNavFabPressBridge";

/**
 * 인앱에서 네이티브 하단 FAB(+)로부터 오는 postMessage에 대응해,
 * 웹 헤더의 `RegisterGameButton`과 동일하게 REGISTER_GAME 모달을 연다.
 */
export function useNativeLiquidNavFabRegisterGameBridge() {
  const { isNativeApp } = useBridge();
  const { openModal } = useModal("REGISTER_GAME");
  const openRef = useRef(openModal);

  useLayoutEffect(() => {
    openRef.current = openModal;
  }, [openModal]);

  useEffect(() => {
    if (!isNativeApp) return;

    setNativeLiquidNavFabPressHandlers({
      onPress: () => openRef.current({}),
    });

    return () => {
      clearNativeLiquidNavFabPressHandlers();
    };
  }, [isNativeApp]);
}
