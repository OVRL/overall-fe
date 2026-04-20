"use client";

import { ResultBadge } from "@/components/match-record/ResultBadge";
import type { MatchResult } from "@/components/match-record/types";

/** 경기 정보 API 연동 전 — 디자인 초안용 목 데이터 */
const MOCK_MATCH_INFO = {
  dateLabel: "2026. 2. 25.",
  opponentLine: "vs 레알 마드리드",
  score: "4 - 1",
  voteDeadlineLine: "2026. 2. 25 18:00 종료",
} as const;

type MomVoteMockMatchInfoCardProps = {
  /** 승·무·패 (경기 기록과 동일한 도메인 값) */
  result: MatchResult;
};

/** MOM 투표 모달 — 경기 정보(목 데이터) 카드 */
export function MomVoteMockMatchInfoCard({ result }: MomVoteMockMatchInfoCardProps) {
  return (
    <div className="rounded-[0.625rem] bg-gray-1100 p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-Label-Tertiary">
          {MOCK_MATCH_INFO.dateLabel}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 h-7.5">
          <span className="font-bold text-white">
            {MOCK_MATCH_INFO.opponentLine}
          </span>
          <span className="text-gray-400 font-bold">
            {MOCK_MATCH_INFO.score}
          </span>
          <ResultBadge result={result} className="h-full" />
        </div>
      </div>
      <div className="rounded-sm bg-gray-1200 p-2 flex gap-2.5 text-gray-600 text-[0.8125rem]">
        <span>투표마감</span>
        <p>{MOCK_MATCH_INFO.voteDeadlineLine}</p>
      </div>
    </div>
  );
}
