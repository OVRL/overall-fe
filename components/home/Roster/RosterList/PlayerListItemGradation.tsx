import React from "react";
import { Position } from "@/types/position";
import { POSITION_CATEGORY_MAP } from "@/constants/position";
import { cn } from "@/lib/utils";

const POS_START_COLOR_MAP = {
  FW: "var(--color-Position-FW-Red)",
  MF: "var(--color-Position-MF-Green)",
  DF: "var(--color-Position-DF-Blue)",
  GK: "var(--color-Position-GK-Yellow)",
};

const POS_END_COLOR_MAP = {
  FW: "rgba(245, 67, 70, 0.00)",
  MF: "rgba(116, 234, 118, 0.00)",
  DF: "rgba(135, 210, 247, 0.00)",
  GK: "rgba(255, 185, 45, 0.20)",
};

interface Props {
  position: Position;
  className?: string;
}

const PlayerListItemGradation = ({ position, className }: Props) => {
  const category = POSITION_CATEGORY_MAP[position];
  const startColor = POS_START_COLOR_MAP[category];
  const endColor = POS_END_COLOR_MAP[category];

  return (
    <div
      className={cn(
        "absolute inset-0 z-0 opacity-10 pointer-events-none w-17.25",
        className,
      )}
      style={{
        background: `linear-gradient(90deg, ${startColor} 0%, ${endColor} 100%)`,
      }}
    />
  );
};

export default PlayerListItemGradation;
