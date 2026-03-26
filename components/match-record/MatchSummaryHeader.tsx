import Icon from "@/components/ui/Icon";
import arrow_down from "@/public/icons/arrow_down.svg";
import { cn } from "@/lib/utils";
import type { MatchRecord } from "./types";
import { ResultBadge } from "./ResultBadge";

type MatchSummaryHeaderProps = {
  record: MatchRecord;
  isOpen: boolean;
  className?: string;
};

/** 아코디언 트리거 영역: 날짜·상대·스코어·배지·쉐브론 */
export function MatchSummaryHeader({
  record,
  className,
  isOpen,
}: MatchSummaryHeaderProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-3 p-6",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="shrink-0 text-[0.8125rem] text-gray-600">
          {record.dateLabel}
        </span>
        <span className="min-w-0 truncate font-bold text-white">
          vs {record.opponentName}
        </span>
        <span className="min-w-0 truncate font-bold text-white">
          {record.ourScore} - {record.theirScore}
        </span>
        <ResultBadge result={record.result} />
      </div>
      <span
        aria-hidden
        className={cn(
          "inline-flex shrink-0 text-Label-Tertiary transition-transform duration-200 ease-out",
          isOpen && "rotate-180",
        )}
      >
        <Icon src={arrow_down} width={24} height={24} alt="" />
      </span>
    </div>
  );
}
