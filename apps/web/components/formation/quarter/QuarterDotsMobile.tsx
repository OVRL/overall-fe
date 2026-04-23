"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { getQuarterColor } from "@/lib/quarterColors";

export interface QuarterDotsMobileProps {
  /** 배치된 쿼터 id 목록 (예: [1, 2, 3, 4]) */
  quarterIds: number[];
  className?: string;
}

/**
 * 모바일용: 배치된 쿼터를 2열 그리드의 6x6 원으로 표시.
 * QUARTER_COLORS와 동일한 색상 사용, gap-0.5.
 */
const QuarterDotsMobile: React.FC<QuarterDotsMobileProps> = ({
  quarterIds,
  className,
}) => {
  const sorted = [...quarterIds].sort((a, b) => a - b);

  if (sorted.length === 0) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-0.5 w-fit",
        className,
      )}
      role="img"
      aria-label={`${sorted.length}개 쿼터 배치됨`}
    >
      {sorted.map((q) => (
        <span
          key={q}
          className={cn(
            "block w-1.5 h-1.5 rounded-full shrink-0",
            getQuarterColor(q),
          )}
        />
      ))}
    </div>
  );
};

export default QuarterDotsMobile;
