"use client";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * 임시저장 데이터로 진입했을 때만 표시 (최초 등록 플로우).
 */
export function FormationDraftResumeBanner({ className }: Props) {
  return (
    <div
      role="status"
      className={cn(
        "w-full max-w-4xl rounded-xl border border-border-card bg-surface-card px-4 py-3 text-center text-sm text-text-primary md:text-base",
        className,
      )}
    >
      <p className="font-medium text-text-primary">
        자동 저장된 내용입니다.
      </p>
      <p className="mt-1 text-Label-Tertiary">
        모든 쿼터를 등록하고 확정하면, 확정된 포메이션이 선수에게 노출됩니다.
      </p>
    </div>
  );
}
