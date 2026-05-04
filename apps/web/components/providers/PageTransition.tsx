"use client";

import { SsgoiTransition } from "@ssgoi/react";
import { usePathname } from "next/navigation";
import React from "react";
import { useNativeWebChromePathGuard } from "@/hooks/bridge/useNativeWebChromePathGuard";
import { useNativeWebViewClientPathnameSync } from "@/hooks/bridge/useNativeWebViewClientPathnameSync";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useNativeWebChromePathGuard(pathname);
  useNativeWebViewClientPathnameSync(pathname);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("PageTransition Pathname changed:", pathname);
    }
  }, [pathname]);

  return (
    <SsgoiTransition className="h-full" id={pathname || "/"} key={pathname}>
      {children}
    </SsgoiTransition>
  );
}
