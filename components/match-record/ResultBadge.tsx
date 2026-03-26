import { cn } from "@/lib/utils";
import type { MatchResult } from "./types";

const BADGE_STYLES: Record<
  MatchResult,
  { label: string; srLabel: string; className: string }
> = {
  win: {
    label: "승",
    srLabel: "승리",
    className: "bg-[#B8FF12]/20 text-Label-AccentPrimary",
  },
  draw: {
    label: "무",
    srLabel: "무승부",
    className: " text-gray-600 bg-[#555]/50",
  },
  loss: {
    label: "패",
    srLabel: "패배",
    className: "bg-[#555]/50 text-red-600",
  },
};

type ResultBadgeProps = {
  result: MatchResult;
  className?: string;
};

/** 승·무·패 요약 배지 */
export function ResultBadge({ result, className }: ResultBadgeProps) {
  const cfg = BADGE_STYLES[result];
  return (
    <span
      className={cn(
        "inline-flex h-7.25 shrink-0 items-center justify-center px-3 py-1 text-xs font-medium rounded-[0.625rem]",
        cfg.className,
        className,
      )}
      aria-label={cfg.srLabel}
    >
      <span aria-hidden>{cfg.label}</span>
    </span>
  );
}
