"use client";

import Button from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type PendingChoice = "ATTEND" | "ABSENT" | null;

type Props = {
  voteClosed: boolean;
  isInFlight: boolean;
  pendingVoteChoice: PendingChoice;
  onAbsent: () => void;
  onAttend: () => void;
};

/**
 * 참석 투표 모달 하단: 마감 안내 + 불참/참석 버튼 (로딩·비활성 상태 포함)
 */
export function AttendanceVoteChoiceButtons({
  voteClosed,
  isInFlight,
  pendingVoteChoice,
  onAbsent,
  onAttend,
}: Props) {
  const voteButtonsDisabled = voteClosed || isInFlight;

  return (
    <div className="flex flex-col gap-2 mb-3">
      {voteClosed ? (
        <p className="text-center text-sm text-Label-Tertiary">
          투표 마감 시간이 지나 참석·불참 투표를 할 수 없습니다.
        </p>
      ) : null}
      <div className="flex gap-3 h-14">
        <Button
          variant="ghost"
          size="xl"
          className="flex-1"
          onClick={onAbsent}
          disabled={voteButtonsDisabled}
          aria-busy={isInFlight && pendingVoteChoice === "ABSENT"}
        >
          {isInFlight && pendingVoteChoice === "ABSENT" ? (
            <LoadingSpinner label="불참 투표 처리 중" size="sm" />
          ) : (
            "불참"
          )}
        </Button>
        <Button
          variant="primary"
          size="xl"
          className="flex-1 bg-red-500 text-Label-Primary"
          onClick={onAttend}
          disabled={voteButtonsDisabled}
          aria-busy={isInFlight && pendingVoteChoice === "ATTEND"}
        >
          {isInFlight && pendingVoteChoice === "ATTEND" ? (
            <LoadingSpinner label="참석 투표 처리 중" size="sm" />
          ) : (
            "참석"
          )}
        </Button>
      </div>
    </div>
  );
}
