import React from "react";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface SearchLoadingListProps {
  count?: number;
}

export const SearchLoadingList = ({ count = 2 }: SearchLoadingListProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="py-3 px-2 flex flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </>
  );
};

interface SearchEmptyStateProps {
  message: string;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: React.ElementType<any>;
}

export const SearchEmptyState = ({
  message,
  className,
  as: Component = "div",
}: SearchEmptyStateProps) => {
  return (
    <Component
      className={cn("py-10 text-center text-Label-Tertiary text-sm", className)}
    >
      {message}
    </Component>
  );
};
