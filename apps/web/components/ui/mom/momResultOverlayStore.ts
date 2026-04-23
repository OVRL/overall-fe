import { create } from "zustand";
import type { GachaCardProps } from "./GachaCard";

export type MomResultOverlayMatchRequest = {
  matchId: number;
  teamId: number;
};

type MomResultOverlayState = {
  /** 열림 여부 — `Activity`의 `mode`와 스크롤 락에 사용 */
  isOpen: boolean;
  /** openByMatch 이후 쿼리 로딩 중 여부 (Activity hidden이면 effect가 죽으므로 별도 플래그로 제어) */
  isFetching: boolean;
  /** `MomOverlay`에 넘길 후보 목록(닫은 뒤에도 `Activity` hidden 유지용으로 유지) */
  candidates: GachaCardProps[];
  /** 같은 후보로 다시 열 때도 진입 애니·카드 상태를 초기화하기 위한 세션 키 */
  sessionId: number;
  /** 버튼 클릭 등 사용자 액션으로 조회할 match/team */
  request: MomResultOverlayMatchRequest | null;
  /** request 변경 감지용 시퀀스 */
  requestId: number;
  /** 이미 후보가 있는 경우(서버/프리패치 등) 바로 표시 */
  openWithCandidates: (candidates: GachaCardProps[]) => void;
  /** 버튼 클릭 시 이 메서드를 호출하면 호스트가 쿼리를 로드한다 */
  openByMatch: (req: MomResultOverlayMatchRequest) => void;
  /** 요청만 초기화(오버레이는 열지 않은 상태 유지) */
  clearRequest: () => void;
  close: () => void;
};

/**
 * MOM 결과 풀스크린 오버레이 — 전역 단일 인스턴스용 스토어.
 * UI는 `MomResultOverlayHost`가 구독하며, 화면에서는 `useMomResultOverlay`만 사용하면 됨.
 */
export const useMomResultOverlayStore = create<MomResultOverlayState>((set) => ({
  isOpen: false,
  isFetching: false,
  candidates: [],
  sessionId: 0,
  request: null,
  requestId: 0,
  openWithCandidates: (candidates) =>
    set((s) => ({
      isOpen: true,
      isFetching: false,
      candidates,
      sessionId: s.sessionId + 1,
      request: null,
      requestId: s.requestId + 1,
    })),
  openByMatch: (req) =>
    set((s) => {
      // 이미 같은 요청을 fetching 중이면 중복 호출 방지(연타 방지)
      if (
        s.isFetching &&
        s.request?.matchId === req.matchId &&
        s.request?.teamId === req.teamId
      ) {
        return s;
      }
      return {
        // 중요: 버튼 클릭 시점에만 fetching하고, 성공했을 때만 오버레이를 연다.
        // 따라서 여기서는 오버레이를 열지 않는다.
        isOpen: false,
        isFetching: true,
        sessionId: s.sessionId + 1,
        request: req,
        requestId: s.requestId + 1,
      };
    }),
  clearRequest: () => set({ request: null, isFetching: false }),
  close: () =>
    set({
      isOpen: false,
      isFetching: false,
      request: null,
    }),
}));
