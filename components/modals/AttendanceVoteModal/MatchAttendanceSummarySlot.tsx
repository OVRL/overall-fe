"use client";

import { Suspense, memo } from "react";
import { parseMatchIdForApi } from "@/utils/match/parseMatchIdForApi";
import { MatchAttendanceSummary } from "./MatchAttendanceSummary";

type Props = {
  /** findMatch MatchModel.id (GraphQL ID 스칼라) */
  matchGraphqlId: string;
  teamId: number;
  currentUserId: number | null;
};

/** Suspense: 참석 인원 쿼리 로딩 중 */
function MatchAttendanceSummaryFallback() {
  return (
    <span className="text-gray-100 text-sm font-semibold opacity-50">
      참석 인원 불러오는 중…
    </span>
  );
}

/**
 * 참석 요약: ID 파싱 → 유효 시 Suspense 경계와 함께 쿼리 컴포넌트 마운트.
 * 모달 본문은 배치만 담당하고, 비동기·폴백 정책은 이 슬롯이 책임집니다.
 */
function MatchAttendanceSummarySlotInner({
  matchGraphqlId,
  teamId,
  currentUserId,
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
      <MatchAttendanceSummary
        matchId={matchId}
        teamId={teamId}
        currentUserId={currentUserId}
      />
    </Suspense>
  );
}

export const MatchAttendanceSummarySlot = memo(MatchAttendanceSummarySlotInner);
