import QuarterButton from "@/components/ui/QuarterButton";
import { cn } from "@/lib/utils";
import type { MatchTimelineEvent } from "./types";
import { TimelineEventRow } from "./TimelineEventRow";

type GameTimelineProps = {
  events: MatchTimelineEvent[];
  className?: string;
};

function quarterLabel(q: MatchTimelineEvent["quarter"]) {
  return `${q}Q`;
}

/** 세로 타임라인 + 쿼터 마커 */
export function GameTimeline({ events, className }: GameTimelineProps) {
  if (events.length === 0) {
    return (
      <p
        className={cn(
          "py-6 text-center text-sm text-Label-Tertiary",
          className,
        )}
        role="status"
      >
        등록된 이벤트가 없습니다.
      </p>
    );
  }

  return (
    <div className={cn("relative pl-2 md:pl-3", className)}>
      <ol className="relative z-1" role="list">
        {events.map((event) => (
          <li key={event.id} className="relative flex flex-col pt-4">
            <QuarterButton
              type="button"
              variant="default"
              tabIndex={-1}
              aria-hidden
              className="pointer-events-none shrink-0"
            >
              {quarterLabel(event.quarter)}
            </QuarterButton>

            <TimelineEventRow event={event} className="flex-1 pt-0.5" />
          </li>
        ))}
      </ol>
    </div>
  );
}
