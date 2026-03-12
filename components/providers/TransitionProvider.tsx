"use client";

import { Ssgoi } from "@ssgoi/react";
import { useMemo, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getTransitionConfig, PlatformType } from "@/lib/transitions/config";
import { useBridge } from "@/hooks/bridge/useBridge";

export const TransitionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isNativeApp } = useBridge();
  
  // 클라이언트의 경우 즉시 창 너비를 초기화하여 useEffect 내 동기적 setState 린트 에러를 방지합니다.
  const [windowWidth, setWindowWidth] = useState(() => {
    if (typeof window !== "undefined") return window.innerWidth;
    return 0;
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 환경 결정 로직
  const platform: PlatformType = useMemo(() => {
    if (isNativeApp) return "APP";
    // windowWidth 가 세팅되지 않은 기본 SSR 시점에는 0 이지만,
    // 클라이언트 마운트 이후 768 미만이면 MOBILE_WEB 간주
    if (windowWidth > 0 && windowWidth < 768) return "MOBILE_WEB";
    return "PC_WEB";
  }, [isNativeApp, windowWidth]);

  const config = useMemo(() => getTransitionConfig(platform), [platform]);

  useEffect(() => {
    console.log("Current Environment Platform:", platform);
    console.log("Current Transition Config:", config);
  }, [platform, config]);

  return (
    <Ssgoi key={platform} config={config} usePathname={usePathname}>
      <div style={{ position: "relative", minHeight: "100vh" }}>
        {children}
      </div>
    </Ssgoi>
  );
};
