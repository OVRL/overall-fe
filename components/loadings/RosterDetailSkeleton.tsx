import Skeleton from "@/components/ui/Skeleton";

const RosterDetailSkeleton = () => {
  return (
    <div className="mt-4 md:mt-0">
      <div className="flex gap-3 md:gap-4">
        <div className="relative shrink-0 flex justify-center">
          <div className="origin-top">
            <Skeleton className="w-32 h-42 rounded-[10px] shadow-md" shimmer />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center py-1">
              <Skeleton className="h-4 w-12" shimmer />
              <Skeleton className="h-4 w-8" shimmer />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RosterDetailSkeleton;
