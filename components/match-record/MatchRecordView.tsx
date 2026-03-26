"use client";

import { useMemo, useState } from "react";
import { MOCK_MATCH_RECORDS } from "./mockMatchRecords";
import { MatchRecordPageHeader } from "./MatchRecordPageHeader";
import { MatchAccordionList } from "./MatchAccordionList";

/** /match-record 클라이언트 화면 (필터 + 목록) */
export default function MatchRecordView() {
  const [pendingDate, setPendingDate] = useState<string>("all");
  const [appliedDate, setAppliedDate] = useState<string>("all");

  const dateOptions = useMemo(() => {
    const unique = [
      ...new Set(MOCK_MATCH_RECORDS.map((r) => r.dateLabel)),
    ].sort();
    return [
      { value: "all", label: "전체" },
      ...unique.map((label) => ({ value: label, label })),
    ];
  }, []);

  const filteredRecords = useMemo(() => {
    if (appliedDate === "all") return MOCK_MATCH_RECORDS;
    return MOCK_MATCH_RECORDS.filter((r) => r.dateLabel === appliedDate);
  }, [appliedDate]);

  return (
    <main className="mx-auto w-full max-w-300 px-4 py-6 md:px-8 md:py-8">
      <MatchRecordPageHeader
        dateOptions={dateOptions}
        pendingDateValue={pendingDate}
        onPendingDateChange={setPendingDate}
        onSearchClick={() => setAppliedDate(pendingDate)}
        className="mb-8"
      />
      <MatchAccordionList records={filteredRecords} />
    </main>
  );
}
