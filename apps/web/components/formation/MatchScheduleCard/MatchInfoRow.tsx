import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  direction?: "row" | "column";
};

const MatchInfoRow = ({
  title,
  children,
  direction = "row",
}: PropsWithChildren<Props>) => {
  const isRow = direction === "row";

  return (
    <dl
      className={cn(
        "flex gap-3",
        isRow ? "h-7.5 items-center" : "flex-col items-start",
      )}
    >
      <dt
        className={cn(
          "text-Label-Tertiary text-sm leading-6 whitespace-nowrap",
          isRow ? "w-15" : "w-full",
        )}
      >
        {title}
      </dt>
      <dd className="flex-1 flex items-center w-full">{children}</dd>
    </dl>
  );
};

export default MatchInfoRow;
