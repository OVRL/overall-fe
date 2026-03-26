import ballI from "@/public/icons/player-infos/ball.svg";
import { cn } from "@/lib/utils";
import type { MatchTimelineEvent } from "./types";
import Icon from "../ui/Icon";
import closeIcon from "@/public/icons/close.svg";
type TimelineEventRowProps = {
  event: MatchTimelineEvent;
  className?: string;
};

const DashLine = () => {
  return (
    <div className="flex w-12 shrink-0 flex-col items-center" aria-hidden>
      <div className="mx-auto min-h-0 w-0 flex-1 border-l-2 border-dashed border-gray-900" />
    </div>
  );
};

/** 타임라인 한 이벤트 (득점 / 실점) */
export function TimelineEventRow({ event, className }: TimelineEventRowProps) {
  if (event.kind === "goal") {
    return (
      <div className={cn("flex items-stretch", className)}>
        <DashLine />
        <div className="flex gap-2 p-2 w-full">
          <Icon src={ballI} width={20} height={20} nofill />
          <div className="flex flex-col pt-0.5 gap-1">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-gray-300">득점</span>
              <span className="text-sm font-semibold text-white">
                {event.scorerName ?? "—"}
              </span>
            </div>
            {(event.assistName != null || event.buildUpName != null) && (
              <div className="flex flex-col gap-1">
                {event.assistName != null && (
                  <div className="flex items-center gap-1">
                    <span className="text-[0.6875rem] text-gray-700">도움</span>
                    <span className="text-[0.6875rem] text-[#A6A5A5]">
                      {event.assistName}
                    </span>
                  </div>
                )}
                {event.buildUpName != null && (
                  <div className="flex items-center gap-1">
                    <span className="text-[0.6875rem] text-gray-700">기점</span>
                    <span className="text-[0.6875rem] text-[#A6A5A5]">
                      {event.buildUpName}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-stretch", className)}>
      <DashLine />
      <div className="flex gap-2 p-2 w-full">
        <div className="relative" aria-hidden>
          <Icon
            src={ballI}
            width={20}
            height={20}
            nofill
            className="absolute top-0 left-0"
          />
          <Icon
            src={closeIcon}
            width={20}
            height={20}
            className="text-red-600"
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold text-red-400">실점</span>
          <span className="text-sm font-semibold text-red-400">
            {event.opponentLabel ?? "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
