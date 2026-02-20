import { useState, useEffect } from "react";

// Default breakpoint for md in Tailwind is 768px.
// Devices under 768px are considered mobile.
export function useIsMobile(maxWidth: number = 767) {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${maxWidth}px)`).matches;
  });

  useEffect(() => {
    // SSR Check
    if (typeof window === "undefined") return;

    const mediaQueryList = window.matchMedia(`(max-width: ${maxWidth}px)`);

    // Event handler
    const changeHandler = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Add event listener using modern API
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", changeHandler);
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(changeHandler);
    }

    // Cleanup
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", changeHandler);
      } else {
        mediaQueryList.removeListener(changeHandler);
      }
    };
  }, [maxWidth]);

  return isMobile;
}
