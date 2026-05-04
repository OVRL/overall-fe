"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useModalStore } from "@/contexts/ModalContext";
import { useBridge } from "@/hooks/bridge/useBridge";
import { isNativeLiquidBottomNavShellPath } from "@/lib/native/nativeLiquidBottomNavShellPaths";

/**
 * `useModalStore`에 모달이 있고 리퀴드 탭 셸 경로일 때만, 인앱 WebView에
 * 하단 네브바 슬라이드아웃을 지시한다. PC/모바일 브라우저에서는 전송하지 않는다.
 */
function useNativeLiquidNavModalOverlayBridge() {
  const modalsCount = useModalStore((s) => s.modals.length);
  const pathname = usePathname() ?? "";
  const { isNativeApp, sendToNative } = useBridge();
  const lastPayloadHiddenRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isNativeApp) {
      lastPayloadHiddenRef.current = null;
      return;
    }
    const onShell = isNativeLiquidBottomNavShellPath(pathname);
    const hidden = modalsCount > 0 && onShell;
    if (lastPayloadHiddenRef.current === hidden) return;
    lastPayloadHiddenRef.current = hidden;
    sendToNative({
      type: "SET_NATIVE_LIQUID_NAV_MODAL_OVERLAY",
      payload: { hidden },
    });
  }, [isNativeApp, modalsCount, pathname, sendToNative]);
}

/**
 * 루트에 마운트해 모달·경로·인앱 조건에 맞게 네이티브 하단 네브바 오버레이를 동기화한다.
 */
export function NativeLiquidNavModalOverlayBridge() {
  useNativeLiquidNavModalOverlayBridge();
  return null;
}
