"use client";

import React from "react";
import Button from "@/components/ui/Button";
import type { FormationRosterViewMode } from "@/types/formationRosterViewMode";
import { cn } from "@/lib/utils";

export interface FormationRosterViewModeTabsProps {
  value: FormationRosterViewMode;
  onChange: (value: FormationRosterViewMode) => void;
}

/**
 * 내전 경기에서 선수 명단 상단에 노출 — 팀 드래프트 / A팀 라인업 / B팀 라인업 전환.
 */
export default function FormationRosterViewModeTabs({
  value,
  onChange,
}: FormationRosterViewModeTabsProps) {
  return (
    <div
      className="flex flex-wrap gap-3 items-center w-full"
      role="tablist"
      aria-label="팀 보기 모드"
    >
      <Button
        type="button"
        role="tab"
        aria-selected={value === "draft"}
        variant={"ghost"}
        size="m"
        className={cn(
          "min-w-0 flex-1 font-semibold sm:flex-none sm:w-24",
          value === "draft" && "bg-Fill_AccentPrimary/20 text-bg-AccentPrimary",
        )}
        onClick={() => onChange("draft")}
      >
        팀 드래프트
      </Button>
      <Button
        type="button"
        role="tab"
        aria-selected={value === "A"}
        variant={"ghost"}
        size="m"
        className={cn(
          "min-w-0 flex-1 font-semibold sm:flex-none sm:w-20",
          value === "A" && "bg-Fill_AccentPrimary/20 text-bg-AccentPrimary",
        )}
        onClick={() => onChange("A")}
      >
        A팀
      </Button>
      <Button
        type="button"
        role="tab"
        aria-selected={value === "B"}
        variant={"ghost"}
        size="m"
        className={cn(
          "min-w-0 flex-1 font-semibold sm:flex-none sm:w-20",
          value === "B" && "bg-Fill_AccentPrimary/20 text-bg-AccentPrimary",
        )}
        onClick={() => onChange("B")}
      >
        B팀
      </Button>
    </div>
  );
}
