"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  type UniformDesign,
  UNIFORM_DESIGNS,
} from "../_lib/uniformDesign";

interface UniformColorSelectorProps {
  label: string;
  value?: UniformDesign;
  onChange: (design: UniformDesign) => void;
  /** 다른 쪽(홈/어웨이)에서 선택된 디자인 — 이 옵션은 비활성화 및 시각적 처리 */
  disabledDesign?: UniformDesign;
  className?: string;
}

export default function UniformColorSelector({
  label,
  value,
  onChange,
  disabledDesign,
  className,
}: UniformColorSelectorProps) {
  return (
    <div className={cn("flex flex-col gap-3 px-3", className)}>
      <span className="text-Label-Primary text-sm font-semibold">{label}</span>
      <div className="grid grid-cols-5 gap-2 max-w-90 place-items-center">
        {UNIFORM_DESIGNS.map((item) => {
          const isSelected = value === item.design;
          const isDisabled = disabledDesign != null && item.design === disabledDesign;
          return (
            <button
              key={item.design}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onChange(item.design)}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-sm border transition-all size-7.5 overflow-hidden cursor-pointer",
                isSelected
                  ? "border-Fill_AccentPrimary bg-primary/10"
                  : "border-transparent hover:border-Fill_Tertiary",
                isDisabled &&
                  "cursor-not-allowed opacity-40 bg-Fill_Quatiary border-Fill_Tertiary hover:border-Fill_Tertiary",
              )}
              title={isDisabled ? `${item.label} (다른 유니폼에서 선택됨)` : item.label}
              aria-label={isDisabled ? `${item.label} (선택 불가)` : `${item.label} 유니폼 선택`}
              aria-disabled={isDisabled}
              aria-pressed={isSelected}
            >
              <Image
                src={item.imagePath}
                alt={`${item.label} 유니폼`}
                width={30}
                height={30}
                sizes="30px"
                quality={100}
                className="object-contain w-full h-full"
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
