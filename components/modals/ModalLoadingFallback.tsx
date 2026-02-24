"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const FALLBACK_DELAY_MS = 200;

/**
 * next/dynamic 로딩 중 모달 자리에 보여줄 fallback UI.
 * FALLBACK_DELAY_MS 지난 후에만 스피너를 노출하며, 그 전에 로드되면 빈 카드만 보였다가 모달로 전환됨.
 */
const ModalLoadingFallback = () => {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => setShowFallback(true),
      FALLBACK_DELAY_MS,
    );
    return () => clearTimeout(timeoutId);
  }, []);

  if (!showFallback) {
    return (
      <div
        className={cn(
          "relative w-full max-w-9/10 md:w-100 min-h-48",
          "bg-surface-card border border-border-card rounded-xl",
        )}
        onClick={(e) => e.stopPropagation()}
        aria-busy="true"
        aria-live="polite"
        role="status"
      >
        <span className="sr-only">모달을 불러오는 중입니다.</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full max-w-9/10 md:w-100 min-h-48",
        "bg-surface-card border border-border-card rounded-xl p-4",
        "flex flex-col items-center justify-center gap-4",
      )}
      onClick={(e) => e.stopPropagation()}
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <span className="sr-only">모달을 불러오는 중입니다.</span>
      <div
        className="size-8 animate-spin rounded-full border-2 border-Fill_Quatiary border-t-Fill_AccentPrimary"
        aria-hidden
      />
    </div>
  );
};

export default ModalLoadingFallback;
