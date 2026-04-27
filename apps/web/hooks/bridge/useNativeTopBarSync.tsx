"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useBridge } from "@/hooks/bridge/useBridge";
import {
  clearNativeTopBarPressHandlers,
  setNativeTopBarPressHandlers,
} from "@/lib/native/nativeTopBarPressBridge";

export type NativeTopBarSyncConfig = {
  transparent?: boolean;
  title?: string | null;
  centerMatchLineupLogo?: boolean;
  showLeft: boolean;
  onLeftPress?: () => void;
  rightMode: "none" | "label";
  rightLabel?: string | null;
  onRightPress?: () => void;
  rightDisabled?: boolean;
};

export type NativeTopBarBridgePick = Pick<
  ReturnType<typeof useBridge>,
  "isNativeApp" | "sendToNative"
>;

/**
 * 인앱에서 웹 TopbarHeader 대신 네이티브 상단 바를 표시·동기화한다.
 * 콜백은 렌더마다 ref에 반영되며, 브리지 페이로드는 원시 필드 변경 시에만 재전송된다.
 * `bridge`는 호출부에서 `useBridge()` 한 번만 쓰고 넘겨 주세요(큐·플러시 인스턴스 일치).
 */
export function useNativeTopBarSync(
  config: NativeTopBarSyncConfig | null,
  bridge: NativeTopBarBridgePick,
) {
  const { isNativeApp, sendToNative } = bridge;
  const leftRef = useRef<(() => void) | undefined>(undefined);
  const rightRef = useRef<(() => void) | undefined>(undefined);

  /** 렌더 중 ref 대입 금지(린트/리액트 규칙) — 페인트 직전에 최신 콜백 동기화 */
  useLayoutEffect(() => {
    if (!isNativeApp || config == null) {
      leftRef.current = undefined;
      rightRef.current = undefined;
      return;
    }
    leftRef.current = config.onLeftPress;
    rightRef.current = config.onRightPress;
  }, [isNativeApp, config]);

  useEffect(() => {
    if (!isNativeApp || config == null) {
      return;
    }

    setNativeTopBarPressHandlers({
      onLeft: () => leftRef.current?.(),
      onRight: () => rightRef.current?.(),
    });

    sendToNative({
      type: "SET_NATIVE_TOPBAR",
      payload: {
        visible: true,
        transparent: Boolean(config.transparent),
        title: config.title ?? null,
        centerMatchLineupLogo: Boolean(config.centerMatchLineupLogo),
        showLeft: config.showLeft,
        rightMode: config.rightMode,
        rightLabel: config.rightLabel ?? null,
        rightDisabled: Boolean(config.rightDisabled),
      },
    });

    return () => {
      clearNativeTopBarPressHandlers();
      sendToNative({
        type: "SET_NATIVE_TOPBAR",
        payload: { visible: false },
      });
    };
  }, [
    isNativeApp,
    sendToNative,
    config,
    config?.transparent,
    config?.title,
    config?.centerMatchLineupLogo,
    config?.showLeft,
    config?.rightMode,
    config?.rightLabel,
    config?.rightDisabled,
  ]);
}
