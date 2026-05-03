export function ProfilePersonalRelayFallback() {
  return (
    <div className="bg-gray-1300 flex flex-col items-start p-8 rounded-2xl shrink-0 w-full animate-pulse">
      <div className="flex flex-col gap-6 items-start w-full">
        {/* Name Skeleton */}
        <div className="h-8 w-24 bg-gray-1100 rounded-md" />

        <div className="flex flex-col gap-6 items-start w-full md:w-[427px]">
          {/* Main Position Skeleton */}
          <div className="flex gap-2 items-center w-full">
            <div className="h-5 w-16 bg-gray-1100 rounded" />
            <div className="h-6 w-10 bg-gray-1100 rounded" />
          </div>

          {/* Sub Position Skeleton */}
          <div className="flex gap-2 items-center w-full">
            <div className="h-5 w-16 bg-gray-1100 rounded" />
            <div className="h-6 w-10 bg-gray-1100 rounded" />
          </div>

          {/* Activity Area Skeleton */}
          <div className="flex gap-3 items-center w-full">
            <div className="h-5 w-16 bg-gray-1100 rounded" />
            <div className="h-5 w-40 bg-gray-1100 rounded" />
          </div>

          {/* Body Info Skeleton */}
          <div className="flex gap-3 items-center w-full">
            <div className="h-5 w-16 bg-gray-1100 rounded" />
            <div className="h-5 w-48 bg-gray-1100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
