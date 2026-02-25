import { useState, useEffect } from "react";

/**
 * 뷰포트가 maxWidth 이하일 때 true.
 * SSR/하이드레이션 일치를 위해 초기값은 항상 false로 두고, 마운트 후 useEffect에서 실제 값으로 갱신합니다.
 */
export function useIsMobile(maxWidth: number = 767) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQueryList = window.matchMedia(`(max-width: ${maxWidth}px)`);
    setIsMobile(mediaQueryList.matches);

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
