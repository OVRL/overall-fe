import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Position } from "@/types/position";
import { POSITION_CATEGORY_MAP } from "@/constants/position";

interface OnboardingPositionChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  position: Position | string;
  selected?: boolean;
}

const onboardingPositionChipVariants = cva(
  "inline-flex items-center justify-center rounded-full font-bold transition-all box-border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white",
  {
    variants: {
      intent: {
        FW: "bg-Position-FW-Red/30 text-Position-FW-Red",
        MF: "bg-Position-MF-Green/30 text-Position-MF-Green",
        DF: "bg-Position-DF-Blue/30 text-Position-DF-Blue",
        GK: "bg-Position-GK-Yellow/30 text-Position-GK-Yellow",
      },
      selected: {
        true: "border-3",
        false: "border-0",
      },
      size: {
        sm: "w-10 h-10 text-sm", // Standard
        md: "w-12 h-12 text-base", // Likely for onboarding selection
      },
      disabled: {
        true: "opacity-20 cursor-not-allowed",
        false: "",
      },
    },
    compoundVariants: [
      {
        intent: "FW",
        selected: true,
        className: "border-Position-FW-Red",
      },
      {
        intent: "MF",
        selected: true,
        className: "border-Position-MF-Green",
      },
      {
        intent: "DF",
        selected: true,
        className: "border-Position-DF-Blue",
      },
      {
        intent: "GK",
        selected: true,
        className: "border-Position-GK-Yellow",
      },
    ],
    defaultVariants: {
      size: "md",
      selected: false,
      disabled: false,
    },
  },
);

const OnboardingPositionChip = ({
  position,
  selected = false,
  className,
  type = "button", // Default to button to prevent form submission
  disabled = false,
  ...props
}: OnboardingPositionChipProps) => {
  // @ts-expect-error - Handle string positions gracefully
  const mainCategory = POSITION_CATEGORY_MAP[position] || "MF";

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        onboardingPositionChipVariants({
          intent: mainCategory,
          selected,
          disabled,
        }),
        className,
      )}
      aria-pressed={selected}
      {...props}
    >
      {position}
    </button>
  );
};

export default OnboardingPositionChip;
