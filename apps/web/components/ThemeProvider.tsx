"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

// next-themes v0.4.x injects a synchronous <script> to prevent theme flash (FOUC).
// React 19 emits a dev-only console.error when it encounters such inline scripts
// inside the component tree, because they won't re-execute on client-side re-renders.
// This is intentional — the script only needs to run once on initial page load.
// We filter that specific warning here to keep the console clean.
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  const _originalError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    _originalError(...args);
  };
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
