"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";

const HOVER_CLOSE_MS = 140;

/** 참석 요약 팝오버: attend / absent / 닫힘 */
export type AttendancePopoverOpenKind = "attend" | "absent" | null;

/**
 * 호버로 연 팝오버를 콘텐츠로 이동할 때 끊기지 않도록 짧은 지연 후 닫습니다.
 */
export function useAttendancePopoverHoverClose(
  setOpenKind: Dispatch<SetStateAction<AttendancePopoverOpenKind>>,
) {
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current != null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setOpenKind(null);
      closeTimerRef.current = null;
    }, HOVER_CLOSE_MS);
  }, [cancelClose, setOpenKind]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  return { cancelClose, scheduleClose };
}
