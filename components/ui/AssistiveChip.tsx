import React from "react";
import { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import Icon from "./Icon";

export type AssistiveChipVariant = "default" | "select1" | "select2" | "hover";

interface AssistiveChipProps {
  label: string;
  variant?: AssistiveChipVariant;
  icon?: StaticImageData | React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const AssistiveChip: React.FC<AssistiveChipProps> = ({
  label,
  variant = "default",
  icon,
  onClick,
  className,
  disabled,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-2 py-1.5 rounded-lg text-[0.8125rem] font-semibold transition-all border border-solid overflow-hidden relative select-none";

  const variants: Record<AssistiveChipVariant, string> = {
    default: "border-Fill_Quatiary text-Label-Secondary bg-transparent",
    select1:
      "bg-Fill_AccentPrimary border-Fill_AccentPrimary text-Label-Primary",
    select2: "border-Fill_Secondary text-Label-Primary bg-transparent",
    hover:
      "border-Fill_Quatiary text-Label-Secondary bg-transparent shadow-[0_2px_10px_0_rgba(0,0,0,0.15)] hover:bg-Fill_Quatiary/10",
  };

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={cn(
        baseStyles,
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && onClick && "cursor-pointer",
        className,
      )}
    >
      {icon && (
        <div className="flex shrink-0 w-4 h-4 items-center justify-center">
          {typeof icon === "object" && icon !== null && "src" in icon ? (
            <Icon src={icon as StaticImageData} width={16} height={16} />
          ) : (
            (icon as React.ReactNode)
          )}
        </div>
      )}
      <span className="truncate">{label}</span>
    </div>
  );
};

export default AssistiveChip;
