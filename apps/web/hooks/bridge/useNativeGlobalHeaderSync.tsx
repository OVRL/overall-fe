"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useBridge } from "@/hooks/bridge/useBridge";
import {
  clearNativeGlobalHeaderPressHandlers,
  setNativeGlobalHeaderPressHandlers,
} from "@/lib/native/nativeGlobalHeaderPressBridge";

export type NativeGlobalHeaderSyncConfig = {
  showHamburger: boolean;
  onLogoPress?: () => void;
  onHamburgerPress?: () => void;
};

export type NativeGlobalHeaderBridgePick = Pick<
  ReturnType<typeof useBridge>,
  "isNativeApp" | "sendToNative"
>;

/**
 * 인앱에서 웹 `Header variant="global"` 상단 행을 네이티브로 대체할 때 동기화한다.
 */
export function useNativeGlobalHeaderSync(
  config: NativeGlobalHeaderSyncConfig | null,
  bridge: NativeGlobalHeaderBridgePick,
) {
  const { isNativeApp, sendToNative } = bridge;
  const logoRef = useRef<(() => void) | undefined>(undefined);
  const hamburgerRef = useRef<(() => void) | undefined>(undefined);

  /** 렌더 중 ref 갱신 금지 — 페인트 직전에 최신 콜백 동기화 */
  useLayoutEffect(() => {
    if (!isNativeApp || config == null) {
      logoRef.current = undefined;
      hamburgerRef.current = undefined;
      return;
    }
    logoRef.current = config.onLogoPress;
    hamburgerRef.current = config.onHamburgerPress;
  }, [isNativeApp, config]);

  useEffect(() => {
    if (!isNativeApp || config == null) {
      return;
    }

    setNativeGlobalHeaderPressHandlers({
      onLogo: () => logoRef.current?.(),
      onHamburger: () => hamburgerRef.current?.(),
    });

    sendToNative({
      type: "SET_NATIVE_GLOBAL_HEADER",
      payload: {
        visible: true,
        showHamburger: config.showHamburger,
      },
    });

    return () => {
      clearNativeGlobalHeaderPressHandlers();
      sendToNative({
        type: "SET_NATIVE_GLOBAL_HEADER",
        payload: { visible: false },
      });
    };
  }, [isNativeApp, sendToNative, config, config?.showHamburger]);
}
