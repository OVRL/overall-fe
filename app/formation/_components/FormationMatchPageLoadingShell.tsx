"use client";

import Skeleton from "@/components/ui/Skeleton";
import { FormationBuilderContentSkeleton } from "./FormationBuilderContentSkeleton";

function FormationMatchHeaderSkeleton() {
  return (
    <header
      className="flex items-center justify-between gap-4 p-4 shrink-0"
      aria-hidden="true"
    >
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <Skeleton className="h-6 flex-1 max-w-md rounded-md hidden sm:block" />
      <div className="flex gap-2 shrink-0">
        <Skeleton className="h-10 w-16 rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
    </header>
  );
}

/**
 * 참석자 데이터 로딩 등, `FormationBuilder`가 마운트되기 전 전체 페이지 플레이스홀더.
 * 실제 `FormationBuilder` 래퍼(`min-h-dvh`·헤더·main 패딩)와 동일한 골격을 맞춥니다.
 */
export function FormationMatchPageLoadingShell() {
  return (
    <div
      className="min-h-dvh pt-safe bg-surface-primary flex flex-col"
      role="status"
      aria-busy="true"
      aria-label="포메이션 로딩 중"
    >
      <FormationMatchHeaderSkeleton />
      <main className="flex-1 flex flex-col px-3 md:px-6 py-4 w-full items-center bg-surface-primary">
        <FormationBuilderContentSkeleton />
      </main>
    </div>
  );
}
