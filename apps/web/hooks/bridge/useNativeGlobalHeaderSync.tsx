"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useBridge } from "@/hooks/bridge/useBridge";
import {
  clearNativeGlobalHeaderPressHandlers,
  setNativeGlobalHeaderPressHandlers,
} from "@/lib/native/nativeGlobalHeaderPressBridge";

export type NativeGlobalHeaderSyncConfig = {
  showTeamManagement: boolean;
  onLogoPress?: () => void;
  onTeamManagementPress?: () => void;
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
  const teamManagementRef = useRef<(() => void) | undefined>(undefined);

  /** 렌더 중 ref 갱신 금지 — 페인트 직전에 최신 콜백 동기화 */
  useLayoutEffect(() => {
    if (!isNativeApp || config == null) {
      logoRef.current = undefined;
      teamManagementRef.current = undefined;
      return;
    }
    logoRef.current = config.onLogoPress;
    teamManagementRef.current = config.onTeamManagementPress;
  }, [isNativeApp, config]);

  useEffect(() => {
    if (!isNativeApp || config == null) {
      return;
    }

    setNativeGlobalHeaderPressHandlers({
      onLogo: () => logoRef.current?.(),
      onTeamManagement: () => teamManagementRef.current?.(),
    });

    sendToNative({
      type: "SET_NATIVE_GLOBAL_HEADER",
      payload: {
        visible: true,
        showTeamManagement: config.showTeamManagement,
      },
    });

    return () => {
      clearNativeGlobalHeaderPressHandlers();
      sendToNative({
        type: "SET_NATIVE_GLOBAL_HEADER",
        payload: { visible: false },
      });
    };
  }, [isNativeApp, sendToNative, config, config?.showTeamManagement]);
}
