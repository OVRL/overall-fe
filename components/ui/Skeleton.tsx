import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

const Skeleton = ({ className, shimmer = false, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "rounded-md bg-gray-100 dark:bg-gray-800",
        shimmer && "relative overflow-hidden",
        !shimmer && "animate-pulse",
        className,
      )}
      {...props}
    >
      {shimmer && (
        <div
          className="animate-shimmer absolute inset-0 bg-[linear-gradient(120deg,transparent_40%,rgba(255,255,255,0.6)_50%,transparent_60%)] dark:bg-[linear-gradient(120deg,transparent_40%,rgba(255,255,255,0.2)_50%,transparent_60%)]"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Skeleton;
