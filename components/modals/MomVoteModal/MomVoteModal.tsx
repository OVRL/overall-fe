"use client";

import { Suspense, useMemo, useState } from "react";
import { useLazyLoadQuery } from "react-relay";
import type { findMatchAttendanceQuery } from "@/__generated__/findMatchAttendanceQuery.graphql";
import ModalLayout from "@/components/modals/ModalLayout";
import Button from "@/components/ui/Button";
import useModal from "@/hooks/useModal";
import { FindMatchAttendanceQuery } from "@/lib/relay/queries/findMatchAttendanceQuery";
import { toast } from "@/lib/toast";
import { MomVoteMatchInfoCard } from "./MomVoteMockMatchInfoCard";
import { MomVoteRankPicker } from "./MomVoteRankPicker";
import { buildPlayerOptions, optionsExcludingOthers } from "./momVotePickerUtils";
import { useCreateMatchMomMutation } from "./hooks/useCreateMatchMomMutation";

const WRAPPER_CLASS =
  "md:w-100 max-w-[22rem] gap-y-4 p-5 bg-surface-card border-border-card";

type MomVoteModalProps = {
  matchId: number;
  teamId: number;
};

function MomVoteModalLoaded({ matchId, teamId }: MomVoteModalProps) {
  const { hideModal } = useModal();
  const data = useLazyLoadQuery<findMatchAttendanceQuery>(
    FindMatchAttendanceQuery,
    { matchId, teamId },
    { fetchPolicy: "store-or-network" },
  );

  const { executeMutation, isInFlight } = useCreateMatchMomMutation();
  const matchInfo = data.findMatchAttendance?.[0]?.match;

  const allOptions = useMemo(
    () => buildPlayerOptions(data.findMatchAttendance ?? []),
    [data.findMatchAttendance],
  );

  const [top1, setTop1] = useState<string | undefined>();
  const [top2, setTop2] = useState<string | undefined>();
  const [top3, setTop3] = useState<string | undefined>();

  const opt1 = optionsExcludingOthers(allOptions, top1, [top2, top3]);
  const opt2 = optionsExcludingOthers(allOptions, top2, [top1, top3]);
  const opt3 = optionsExcludingOthers(allOptions, top3, [top1, top2]);

  const distinct =
    top1 != null &&
    top2 != null &&
    top3 != null &&
    new Set([top1, top2, top3]).size === 3;
  const canSubmit = distinct && allOptions.length >= 3;

  const onVote = async () => {
    if (!canSubmit) return;
    try {
      const candidateUserIds = [Number(top1), Number(top2), Number(top3)];
      await executeMutation({
        matchId,
        teamId,
        candidateUserIds,
      });
      toast.success("MOM 투표가 완료되었습니다!");
      hideModal();
    } catch (error) {
      console.error("[MomVote] Failed to vote:", error);
      toast.error("투표 중 오류가 발생했습니다.");
    }
  };

  return (
    <ModalLayout title="MOM 투표" wrapperClassName={WRAPPER_CLASS}>
      <div className="flex flex-col gap-5 -mt-2">
        <section className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-Label-Primary">경기 정보</p>
          <MomVoteMatchInfoCard 
            matchDate={matchInfo?.matchDate}
            startTime={matchInfo?.startTime || ""}
            opponentName={matchInfo?.opponentTeam?.name}
            teamName={matchInfo?.teamName}
            description={matchInfo?.description}
            voteDeadline={matchInfo?.voteDeadline}
          />
        </section>

        <section className="flex flex-col gap-4 mb-20">
          {allOptions.length === 0 ? (
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
                />
              ))}
            </div>
          )}
        </section>

        <Button
          variant="primary"
          size="xl"
          className="font-semibold"
          disabled={!canSubmit || isInFlight}
          onClick={onVote}
        >
          {isInFlight ? "투표 중..." : "투표하기"}
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
 * 홈 직전 경기 MOM 투표 — 모달 오픈 시 findMatchAttendance로 참석자 목록 조회.
 */
export default function MomVoteModal({ matchId, teamId }: MomVoteModalProps) {
  return (
    <Suspense fallback={<MomVoteModalFallback />}>
      <MomVoteModalLoaded matchId={matchId} teamId={teamId} />
    </Suspense>
  );
}
