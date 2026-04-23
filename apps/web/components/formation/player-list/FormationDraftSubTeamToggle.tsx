"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { InHouseDraftTeamChoice } from "@/hooks/formation/useInHouseDraftTeamAssignments";

export interface FormationDraftSubTeamToggleProps {
  /** 현재 배정 — null이면 미선택 */
  value: InHouseDraftTeamChoice;
  onChange: (next: InHouseDraftTeamChoice) => void;
  /** 스크린리더용 선수 이름 */
  playerName: string;
}

const toggleButtonBase =
  "inline-flex items-center justify-center size-6 rounded-full bg-gray-800/30 text-gray-800 font-bold transition-colors";

const toggleUnselectedHover = "hover:bg-surface-secondary";

/** 선택됐을 때만 적용 — 포지션 토큰으로 A/B/미배정 구분 */
const selectedAccentByChoice = {
  null: "border-2 border-Position-MF-Green bg-Position-MF-Green/30 text-Position-MF-Green",
  A: "border-2 border-Position-FW-Red bg-Position-FW-Red/30 text-Position-FW-Red",
  B: "border-2 border-Position-DF-Blue bg-Position-DF-Blue/30 text-Position-DF-Blue",
} as const;

type ToggleSegment = {
  choice: InHouseDraftTeamChoice;
  ariaLabel: string;
  label: React.ReactNode;
  /** 미선택(−)만 조금 작은 글자 */
  labelSizeClass?: string;
};

const SEGMENTS: ToggleSegment[] = [
  {
    choice: null,
    ariaLabel: "팀 미배정",
    label: "−",
    labelSizeClass: "text-[0.625rem] tabular-nums leading-none",
  },
  { choice: "A", ariaLabel: "A팀", label: "A", labelSizeClass: "text-xs" },
  { choice: "B", ariaLabel: "B팀", label: "B", labelSizeClass: "text-xs" },
];

/**
 * 팀 드래프트 명단 행 우측 — 미선택 / A / B 라디오 그룹 (비즈니스 상태는 상위 훅).
 */
export default function FormationDraftSubTeamToggle({
  value,
  onChange,
  playerName,
}: FormationDraftSubTeamToggleProps) {
  return (
    <div
      className="flex gap-1.5 items-center shrink-0"
      role="radiogroup"
      aria-label={`${playerName} 소속 팀`}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {SEGMENTS.map(({ choice, ariaLabel, label, labelSizeClass }) => {
        const checked =
          choice === null ? value === null : value === choice;

        return (
          <button
            key={choice === null ? "none" : choice}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={ariaLabel}
            className={cn(
              toggleButtonBase,
              labelSizeClass,
              checked
                ? selectedAccentByChoice[choice === null ? "null" : choice]
                : toggleUnselectedHover,
            )}
            onClick={() => onChange(choice)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
