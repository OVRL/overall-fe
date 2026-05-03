"use client";

import { Suspense, useMemo, useState } from "react";
import { useLazyLoadQuery } from "react-relay";
import type { momVoteModalQuery } from "@/__generated__/momVoteModalQuery.graphql";
import ModalLayout from "@/components/modals/ModalLayout";
import { PendingActionButton } from "@/components/ui/PendingActionButton";
import useModal from "@/hooks/useModal";
import { useUserId } from "@/hooks/useUserId";
import { getGraphQLErrorMessage } from "@/lib/relay/getGraphQLErrorMessage";
import { MomVoteModalQuery } from "@/lib/relay/queries/momVoteModalQuery";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { MomVoteMockMatchInfoCard } from "./MomVoteMockMatchInfoCard";
import { MomVoteRankPicker } from "./MomVoteRankPicker";
import {
  buildMomVoteCandidateOptions,
  optionsExcludingOthers,
  picksToCandidateUserIds,
  withOptionForValue,
} from "./momVotePickerUtils";
import {
  pickLabelFromRow,
  sortMyMatchMomVotes,
} from "./momVoteMyVotesMapping";
import { useCreateMatchMomVoteMutation } from "./useCreateMatchMomVoteMutation";
import { useMomVotePicksState } from "./useMomVotePicksState";
import { useUpdateMatchMomVoteMutation } from "./useUpdateMatchMomVoteMutation";

const WRAPPER_CLASS =
  "md:w-100 max-w-[22rem] gap-y-4 p-5 bg-surface-card border-border-card";

type MomVoteModalProps = {
  matchId: number;
  teamId: number;
};

function MomVoteModalLoaded({ matchId, teamId }: MomVoteModalProps) {
  const { hideModal } = useModal();
  const currentUserId = useUserId();
  /** 모달이 열릴 때마다 마운트가 새로 되므로, 세션당 1회만 생성 → Relay fetchKey가 달라져 이전 스냅샷에 묶이지 않음 */
  const [querySessionId] = useState(
    () =>
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const data = useLazyLoadQuery<momVoteModalQuery>(
    MomVoteModalQuery,
    { matchId, teamId },
    {
      // 캐시가 있어도 네트워크에서 최신화; 재오픈 시 querySessionId로 별도 리텐션
      fetchPolicy: "store-and-network",
      fetchKey: `${matchId}-${teamId}-${querySessionId}-${refreshKey}`,
    },
  );

  const { executeMutation: executeCreate, isInFlight: isCreateInFlight } =
    useCreateMatchMomVoteMutation();
  const { executeMutation: executeUpdate, isInFlight: isUpdateInFlight } =
    useUpdateMatchMomVoteMutation();

  const isMutating = isCreateInFlight || isUpdateInFlight;

  const myVotes = data.findMyMatchMom ?? [];

  const {
    hasVoted,
    top1,
    top2,
    top3,
    setTop1,
    setTop2,
    setTop3,
    picksDisabled,
    isRevoteEditing,
    beginRevoteEditing,
  } = useMomVotePicksState({ myVotes, refreshKey });

  const sortedMyVotes = useMemo(
    () => sortMyMatchMomVotes(myVotes),
    [myVotes],
  );

  const baseOptions = useMemo(
    () =>
      buildMomVoteCandidateOptions(
        data.findMatchAttendance ?? [],
        matchId,
        { excludeUserId: currentUserId },
      ),
    [data.findMatchAttendance, matchId, currentUserId],
  );

  const opt1 = useMemo(() => {
    const blocked = optionsExcludingOthers(baseOptions, top1, [top2, top3]);
    return withOptionForValue(
      blocked,
      top1,
      sortedMyVotes[0] ? pickLabelFromRow(sortedMyVotes[0]) : "후보",
    );
  }, [baseOptions, top1, top2, top3, sortedMyVotes]);

  const opt2 = useMemo(() => {
    const blocked = optionsExcludingOthers(baseOptions, top2, [top1, top3]);
    return withOptionForValue(
      blocked,
      top2,
      sortedMyVotes[1] ? pickLabelFromRow(sortedMyVotes[1]) : "후보",
    );
  }, [baseOptions, top1, top2, top3, sortedMyVotes]);

  const opt3 = useMemo(() => {
    const blocked = optionsExcludingOthers(baseOptions, top3, [top1, top2]);
    return withOptionForValue(
      blocked,
      top3,
      sortedMyVotes[2] ? pickLabelFromRow(sortedMyVotes[2]) : "후보",
    );
  }, [baseOptions, top1, top2, top3, sortedMyVotes]);

  const distinct =
    top1 != null &&
    top2 != null &&
    top3 != null &&
    new Set([top1, top2, top3]).size === 3;

  const enoughCandidates = baseOptions.length >= 3;
  const canSubmitVote = distinct && enoughCandidates;

  const isRevoteLockedView = hasVoted && !isRevoteEditing;

  const primaryDisabled =
    currentUserId == null ||
    isMutating ||
    (!isRevoteLockedView && !canSubmitVote);

  const onPrimaryClick = () => {
    if (currentUserId == null) return;
    if (isRevoteLockedView) {
      beginRevoteEditing();
      return;
    }
    if (!canSubmitVote) return;

    const candidateUserIds = picksToCandidateUserIds(top1, top2, top3);
    if (candidateUserIds.length !== 3) {
      toast.error("팀원 후보 3명을 모두 선택해 주세요.");
      return;
    }

    const onError = (err: Error) => {
      toast.error(
        getGraphQLErrorMessage(err, "MOM 투표 처리 중 오류가 발생했습니다."),
      );
    };

    const bump = () => setRefreshKey((k) => k + 1);

    const input = {
      matchId,
      teamId,
      candidateUserIds,
    };

    const onSuccess = () => {
      toast.success("투표를 완료했습니다.");
      bump();
      hideModal();
    };

    if (hasVoted) {
      executeUpdate({
        variables: { input },
        onCompleted: onSuccess,
        onError,
      });
      return;
    }

    executeCreate({
      variables: { input },
      onCompleted: onSuccess,
      onError,
    });
  };

  return (
    <ModalLayout title="MOM 투표" wrapperClassName={WRAPPER_CLASS}>
      <div className="flex flex-col gap-5 -mt-2">
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-Label-Primary">경기 정보</p>
          <MomVoteMockMatchInfoCard result="win" />
        </section>

        <section className="flex flex-col gap-4 mb-20">
          {currentUserId == null ? (
            <p className="text-sm text-Label-Tertiary">
              로그인 후 투표할 수 있습니다.
            </p>
          ) : baseOptions.length < 3 ? (
            <p className="text-sm text-Label-Tertiary">
              투표 가능한 후보가 3명 미만입니다.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {(
                [
                  {
                    rank: 1 as const,
                    options: opt1,
                    value: top1,
                    onChange: setTop1,
                  },
                  {
                    rank: 2 as const,
                    options: opt2,
                    value: top2,
                    onChange: setTop2,
                  },
                  {
                    rank: 3 as const,
                    options: opt3,
                    value: top3,
                    onChange: setTop3,
                  },
                ] as const
              ).map(({ rank, options, value, onChange }) => (
                <MomVoteRankPicker
                  key={rank}
                  rank={rank}
                  options={options}
                  value={value}
                  onChange={onChange}
                  disabled={picksDisabled}
                />
              ))}
            </div>
          )}
        </section>

        <PendingActionButton
          variant="primary"
          size="xl"
          className={cn(
            "font-semibold",
            isRevoteLockedView && "bg-red-500 text-Label-Primary",
          )}
          disabled={primaryDisabled}
          onClick={onPrimaryClick}
          pending={isMutating}
          pendingLabel="MOM 투표 처리 중"
        >
          {isRevoteLockedView ? "재투표하기" : "투표하기"}
        </PendingActionButton>
      </div>
    </ModalLayout>
  );
}

function MomVoteModalFallback() {
  return (
    <ModalLayout title="MOM 투표" wrapperClassName={WRAPPER_CLASS}>
      <div className="flex flex-col gap-3 animate-pulse -mt-2">
        <div className="h-28 rounded-xl bg-Fill_Quatiary" />
        <div className="h-12 rounded-[0.625rem] bg-Fill_Quatiary" />
        <div className="h-12 rounded-[0.625rem] bg-Fill_Quatiary" />
        <div className="h-12 rounded-[0.625rem] bg-Fill_Quatiary" />
        <div className="h-12 rounded-xl bg-Fill_Quatiary" />
      </div>
    </ModalLayout>
  );
}

/**
 * 홈 직전 경기 MOM 투표 — 참석자·내 투표(findMyMatchMom) 조회 후 createMatchMom / updateMatchMom.
 */
export default function MomVoteModal({ matchId, teamId }: MomVoteModalProps) {
  return (
    <Suspense fallback={<MomVoteModalFallback />}>
      <MomVoteModalLoaded
        key={`${matchId}-${teamId}`}
        matchId={matchId}
        teamId={teamId}
      />
    </Suspense>
  );
}
