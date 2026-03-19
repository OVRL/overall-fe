import { useSyncExternalStore } from "react";

/**
 * 뷰포트가 maxWidth 이하일 때 true.
 * useSyncExternalStore로 matchMedia 구독해 effect 내 setState 없이 SSR/하이드레이션 안전하게 처리.
 */
export function useIsMobile(maxWidth: number = 767) {
  const query = `(max-width: ${maxWidth}px)`;

  const subscribe = (onStoreChange: () => void) => {
    if (typeof window === "undefined") return () => {};
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onStoreChange);
    return () => mql.removeEventListener("change", onStoreChange);
  };

  const getSnapshot = () =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches;

  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
