import React from "react";
import { cn } from "@/lib/utils";
import {
  getQuarterColor,
  getQuarterChipStyle,
} from "@/lib/quarterColors";

interface QuarterChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  quarters: number[];
  className?: string;
}

const QuarterChip: React.FC<QuarterChipProps> = ({
  quarters = [],
  className,
  ...props
}) => {
  const sortedQuarters = [...quarters].sort((a, b) => a - b);
  const isSingle = sortedQuarters.length === 1;
  const isNone = sortedQuarters.length === 0;

  // Text Logic: Show Max Quarter (e.g., "7Q")
  const maxQuarter = isNone ? 0 : sortedQuarters[sortedQuarters.length - 1];
  const text = `${maxQuarter}Q`;

  // 1. Single Logic (or 0Q)
  if (isSingle || isNone) {
    const q = isNone ? 0 : sortedQuarters[0];
    return (
      <span
        className={cn(
          "inline-flex items-center text-white justify-center rounded-sm shadow-[0_2px_10px_rgba(0, 0, 0, 0.30)] opacity-90 text-xs font-semibold transition-colors leading-none tracking-tight px-1 py-0.25",
          getQuarterChipStyle(q),
          className,
        )}
        {...props}
      >
        {text}
      </span>
    );
  }

  // 2. Multi Logic (Stacked Lines)
  // Max Quarter is styled on the chip itself (background)
  // Remaining quarters (1...Max-1) are stacked as bars below
  const remainingQuarters = sortedQuarters.filter((q) => q !== maxQuarter);

  return (
    <div className="flex flex-col h-full justify-center">
      <div
        className={cn(
          "relative inline-flex items-center text-white justify-center rounded-sm shadow-[0_2px_10px_rgba(0, 0, 0, 0.30)] opacity-90 text-xs font-semibold transition-colors leading-none tracking-tight px-1 py-0.25",
          getQuarterChipStyle(maxQuarter),
          className,
        )}
        {...props}
      >
        <span className="z-10">{text}</span>
      </div>
      <div className="flex flex-col gap-px w-full mt-px">
        {remainingQuarters.map((q) => (
          <div
            key={q}
            className={cn("w-full h-0.75 rounded-full", getQuarterColor(q))}
          />
        ))}
      </div>
    </div>
  );
};

export default QuarterChip;
