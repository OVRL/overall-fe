"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

import Button from "@/components/ui/Button";
import type { FormationRosterViewMode } from "@/types/formationRosterViewMode";
import { cn } from "@/lib/utils";

export interface FormationRosterViewModeTabsProps {
  value: FormationRosterViewMode;
  onChange: (value: FormationRosterViewMode) => void;
}

const TAB_LAYOUT_ID = "formationRosterViewModeTabHighlight";

const tabButtonClass =
  "h-10 !w-auto shrink-0 px-4 !font-semibold touch-manipulation relative overflow-hidden transition-transform duration-150 ease-out motion-reduce:transition-none active:motion-safe:scale-[0.98] motion-reduce:active:scale-100";

const TABS: { id: FormationRosterViewMode; label: string }[] = [
  { id: "draft", label: "팀 드래프트" },
  { id: "A", label: "A팀" },
  { id: "B", label: "B팀" },
];

/**
 * 내전 경기에서 팀 드래프트 / A팀 / B팀 전환 — 모바일·PC 동일 활성 스타일, 내용 너비·가운데 정렬.
 * 활성 배경은 `layoutId` 공유 레이아웃 애니메이션(트윈, 저모션 시 비활성).
 */
export default function FormationRosterViewModeTabs({
  value,
  onChange,
}: FormationRosterViewModeTabsProps) {
  const prefersReducedMotion = useReducedMotion();
  const highlightTransition = prefersReducedMotion
    ? { duration: 0 }
    : ({ type: "tween" as const, ease: "easeOut" as const, duration: 0.2 });

  return (
    <div
      className="flex w-full flex-wrap items-center justify-center gap-3"
      role="tablist"
      aria-label="팀 보기 모드"
    >
      {TABS.map(({ id, label }) => {
        const selected = value === id;
        return (
          <Button
            key={id}
            type="button"
            role="tab"
            aria-selected={selected}
            variant="ghost"
            size="m"
            className={cn(tabButtonClass)}
            onClick={() => onChange(id)}
          >
            {selected ? (
              <motion.div
                layoutId={TAB_LAYOUT_ID}
                className="absolute inset-0 z-0 rounded-xl bg-Fill_AccentPrimary/20"
                transition={highlightTransition}
                initial={false}
                aria-hidden
              />
            ) : null}
            <span
              className={cn(
                "relative z-10",
                selected && "text-bg-AccentPrimary",
              )}
            >
              {label}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
