"use client";

import { Suspense, useMemo, useState } from "react";
import { useLazyLoadQuery } from "react-relay";
import type { momVoteModalQuery } from "@/__generated__/momVoteModalQuery.graphql";
import ModalLayout from "@/components/modals/ModalLayout";
import Button from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
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
  parseMomVoteSelectionToCandidateInput,
} from "./momVotePickerUtils";
import { useCreateMatchMomVoteMutation } from "./useCreateMatchMomVoteMutation";
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
  const [refreshKey, setRefreshKey] = useState(0);

  const data = useLazyLoadQuery<momVoteModalQuery>(
    MomVoteModalQuery,
    { matchId, teamId },
    {
      fetchPolicy: "store-or-network",
      fetchKey: `${matchId}-${teamId}-${refreshKey}`,
    },
  );

  const { executeMutation: executeCreate, isInFlight: isCreateInFlight } =
    useCreateMatchMomVoteMutation();
  const { executeMutation: executeUpdate, isInFlight: isUpdateInFlight } =
    useUpdateMatchMomVoteMutation();

  const isMutating = isCreateInFlight || isUpdateInFlight;

  const allOptions = useMemo(
    () =>
      buildMomVoteCandidateOptions(
        data.findMatchAttendance ?? [],
        data.matchMercenaries ?? [],
        matchId,
      ),
    [data.findMatchAttendance, data.matchMercenaries, matchId],
  );

  const myVoteRecord = data.findMyMatchMomVote ?? null;
  const matchMomRows = data.matchMomVotes ?? [];

  /** 집계 행의 candidateUserId가 내 userId와 같으면(요청하신 휴리스틱) 재투표 UI 톤 */
  const userRuleSuggestsRevote =
    currentUserId != null &&
    matchMomRows.some(
      (r) =>
        r.candidateUserId != null && r.candidateUserId === currentUserId,
    );

  const showRevoteUi = myVoteRecord != null || userRuleSuggestsRevote;

  /** 서버에 저장된 내 투표(TOP1만 API 반영) — 사용자 선택으로 덮어쓸 수 있음 */
  const serverTop1 = useMemo(() => {
    const row = data.findMyMatchMomVote;
    if (!row) return undefined;
    if (row.candidateMercenaryId != null) return `m:${row.candidateMercenaryId}`;
    if (row.candidateUserId != null) return String(row.candidateUserId);
    return undefined;
  }, [data.findMyMatchMomVote]);

  /** undefined면 serverTop1을 따름 */
  const [top1Override, setTop1Override] = useState<string | undefined>(
    undefined,
  );
  const [top2, setTop2] = useState<string | undefined>();
  const [top3, setTop3] = useState<string | undefined>();

  const top1 =
    top1Override !== undefined ? top1Override : serverTop1;

  const opt1 = optionsExcludingOthers(allOptions, top1, [top2, top3]);
  const opt2 = optionsExcludingOthers(allOptions, top2, [top1, top3]);
  const opt3 = optionsExcludingOthers(allOptions, top3, [top1, top2]);

  const distinct =
    top1 != null &&
    top2 != null &&
    top3 != null &&
    new Set([top1, top2, top3]).size === 3;
  const canSubmit = distinct && allOptions.length >= 3;

  const onVote = () => {
    if (!canSubmit || currentUserId == null) return;
    const fields = parseMomVoteSelectionToCandidateInput(top1!);
    if (
      fields.candidateUserId == null &&
      fields.candidateMercenaryId == null
    ) {
      toast.error("유효한 후보를 선택해 주세요.");
      return;
    }

    const onError = (err: Error) => {
      toast.error(
        getGraphQLErrorMessage(err, "MOM 투표 처리 중 오류가 발생했습니다."),
      );
    };

    const bump = () => setRefreshKey((k) => k + 1);

    if (myVoteRecord != null) {
      executeUpdate({
        variables: {
          input: {
            id: myVoteRecord.id,
            teamId,
            ...fields,
          },
        },
        onCompleted: () => {
          toast.success("MOM 투표가 수정되었습니다.");
          bump();
          hideModal();
        },
        onError,
      });
      return;
    }

    executeCreate({
      variables: {
        input: {
          matchId,
          teamId,
          ...fields,
        },
      },
      onCompleted: () => {
        toast.success("MOM 투표가 등록되었습니다.");
        bump();
        hideModal();
      },
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
          ) : allOptions.length === 0 ? (
            <p className="text-sm text-Label-Tertiary">
              이 경기에 등록된 참석자가 없습니다.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {(
                [
                  {
                    rank: 1 as const,
                    options: opt1,
                    value: top1,
                    onChange: setTop1Override,
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
                />
              ))}
            </div>
          )}
        </section>

        <Button
          variant="primary"
          size="xl"
          className={cn(
            "font-semibold",
            showRevoteUi && "bg-red-500 text-Label-Primary",
          )}
          disabled={!canSubmit || currentUserId == null || isMutating}
          onClick={onVote}
          aria-busy={isMutating}
        >
          {isMutating ? (
            <LoadingSpinner label="MOM 투표 처리 중" size="sm" />
          ) : showRevoteUi ? (
            "재투표하기"
          ) : (
            "투표하기"
          )}
        </Button>
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
 * 홈 직전 경기 MOM 투표 — 참석자·집계·내 투표(findMyMatchMomVote) 조회 후 create/update.
 * 서버 스키마에 `findMyMatchMomVote` 쿼리가 있어야 수정(update) 시 투표 id를 알 수 있습니다.
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
