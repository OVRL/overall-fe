import { cn } from "@/lib/utils";
import type { MatchRecord } from "./types";
import { QuarterScoreGrid } from "./QuarterScoreGrid";
import { GameTimeline } from "./GameTimeline";

type MatchDetailContentProps = {
  record: MatchRecord;
  className?: string;
};

/** 아코디언 펼침 영역: 쿼터 스코어 + 타임라인 */
export function MatchDetailContent({
  record,
  className,
}: MatchDetailContentProps) {
  return (
    <div className={cn("space-y-8 p-6", className)}>
      <div className="bg-gray-1300 rounded-xl p-6">
        <QuarterScoreGrid quarters={record.quarters} />
        <section aria-label="경기 이벤트 타임라인">
          <GameTimeline events={record.timeline} />
        </section>
      </div>
    </div>
  );
}
