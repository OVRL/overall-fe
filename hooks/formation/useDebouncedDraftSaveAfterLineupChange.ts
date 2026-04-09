"use client";

import { useCallback, useEffect, useRef } from "react";

const DEFAULT_DEBOUNCE_MS = 400;

type Params = {
  /** 최초 등록(드래프트) 플로우에서만 자동 임시저장 */
  enabled: boolean;
  saveDraft: () => void;
  debounceMs?: number;
};

/**
 * 포메이션 슬롯 배치/이동 후 임시저장을 디바운스합니다.
 * `saveDraft`는 최신 클로저를 ref로 따라갑니다.
 */
export function useDebouncedDraftSaveAfterLineupChange({
  enabled,
  saveDraft,
  debounceMs = DEFAULT_DEBOUNCE_MS,
}: Params): { schedule: () => void } {
  const saveRef = useRef(saveDraft);
  saveRef.current = saveDraft;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current != null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const schedule = useCallback(() => {
    if (!enabled) return;
    if (timerRef.current != null) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      saveRef.current();
    }, debounceMs);
  }, [debounceMs, enabled]);

  return { schedule };
}
