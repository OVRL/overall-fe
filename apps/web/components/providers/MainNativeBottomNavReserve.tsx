"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useBridge } from "@/hooks/bridge/useBridge";
import { isNativeLiquidBottomNavShellPath } from "@/lib/native/nativeLiquidBottomNavShellPaths";
import { cn } from "@/lib/utils";

type MainNativeBottomNavReserveProps = {
  children: React.ReactNode;
  /**
   * SSR 첫 HTML: `app/(main)/layout.tsx`에서 `User-Agent`(Overall_RN) + `x-pathname`으로 계산.
   * 클라이언트에서는 `useBridge().isNativeApp`이 초기 렌더에 불안정할 수 있어,
   * 하이드레이션 전까지 이 값을 그대로 사용한다.
   */
  ssrShouldPad: boolean;
  className?: string;
};

/**
 * 인앱 WebView에서만·리퀴드 탭 셸 경로에서만 하단 네이티브 네브바 높이만큼 패딩을 둔다.
 * 모바일 브라우저·PC에서는 패딩을 넣지 않는다(`Header` 의 `hideWebGlobalChrome` 정책과 동일한 식별).
 */
export function MainNativeBottomNavReserve({
  children,
  ssrShouldPad,
  className,
}: MainNativeBottomNavReserveProps) {
  const pathname = usePathname() ?? "";
  const { isNativeApp } = useBridge();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const clientShouldPad =
    isNativeApp && isNativeLiquidBottomNavShellPath(pathname);
  const shouldPad = hydrated ? clientShouldPad : ssrShouldPad;

  return (
    <div
      className={cn(
        "flex min-h-0 w-full min-w-0 flex-1 flex-col",
        shouldPad && "pb-app-native-liquid-nav",
        className,
      )}
    >
      {children}
    </div>
  );
}
