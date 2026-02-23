"use client";

import { cn } from "@/lib/utils";
import React from "react";
import uniformSvg from "@/public/icons/uniform.svg";
import Icon from "@/components/ui/Icon";

export const UNIFORM_COLORS = [
  { name: "레드", hex: "#E30613" },
  { name: "블루", hex: "#034694" },
  { name: "라이트 블루", hex: "#6CABDD" },
  { name: "블랙", hex: "#000000" },
  { name: "화이트", hex: "#FFFFFF" },
  { name: "옐로우", hex: "#FDE100" },
  { name: "그린", hex: "#00A650" },
  { name: "오렌지", hex: "#F36C21" },
  { name: "네이비", hex: "#132257" },
  { name: "퍼플", hex: "#7A259D" },
  { name: "버건디", hex: "#670E36" },
  { name: "핑크", hex: "#FFC0CB" },
];

interface UniformColorSelectorProps {
  label: string;
  value?: string;
  onChange: (colorHex: string) => void;
  className?: string;
}

export default function UniformColorSelector({
  label,
  value,
  onChange,
  className,
}: UniformColorSelectorProps) {
  return (
    <div className={cn("flex flex-col gap-3 px-3", className)}>
      <span className="text-Label-Primary text-sm font-semibold">{label}</span>
      <div className="grid grid-cols-6 gap-2 max-w-90 place-items-center">
        {UNIFORM_COLORS.map((color) => {
          const isSelected = value === color.hex;
          return (
            <button
              key={color.hex}
              type="button"
              onClick={() => onChange(color.hex)}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-lg border transition-all size-7.5",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-transparent",
              )}
              title={color.name}
              style={{ color: color.hex }}
            >
              <Icon
                src={uniformSvg}
                alt={`${color.name} 유니폼`}
                width={28}
                height={28}
                className="w-7 h-7"
                style={{
                  filter:
                    color.hex === "#FFFFFF"
                      ? "drop-shadow(0px 0px 4px rgba(0,0,0,0.4))"
                      : "drop-shadow(0px 0px 2px rgba(0,0,0,0.15))",
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
