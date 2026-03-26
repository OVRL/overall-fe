"use client";

import { Suspense, memo } from "react";
import { useLazyLoadQuery } from "react-relay";
import type { findMatchAttendanceQuery } from "@/__generated__/findMatchAttendanceQuery.graphql";
import { parseMatchIdForApi } from "@/utils/match/parseMatchIdForApi";
import { FindMatchAttendanceQuery } from "@/lib/relay/queries/findMatchAttendanceQuery";
import { MatchAttendanceSummaryPanel } from "./MatchAttendanceSummaryPanel";
import { cn } from "@/lib/utils";

type Props = {
  /** findMatch MatchModel.id (GraphQL ID 스칼라) */
  matchGraphqlId: string;
  teamId: number;
};

/**
 * 스키마 필드명은 findMatchAttendance 입니다.
 * (모달 요약은 동일 쿼리를 사용합니다.)
 */
function MatchAttendanceSummaryLoaded({
  matchId,
  teamId,
}: {
  matchId: number;
  teamId: number;
}) {
  const data = useLazyLoadQuery<findMatchAttendanceQuery>(
    FindMatchAttendanceQuery,
    { matchId, teamId },
    { fetchPolicy: "store-or-network" },
  );

  const rows = data.findMatchAttendance ?? [];

  return <MatchAttendanceSummaryPanel rows={rows} />;
}

/** Suspense: findMatchAttendance 로딩 중 카드형 스켈레톤 */
function MatchAttendanceSummaryFallback() {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border-card bg-surface-card",
        "divide-y divide-gray-1000",
      )}
      role="status"
      aria-busy
      aria-label="참석 현황 불러오는 중"
    >
      {[0, 1].map((i) => (
        <div key={i} className="flex flex-col gap-2 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <span className="h-4 w-10 rounded bg-gray-1000" />
            <span className="h-4 w-14 rounded bg-gray-1000" />
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-1000" />
        </div>
      ))}
    </div>
  );
}

/**
 * 참석 요약: ID 파싱 → 유효 시 Suspense와 함께 findMatchAttendance(useLazyLoadQuery) 실행.
 * 비동기·폴백·Relay 쿼리 경계는 이 슬롯이 담당하고, 표현은 MatchAttendanceSummaryPanel에 위임합니다.
 */
function MatchAttendanceSummarySlotInner({
  matchGraphqlId,
  teamId,
}: Props) {
  const matchId = parseMatchIdForApi(matchGraphqlId);

  if (matchId == null) {
    return (
      <span className="text-Label-Tertiary text-sm">
        경기 ID를 확인할 수 없어 참석 현황을 표시할 수 없습니다.
      </span>
    );
  }

  return (
    <Suspense fallback={<MatchAttendanceSummaryFallback />}>
      <MatchAttendanceSummaryLoaded matchId={matchId} teamId={teamId} />
    </Suspense>
  );
}

export const MatchAttendanceSummarySlot = memo(MatchAttendanceSummarySlotInner);
