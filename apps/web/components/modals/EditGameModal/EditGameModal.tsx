"use client";

import { useCallback, useEffect, useMemo, Suspense } from "react";
import { useWatch, type FieldErrors } from "react-hook-form";
import { graphql, useLazyLoadQuery } from "react-relay";
import Button from "@/components/ui/Button";
import { PendingActionButton } from "@/components/ui/PendingActionButton";
import ModalLayout from "../ModalLayout";
import ModalLoadingFallback from "../ModalLoadingFallback";
import useModal from "@/hooks/useModal";
import { toast } from "@/lib/toast";
import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";

import { useEditGameForm } from "./hooks/useEditGameForm";
import { useEditGameSubmit } from "./hooks/useEditGameSubmit";
import { mapFindMatchResultToRegisterGameValues } from "./lib/mapFindMatchResultToRegisterGameValues";
import { useRegisterGameModals } from "../RegisterGameModal/hooks/useRegisterGameModals";
import type { RegisterGameValues } from "../RegisterGameModal/schema";
import {
  MatchTypeSection,
  ScheduleSection,
  VenueSection,
  QuarterSection,
  VoteDeadlineSection,
  MatchOnlySection,
  MemoSection,
} from "../RegisterGameModal/sections";

import type { EditGameModalQuery } from "@/__generated__/EditGameModalQuery.graphql";

const editGameModalQuery = graphql`
  query EditGameModalQuery($createdTeamId: Int!) {
    findMatch(createdTeamId: $createdTeamId) {
      __typename
      id
      matchDate
      startTime
      endTime
      voteDeadline
      isFormationDraft
      matchType
      quarterCount
      quarterDuration
      description
      uniformType
      teamName
      createdTeam {
        __typename
        id
        name
        emblem
        homeUniform
        awayUniform
      }
      opponentTeam {
        __typename
        id
        name
        emblem
      }
      venue {
        address
        latitude
        longitude
      }
    }
  }
`;

function getFirstFormErrorMessage(errors: unknown): string | undefined {
  if (errors == null || typeof errors !== "object") return undefined;
  const record = errors as Record<string, unknown>;
  if (
    typeof record.message === "string" &&
    record.message.trim().length > 0
  ) {
    return record.message;
  }
  for (const [key, value] of Object.entries(record)) {
    if (key === "ref") continue;
    const found = getFirstFormErrorMessage(value);
    if (found) return found;
  }
  return undefined;
}

function EditGameFormContent({
  matchId,
  teamId,
}: {
  matchId: number;
  teamId: number;
}) {
  const { hideModal } = useModal();
  
  // 패치 데이터: 팀에 종속된 모든 경기를 가져옵니다.
  const data = useLazyLoadQuery<EditGameModalQuery>(
    editGameModalQuery,
    { createdTeamId: teamId },
    { fetchPolicy: "store-or-network" },
  );

  // 일치하는 매치 찾기. id가 글로벌 ID("MatchModel:1")일 수 있으므로 파싱 후 비교
  const targetMatch = useMemo(() => {
    return data.findMatch.find((m) => {
      const numId = parseNumericIdFromRelayGlobalId(m.id);
      return numId === matchId;
    });
  }, [data.findMatch, matchId]);

  const initialValues = useMemo(() => {
    if (!targetMatch) return null;
    return mapFindMatchResultToRegisterGameValues(targetMatch);
  }, [targetMatch]);

  const formState = useEditGameForm(initialValues);
  const { control, handleSubmit, setValue, getValues, reset } = formState;
  
  const { handleAddressClick } = useRegisterGameModals({
    setValue,
  });

  const { onSubmit, isInFlight } = useEditGameSubmit({
    matchId,
    teamId,
  });

  const onSubmitInvalid = useCallback(
    (errors: FieldErrors<RegisterGameValues>) => {
      const message =
        getFirstFormErrorMessage(errors) ??
        "필수 항목을 확인한 뒤 다시 시도해 주세요.";
      toast.error(message);
    },
    [],
  );

  const currentVenue = useWatch({ control, name: "venue" });
  const currentMatchType = useWatch({ control, name: "matchType" });

  useEffect(() => {
    // 경기 성격이 내전으로 바뀐 경우 상대팀 초기화 (만약 사용자가 MATCH -> INTERNAL 전환 시)
    if (currentMatchType !== "MATCH") {
      setValue("opponentName", "", { shouldValidate: true });
      setValue("opponentTeamId", null, { shouldValidate: true });
    }
  }, [currentMatchType, setValue]);

  const onClose = () => {
    reset();
    hideModal();
  };

  if (!initialValues) {
    return (
      <ModalLayout
        title="경기 설정"
        onClose={hideModal}
        wrapperClassName="w-full md:w-full max-w-[90vw] md:max-w-112 lg:max-w-125"
      >
        <div className="flex h-40 items-center justify-center">
          해당 경기를 찾을 수 없습니다.
        </div>
      </ModalLayout>
    );
  }

  return (
    <ModalLayout
      title="경기 설정 변경"
      onClose={onClose}
      wrapperClassName="w-full md:w-full max-w-[90vw] md:max-w-112 lg:max-w-125"
    >
      <div className="max-h-[70vh] pr-3">
        <div className="max-h-[70vh] overflow-y-auto scrollbar-thin w-[calc(100%+1rem)] pr-2">
          <form
            onSubmit={handleSubmit(onSubmit, onSubmitInvalid)}
            className="flex flex-col gap-y-8"
            noValidate
          >
            <MatchTypeSection control={control} />

            <MatchOnlySection
              control={control}
              isMatch={currentMatchType === "MATCH"}
            />

            <ScheduleSection
              control={control}
              setValue={setValue}
              form={{ getValues }}
            />

            <VenueSection
              control={control}
              currentVenue={currentVenue}
              onAddressClick={handleAddressClick}
            />

            <QuarterSection control={control} />

            <VoteDeadlineSection control={control} />

            <MemoSection control={control} />

            <div className="flex gap-3 pt-2 pl-3">
              <PendingActionButton
                type="submit"
                variant="primary"
                size="xl"
                className="flex-1"
                pending={isInFlight}
                pendingLabel="수정 중"
              >
                수정
              </PendingActionButton>
              <Button
                type="button"
                variant="ghost"
                size="xl"
                className="flex-1"
                onClick={onClose}
              >
                취소
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ModalLayout>
  );
}

export default function EditGameModal({
  matchId,
  teamId,
}: {
  matchId: number;
  teamId: number;
}) {
  return (
    <Suspense fallback={<ModalLoadingFallback />}>
      <EditGameFormContent matchId={matchId} teamId={teamId} />
    </Suspense>
  );
}
