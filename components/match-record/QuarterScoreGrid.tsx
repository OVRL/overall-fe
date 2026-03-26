import { cn } from "@/lib/utils";
import type { QuarterScore } from "./types";

const LABELS = ["1쿼터", "2쿼터", "3쿼터", "4쿼터"] as const;

type QuarterScoreGridProps = {
  quarters: [QuarterScore, QuarterScore, QuarterScore, QuarterScore];
  className?: string;
};

/** 쿼터별 스코어 4칸 그리드 */
export function QuarterScoreGrid({
  quarters,
  className,
}: QuarterScoreGridProps) {
  return (
    <div>
      <h2 className="text-sm font-bold text-white mb-4">쿼터별 스코어</h2>

      <div
        className={cn(
          "grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4",
          className,
        )}
      >
        {quarters.map((q, i) => (
          <div
            key={LABELS[i]}
            className="rounded-[0.625rem] border border-gray-1000 p-3.25"
          >
            <p className="text-xs text-[#666] font-medium">{LABELS[i]}</p>
            <p className="mt-2 text-xl font-black text-white leading-7.5">
              {q.home} - {q.away}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
