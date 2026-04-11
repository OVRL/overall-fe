import Skeleton from "@/components/ui/Skeleton";

/** 프로필 Relay 구간 Suspense fallback (팀 탭 + 아래 섹션 자리) */
export function ProfilePageRelayFallback() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-center gap-2 overflow-x-auto p-1 scrollbar-hide">
        <Skeleton
          className="h-17 w-33 shrink-0 rounded-[0.875rem] border-2 border-gray-1100 bg-gray-1200"
          shimmer
        />
        <Skeleton
          className="h-17 w-33 shrink-0 rounded-[0.875rem] border-2 border-gray-1100 bg-gray-1200"
          shimmer
        />
      </div>
      <Skeleton
        className="h-48 w-full rounded-xl border border-gray-1100 bg-gray-1200"
        shimmer
      />
      <Skeleton
        className="h-64 w-full rounded-xl border border-gray-1100 bg-gray-1200"
        shimmer
      />
      <Skeleton
        className="h-56 w-full rounded-xl border border-gray-1100 bg-gray-1200"
        shimmer
      />
    </div>
  );
}
