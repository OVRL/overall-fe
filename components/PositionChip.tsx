import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Position } from "@/types/position";
import { POSITION_CATEGORY_MAP } from "@/constants/position";

const positionChipVariants = cva(
  "py-0.5 px-1.5 inline-flex items-center justify-center rounded-sm text-xs font-semibold border shadow-[0_2px_10px_0_rgba(0,0,0,0.15)] transition-colors leading-none",
  {
    variants: {
      intent: {
        FW: "",
        MF: "",
        DF: "",
        GK: "",
      },
      variant: {
        outline: "bg-transparent",
        filled: "border-transparent",
      },
    },
    compoundVariants: [
      // Outline variants
      {
        intent: "FW",
        variant: "outline",
        className: "border-Position-FW-Red text-Position-FW-Red",
      },
      {
        intent: "MF",
        variant: "outline",
        className: "border-Position-MF-Green text-Position-MF-Green",
      },
      {
        intent: "DF",
        variant: "outline",
        className: "border-Position-DF-Blue text-Position-DF-Blue",
      },
      {
        intent: "GK",
        variant: "outline",
        className: "border-Position-GK-Yellow text-Position-GK-Yellow",
      },

      // Filled variants
      {
        intent: "FW",
        variant: "filled",
        className: "bg-Position-FW-Red text-white",
      },
      {
        intent: "MF",
        variant: "filled",
        className: "bg-Position-MF-Green text-white",
      },
      {
        intent: "DF",
        variant: "filled",
        className: "bg-Position-DF-Blue text-white",
      },
      {
        intent: "GK",
        variant: "filled",
        className: "bg-Position-GK-Yellow text-white",
      },
    ],
    defaultVariants: {
      variant: "outline",
    },
  },
);

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  position: Position;
  variant?: "outline" | "filled";
}

const PositionChip = ({
  position,
  variant = "outline",
  className,
  ...props
}: Props) => {
  if (position === "용병") {
    const mercenaryClasses =
      variant === "outline"
        ? "border-gray-300 text-gray-300 bg-transparent shadow-[0_2px_10px_0_rgba(0,0,0,0.15)]"
        : "border-gray-300 text-gray-300 bg-gray-200/10 shadow-[0_2px_10px_0_rgba(0,0,0,0.15)]";
    return (
      <span
        className={cn(
          "py-0.5 px-1.5 inline-flex items-center justify-center rounded-sm text-xs font-semibold border leading-none transition-colors",
          mercenaryClasses,
          className,
        )}
        {...props}
      >
        용병
      </span>
    );
  }

  const mainCategory = POSITION_CATEGORY_MAP[position];

  return (
    <span
      className={cn(
        positionChipVariants({ intent: mainCategory, variant }),
        className,
      )}
      {...props}
    >
      {position}
    </span>
  );
};

export default PositionChip;
