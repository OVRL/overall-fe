"use client";

import { Suspense, memo, useCallback, useMemo, useState } from "react";
import { useLazyLoadQuery } from "react-relay";
import type { findMatchAttendanceQuery } from "@/__generated__/findMatchAttendanceQuery.graphql";
import type { findMatchQuery } from "@/__generated__/findMatchQuery.graphql";
import { FindMatchAttendanceQuery } from "@/lib/relay/queries/findMatchAttendanceQuery";
import { parseMatchIdForApi } from "@/utils/match/parseMatchIdForApi";
import { findMyCommittedMatchAttendanceRow } from "./findMyCommittedMatchAttendanceRow";
import { useAttendanceVoteSubmitActions } from "./useAttendanceVoteSubmitActions";
import Skeleton from "@/components/ui/Skeleton";
import { AttendanceVoteChoiceButtons } from "./AttendanceVoteChoiceButtons";

type MatchNode = findMatchQuery["response"]["findMatch"][number];

type Props = {
  matchGraphqlId: string | number;
  teamId: number;
  userId: number | null;
  match: MatchNode;
  voteClosed: boolean;
};

function AttendanceVoteActionFooterFallback() {
  const barClass = "flex-1 h-full rounded-xl bg-gray-1000";
  return (
    <div
      className="flex gap-3 h-14 mb-3"
      role="status"
      aria-busy
      aria-label="투표 영역 불러오는 중"
    >
      <Skeleton className={barClass} aria-hidden />
      <Skeleton className={barClass} aria-hidden />
    </div>
  );
}

function AttendanceVoteActionFooterLoaded({
  matchId,
  teamId,
  userId,
  match,
  voteClosed,
}: {
  matchId: number;
  teamId: number;
  userId: number | null;
  match: MatchNode;
  voteClosed: boolean;
}) {
  const data = useLazyLoadQuery<findMatchAttendanceQuery>(
    FindMatchAttendanceQuery,
    { matchId, teamId },
    { fetchPolicy: "store-or-network" },
  );

  const myCommittedRow = useMemo(
    () =>
      findMyCommittedMatchAttendanceRow(
        data.findMatchAttendance ?? [],
        userId,
      ),
    [data.findMatchAttendance, userId],
  );

  const [wantsRevote, setWantsRevote] = useState(false);
  const onRevoteComplete = useCallback(() => setWantsRevote(false), []);

  const { handleAttend, handleAbsent, isInFlight, pendingVoteChoice } =
    useAttendanceVoteSubmitActions(match, teamId, userId, {
      myCommittedRow,
      wantsRevote,
      onRevoteComplete,
    });

  const hasVoted = myCommittedRow != null;
  const showRevoteEntry = hasVoted && !wantsRevote && !voteClosed;

  return (
    <AttendanceVoteChoiceButtons
      voteClosed={voteClosed}
      isInFlight={isInFlight}
      pendingVoteChoice={pendingVoteChoice}
      showRevoteEntry={showRevoteEntry}
      onRequestRevote={() => setWantsRevote(true)}
      onAbsent={handleAbsent}
      onAttend={handleAttend}
    />
  );
}

function AttendanceVoteActionFooterSlotInner({
  matchGraphqlId,
  teamId,
  userId,
  match,
  voteClosed,
}: Props) {
  const matchId = parseMatchIdForApi(matchGraphqlId);

  if (matchId == null) {
    return (
      <p className="text-Label-Tertiary text-sm mb-3">
        경기 ID를 확인할 수 없어 투표할 수 없습니다.
      </p>
    );
  }

  return (
    <Suspense fallback={<AttendanceVoteActionFooterFallback />}>
      <AttendanceVoteActionFooterLoaded
        matchId={matchId}
        teamId={teamId}
        userId={userId}
        match={match}
        voteClosed={voteClosed}
      />
    </Suspense>
  );
}

export const AttendanceVoteActionFooterSlot = memo(
  AttendanceVoteActionFooterSlotInner,
);
