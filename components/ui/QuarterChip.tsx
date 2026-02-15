import React from "react";
import { cn } from "@/lib/utils";

interface QuarterChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  quarters: number[];
  className?: string; // Additional className for the wrapper
}

const QUARTER_COLORS: Record<
  number,
  { border: string; bg: string; text?: string }
> = {
  1: {
    border: "border-Position-DF-Blue",
    bg: "bg-Position-DF-Blue",
    text: "text-Position-DF-Blue",
  },
  2: {
    border: "border-Position-MF-Green",
    bg: "bg-Position-MF-Green",
    text: "text-Position-MF-Green",
  },
  3: {
    border: "border-Position-GK-Yellow",
    bg: "bg-Position-GK-Yellow",
    text: "text-Position-GK-Yellow",
  },
  4: {
    border: "border-Position-FW-Red",
    bg: "bg-Position-FW-Red",
    text: "text-Position-FW-Red",
  },
  5: {
    border: "border-purple-500",
    bg: "bg-purple-500",
    text: "text-purple-500",
  },
  6: {
    border: "border-orange-500",
    bg: "bg-orange-500",
    text: "text-orange-500",
  },
  7: { border: "border-pink-500", bg: "bg-pink-500", text: "text-pink-500" },
  8: { border: "border-cyan-500", bg: "bg-cyan-500", text: "text-cyan-500" },
  9: { border: "border-teal-500", bg: "bg-teal-500", text: "text-teal-500" },
  10: {
    border: "border-indigo-500",
    bg: "bg-indigo-500",
    text: "text-indigo-500",
  },
};

const getSingleStyle = (q: number) => {
  const color = QUARTER_COLORS[q] || {
    border: "border-gray-600",
    bg: "bg-gray-600",
  };
  return `border ${color.border} ${color.bg}`;
};

const getQuarterColor = (q: number) => {
  return QUARTER_COLORS[q]?.bg || "bg-gray-600";
};

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
          getSingleStyle(q),
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
          getSingleStyle(maxQuarter),
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
