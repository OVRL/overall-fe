import { create } from "zustand";
import type { GachaCardProps } from "./GachaCard";

type MomResultOverlayState = {
  /** 열림 여부 — `Activity`의 `mode`와 스크롤 락에 사용 */
  isOpen: boolean;
  /** `MomOverlay`에 넘길 후보 목록(닫은 뒤에도 `Activity` hidden 유지용으로 유지) */
  candidates: GachaCardProps[];
  /** 같은 후보로 다시 열 때도 진입 애니·카드 상태를 초기화하기 위한 세션 키 */
  sessionId: number;
  open: (candidates: GachaCardProps[]) => void;
  close: () => void;
};

/**
 * MOM 결과 풀스크린 오버레이 — 전역 단일 인스턴스용 스토어.
 * UI는 `MomResultOverlayHost`가 구독하며, 화면에서는 `useMomResultOverlay`만 사용하면 됨.
 */
export const useMomResultOverlayStore = create<MomResultOverlayState>((set) => ({
  isOpen: false,
  candidates: [],
  sessionId: 0,
  open: (candidates) =>
    set((s) => ({
      isOpen: true,
      candidates,
      sessionId: s.sessionId + 1,
    })),
  close: () => set({ isOpen: false }),
}));
