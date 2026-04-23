import { useCallback } from "react";
import { useMomResultOverlayStore } from "./momResultOverlayStore";
import type { GachaCardProps } from "./GachaCard";

/**
 * MOM 결과 오버레이를 열고 닫을 때 사용하는 훅.
 * 실제 렌더는 루트 레이아웃의 `MomResultOverlayHost`에서 처리됨.
 */
export function useMomResultOverlay() {
  const openWithCandidatesStore = useMomResultOverlayStore(
    (s) => s.openWithCandidates,
  );
  const openByMatchStore = useMomResultOverlayStore((s) => s.openByMatch);
  const closeStore = useMomResultOverlayStore((s) => s.close);
  const isOpen = useMomResultOverlayStore((s) => s.isOpen);

  const openWithCandidates = useCallback(
    (candidates: GachaCardProps[]) => {
      if (candidates.length === 0) return;
      openWithCandidatesStore(candidates);
    },
    [openWithCandidatesStore],
  );

  const openByMatch = useCallback(
    (req: { matchId: number; teamId: number }) => {
      openByMatchStore(req);
    },
    [openByMatchStore],
  );

  const close = useCallback(() => {
    closeStore();
  }, [closeStore]);

  return { openWithCandidates, openByMatch, close, isOpen };
}
