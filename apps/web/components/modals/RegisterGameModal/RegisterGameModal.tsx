"use client";

import { useCallback, useEffect } from "react";
import { useWatch, type FieldErrors } from "react-hook-form";
import Button from "@/components/ui/Button";
import { PendingActionButton } from "@/components/ui/PendingActionButton";
import ModalLayout from "../ModalLayout";
import ModalLoadingFallback from "../ModalLoadingFallback";
import useModal from "@/hooks/useModal";
import { useUserId } from "@/hooks/useUserId";
import { toast } from "@/lib/toast";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import {
  useRegisterGameForm,
  useRegisterGameModals,
  useRegisterGameSubmit,
} from "./hooks";
import type { RegisterGameValues } from "./schema";
import {
  MatchTypeSection,
  ScheduleSection,
  VenueSection,
  QuarterSection,
  VoteDeadlineSection,
  MatchOnlySection,
  MemoSection,
} from "./sections";

/**
 * react-hook-form FieldErrors에서 첫 메시지를 추출 (중첩 필드·venue 등 포함)
 */
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

function RegisterGameFormContent() {
  const { hideModal } = useModal();
  const formState = useRegisterGameForm();
  const { control, handleSubmit, setValue, getValues, resetToDefaults } =
    formState;
  const { selectedTeamIdNum } = useSelectedTeamId();
  const { handleAddressClick } = useRegisterGameModals({
    setValue,
  });
  const { onSubmit, isInFlight } = useRegisterGameSubmit({
    selectedTeamIdNum,
    hideModal,
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
    if (currentMatchType !== "MATCH") {
      setValue("opponentName", "", { shouldValidate: true });
      setValue("opponentTeamId", null, { shouldValidate: true });
    } else {
      setValue("opponentTeamId", null, { shouldValidate: true });
    }
  }, [currentMatchType, setValue]);

  const onClose = () => {
    resetToDefaults();
    hideModal();
  };

  return (
    <ModalLayout
      title="경기 등록"
      onClose={resetToDefaults}
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

            <div className="flex gap-3 pt-4 w-full">
              <Button
                type="button"
                variant="ghost"
                size="xl"
                className="flex-1 font-bold rounded-[4px]"
                onClick={onClose}
              >
                취소
              </Button>
              <PendingActionButton
                type="submit"
                variant="primary"
                size="xl"
                className="flex-1 font-bold rounded-[4px]"
                pending={isInFlight}
                pendingLabel="등록 중"
              >
                등록
              </PendingActionButton>
            </div>
          </form>
        </div>
      </div>
    </ModalLayout>
  );
}

export default function RegisterGameModal() {
  const userId = useUserId();
  if (userId === null) {
    return <ModalLoadingFallback />;
  }
  return <RegisterGameFormContent />;
}
