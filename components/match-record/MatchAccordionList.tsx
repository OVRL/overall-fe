import { cn } from "@/lib/utils";
import type { MatchRecord } from "./types";
import { MatchAccordionItem } from "./MatchAccordionItem";

type MatchAccordionListProps = {
  records: MatchRecord[];
  className?: string;
};

/** 경기 기록 아코디언 목록 (행 간 gap-4) */
export function MatchAccordionList({
  records,
  className,
}: MatchAccordionListProps) {
  if (records.length === 0) {
    return (
      <p className="rounded-2xl border border-border-card bg-surface-card px-6 py-12 text-center text-sm text-Label-Tertiary">
        표시할 경기 기록이 없습니다.
      </p>
    );
  }

  return (
    <ul className={cn("flex flex-col gap-4", className)} role="list">
      {records.map((record) => (
        <li key={record.id}>
          <MatchAccordionItem record={record} />
        </li>
      ))}
    </ul>
  );
}
