"use client";

import { Activity } from "react";
import MomOverlay from "./MomOverlay";
import { useMomResultOverlayStore } from "./momResultOverlayStore";
import { useScrollLock } from "@/hooks/useScrollLock";

/**
 * MOM 결과 오버레이 전역 호스트 — `app/layout`에 한 번만 마운트.
 * `Activity`로 표시만 전환해 트리를 유지하고(공식 권장 패턴), `sessionId`로 내용 갱신 시 자식 상태를 초기화함.
 */
export default function MomResultOverlayHost() {
  const isOpen = useMomResultOverlayStore((s) => s.isOpen);
  const candidates = useMomResultOverlayStore((s) => s.candidates);
  const sessionId = useMomResultOverlayStore((s) => s.sessionId);
  const close = useMomResultOverlayStore((s) => s.close);

  useScrollLock(isOpen);

  const hasPayload = candidates.length > 0;

  return (
    <Activity mode={isOpen ? "visible" : "hidden"} name="MomResultOverlay">
      {hasPayload ? (
        <MomOverlay
          key={sessionId}
          candidates={candidates}
          onClose={close}
        />
      ) : null}
    </Activity>
  );
}
