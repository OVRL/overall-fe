"use client";

import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import Button from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import ModalLayout from "../ModalLayout";
import ModalLoadingFallback from "../ModalLoadingFallback";
import useModal from "@/hooks/useModal";
import { useUserId } from "@/hooks/useUserId";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import {
  useRegisterGameForm,
  useRegisterGameModals,
  useRegisterGameSubmit,
} from "./hooks";
import {
  MatchTypeSection,
  ScheduleSection,
  VenueSection,
  QuarterSection,
  VoteDeadlineSection,
  MatchOnlySection,
  MemoSection,
} from "./sections";

function RegisterGameFormContent() {
  const { hideModal } = useModal();
  const formState = useRegisterGameForm();
  const { control, handleSubmit, setValue, getValues, resetToDefaults } =
    formState;
  const { selectedTeamIdNum } = useSelectedTeamId();
  const { handleAddressClick, handleOpponentTeamClick } = useRegisterGameModals({
    setValue,
  });
  const { onSubmit, isInFlight } = useRegisterGameSubmit({
    selectedTeamIdNum,
    hideModal,
  });

  const currentVenue = useWatch({ control, name: "venue" });
  const currentMatchType = useWatch({ control, name: "matchType" });

  useEffect(() => {
    if (currentMatchType !== "MATCH") {
      setValue("opponentName", "", { shouldValidate: true });
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
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-8"
            noValidate
          >
            <MatchTypeSection control={control} />

            <MatchOnlySection
              control={control}
              isMatch={currentMatchType === "MATCH"}
              onOpponentTeamClick={handleOpponentTeamClick}
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
              <Button
                type="submit"
                variant="primary"
                size="xl"
                className="flex-1"
                disabled={isInFlight}
              >
                {isInFlight ? (
                  <LoadingSpinner label="등록 중" size="sm" />
                ) : (
                  "등록"
                )}
              </Button>
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

export default function RegisterGameModal() {
  const userId = useUserId();
  if (userId === null) {
    return <ModalLoadingFallback />;
  }
  return <RegisterGameFormContent />;
}
