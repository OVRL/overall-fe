import { useCallback, useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import { NAV_TAB_NAV_COOLDOWN_MS } from "./constants";

/**
 * 연속 탭으로 WebView `injectJavaScript` 네비가 겹치지 않도록 쿨다운·트레일링 큐를 둔다.
 * - 쿨다운 밖: 즉시 `onNavigateToPath` 호출 후 `NAV_TAB_NAV_COOLDOWN_MS` 동안 잠금.
 * - 쿨다운 안: 마지막으로 누른 `href`만 큐에 두고, 쿨다운 종료 시 한 번만 이동한다.
 */
export function useLiquidNavTabNavigation(
  onNavigateToPath: (path: string) => void,
) {
  const cooldownUntilRef = useRef(0);
  const queuedHrefRef = useRef<string | null>(null);
  const queueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onNavigateRef = useRef(onNavigateToPath);

  useEffect(() => {
    onNavigateRef.current = onNavigateToPath;
  }, [onNavigateToPath]);

  useEffect(
    () => () => {
      if (queueTimerRef.current != null) {
        clearTimeout(queueTimerRef.current);
        queueTimerRef.current = null;
      }
      queuedHrefRef.current = null;
    },
    [],
  );

  const flushQueuedNavigation = useCallback(() => {
    queueTimerRef.current = null;
    const href = queuedHrefRef.current;
    queuedHrefRef.current = null;
    if (href == null) return;
    onNavigateRef.current(href);
    cooldownUntilRef.current = Date.now() + NAV_TAB_NAV_COOLDOWN_MS;
  }, []);

  /**
   * 탭 프레스: 햅틱 후 쿨다운 규칙에 따라 네비게이션을 예약하거나 즉시 실행한다.
   */
  const onTabPress = useCallback(
    async (href: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const now = Date.now();

      if (now >= cooldownUntilRef.current) {
        if (queueTimerRef.current != null) {
          clearTimeout(queueTimerRef.current);
          queueTimerRef.current = null;
        }
        queuedHrefRef.current = null;
        onNavigateRef.current(href);
        cooldownUntilRef.current = now + NAV_TAB_NAV_COOLDOWN_MS;
        return;
      }

      queuedHrefRef.current = href;
      if (queueTimerRef.current != null) {
        clearTimeout(queueTimerRef.current);
      }
      const delay = Math.max(0, cooldownUntilRef.current - now);
      queueTimerRef.current = setTimeout(flushQueuedNavigation, delay);
    },
    [flushQueuedNavigation],
  );

  return onTabPress;
}
