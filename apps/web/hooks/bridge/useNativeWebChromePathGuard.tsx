"use client";

import { useEffect } from "react";
import { useBridge } from "@/hooks/bridge/useBridge";
import {
  isMainAppShellPath,
  isSharedHeaderTopbarPath,
} from "@/lib/native/nativeWebChromePaths";

/**
 * 인앱에서 URL 이 바뀔 때, 웹에 해당 헤더가 없는 구간이면 네이티브 크롬을 끈다.
 * (전환·언마운트 타이밍으로 브리지 cleanup 이 늦는 경우 보완)
 */
export function useNativeWebChromePathGuard(pathname: string | null) {
  const { isNativeApp, sendToNative } = useBridge();

  useEffect(() => {
    if (!isNativeApp) return;
    if (isMainAppShellPath(pathname)) return;
    sendToNative({
      type: "SET_NATIVE_GLOBAL_HEADER",
      payload: { visible: false },
    });
  }, [isNativeApp, pathname, sendToNative]);

  useEffect(() => {
    if (!isNativeApp) return;
    if (isSharedHeaderTopbarPath(pathname)) return;
    sendToNative({
      type: "SET_NATIVE_TOPBAR",
      payload: { visible: false },
    });
  }, [isNativeApp, pathname, sendToNative]);
}
