import Skeleton from "@/components/ui/Skeleton";

export default function RosterPanelPlaceholderSkeleton() {
  return (
    <aside
      className="h-full w-full p-4 flex flex-col gap-3 min-h-72"
      aria-busy="true"
      aria-label="로스터 로딩 중"
    >
      <Skeleton className="h-36 w-full rounded-xl" />
      <Skeleton className="h-8 w-3/4 rounded-md" />
      <Skeleton className="flex-1 min-h-32 w-full rounded-lg" />
    </aside>
  );
}
