"use client";

import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";

export type DateFilterOption = {
  value: string;
  label: string;
};

type MatchRecordPageHeaderProps = {
  dateOptions: DateFilterOption[];
  pendingDateValue: string;
  onPendingDateChange: (value: string) => void;
  onSearchClick: () => void;
  className?: string;
};

/** 페이지 제목 + 날짜 필터 + 기록 검색 */
export function MatchRecordPageHeader({
  dateOptions,
  pendingDateValue,
  onPendingDateChange,
  onSearchClick,
  className,
}: MatchRecordPageHeaderProps) {
  return (
    <header
      className={cn(
        "flex w-full flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8",
        className,
      )}
    >
      {/* md 이상에서 w-full이면 flex 한 줄에서 제목이 100%를 먹어 폼이 뷰포트 밖으로 밀림 → md:w-auto */}
      <h1 className="w-full shrink-0 text-[1.75rem] font-extrabold text-Label-Primary md:w-auto md:shrink-0">
        경기 기록
      </h1>

      <form
        className="flex w-full min-w-0 flex-row flex-wrap items-end gap-3 md:w-auto md:min-w-0 md:shrink-0 md:flex-nowrap"
        role="search"
        aria-label="경기 기록 검색"
        onSubmit={(e) => {
          e.preventDefault();
          onSearchClick();
        }}
      >
        {/* sm:flex-none 이 640px부터 flex-1을 죽여서, 모바일~md 직전까지 드롭다운이 안 늘어남 → md에서만 고정 폭 */}
        <div className="min-w-0 flex-1 md:max-w-xs md:flex-none">
          <label
            id="match-record-date-label"
            htmlFor="match-record-date"
            className="sr-only"
          >
            날짜
          </label>
          <Dropdown
            options={dateOptions}
            value={pendingDateValue}
            onChange={onPendingDateChange}
            placeholder="날짜를 선택해 주세요"
            triggerId="match-record-date"
            ariaLabelledBy="match-record-date-label"
            className="w-full min-w-0"
            triggerClassName="h-10 min-h-10 rounded-xl border border-border-card bg-surface-card py-2 pl-3 pr-2 text-Label-Primary focus-visible:ring-2 focus-visible:ring-Fill_AccentPrimary"
          />
        </div>

        <Button
          type="submit"
          variant="ghost"
          size="m"
          className="w-25 min-w-25 shrink-0 self-end"
        >
          기록 검색
        </Button>
      </form>
    </header>
  );
}
