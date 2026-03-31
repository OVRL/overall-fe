import Skeleton from "@/components/ui/Skeleton";

/**
 * 데스크톱 포메이션 빌더 본문 레이아웃과 동일한 그리드의 스켈레톤.
 * `next/dynamic` 로딩 및 경기 데이터 Suspense 구간에서 동일 UI로 재사용합니다.
 */
export function FormationBuilderContentSkeleton() {
  return (
    <div className="flex flex-1 flex-col lg:flex-row gap-4 w-full max-w-screen-xl justify-center lg:items-stretch 2xl:max-w-none">
      <div className="w-full lg:flex-1 2xl:w-225 2xl:flex-none flex flex-col gap-4 shrink-0">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-32 rounded" />
          <div className="flex gap-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-9 rounded-full" />
          </div>
          <Skeleton className="h-12 w-36 rounded-[0.625rem] ml-auto" />
        </div>
        <Skeleton className="flex-1 min-h-80 w-full rounded-xl" />
      </div>
      <Skeleton className="w-full lg:w-80 min-h-100 rounded-xl shrink-0" />
    </div>
  );
}
