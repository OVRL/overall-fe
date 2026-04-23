"use client";

import { SsgoiTransition } from "@ssgoi/react";
import { usePathname } from "next/navigation";
import React from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  React.useEffect(() => {
    console.log("PageTransition Pathname changed:", pathname);
  }, [pathname]);

  return (
    <SsgoiTransition className="h-full" id={pathname || "/"} key={pathname}>
      {children}
    </SsgoiTransition>
  );
}
