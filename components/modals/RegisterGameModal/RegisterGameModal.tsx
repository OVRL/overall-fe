"use client";

import { useId, useEffect } from "react";
import { Controller, useWatch, type SubmitHandler } from "react-hook-form";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Button from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Dropdown from "@/components/ui/Dropdown";
import { DatePicker } from "@/components/ui/date/DatePicker";
import { TimePicker } from "@/components/ui/date/TimePicker";
import ModalLayout from "../ModalLayout";
import ModalLoadingFallback from "../ModalLoadingFallback";
import useModal from "@/hooks/useModal";
import { useUserId } from "@/hooks/useUserId";
import FormSection from "./FormSection";
import SegmentToggle from "./SegmentToggle";
import {
  MATCH_TYPE_OPTIONS,
  QUARTER_COUNT_OPTIONS,
  QUARTER_DURATION_OPTIONS,
  VOTE_DEADLINE_OPTIONS,
} from "./constants";
import TextField from "@/components/ui/TextField";
import location from "@/public/icons/location.svg";
import type { RegisterGameValues } from "./schema";
import { useRegisterGameForm } from "./useRegisterGameForm";
import UniformOption from "./UniformOption";
import { getUniformImagePath } from "@/app/create-team/_lib/uniformDesign";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { useCreateMatchMutation } from "./useCreateMatchMutation";
import { computeVoteDeadlineDateTime } from "./voteDeadline";
import { toast } from "@/lib/toast";

const NaverDynamicMap = dynamic(
  () => import("@/components/ui/map/NaverDynamicMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-sm aspect-square mx-auto rounded-[0.625rem] bg-Fill_Tertiary flex items-center justify-center text-Label-Tertiary text-sm">
        지도 정보를 불러오는 중...
      </div>
    ),
  },
);

function RegisterGameFormContent() {
  const { hideModal } = useModal();
  const { openModal: openAddressModal, hideModal: hideAddressModal } = useModal(
    "DETAIL_ADDRESS_SEARCH",
  );
  const id = useId();
  const { form, resetToDefaults } = useRegisterGameForm();
  const { control, handleSubmit, setValue } = form;
  const { selectedTeamId } = useSelectedTeamId();
  const createdTeamId =
    selectedTeamId != null && selectedTeamId !== ""
      ? Number(selectedTeamId)
      : null;
  const createdTeamIdValid =
    createdTeamId != null && !Number.isNaN(createdTeamId);
  const { executeMutation, isInFlight } = useCreateMatchMutation();

  const currentVenue = useWatch({ control, name: "venue" });
  const currentMatchType = useWatch({ control, name: "matchType" });

  useEffect(() => {
    if (currentMatchType !== "MATCH") {
      setValue("opponentName", "", { shouldValidate: true });
    }
  }, [currentMatchType, setValue]);

  const handleAddressClick = () => {
    openAddressModal({
      onComplete: (result: {
        address: string;
        latitude: number;
        longitude: number;
      }) => {
        setValue(
          "venue",
          {
            address: result.address,
            latitude: result.latitude,
            longitude: result.longitude,
          },
          { shouldValidate: true },
        );
        hideAddressModal();
      },
    });
  };

  const onValid: SubmitHandler<RegisterGameValues> = (data) => {
    const teamIdForMatch =
      createdTeamIdValid && createdTeamId != null ? createdTeamId : null;
    if (teamIdForMatch == null) {
      toast.error("팀을 선택해 주세요. 헤더에서 소속 팀을 선택한 뒤 다시 시도해 주세요.");
      return;
    }
    executeMutation({
      variables: {
        input: {
          createdTeamId: teamIdForMatch,
          description: data.description?.trim() || null,
          endTime: data.endTime,
          matchDate: data.startDate,
          matchType: data.matchType,
          opponentTeamId: null,
          quarterCount: data.quarterCount,
          quarterDuration: data.quarterDuration,
          startTime: data.startTime,
          uniformType: data.uniformType ?? null,
          venue: {
            address: data.venue.address,
            latitude: data.venue.latitude,
            longitude: data.venue.longitude,
          },
          voteDeadline: computeVoteDeadlineDateTime(
            data.startDate,
            data.voteDeadline,
          ),
        },
      },
      onCompleted: () => {
        toast.success("경기 등록이 완료되었습니다.");
        hideModal();
      },
      onError: (err) => {
        toast.error(err.message ?? "경기 등록에 실패했습니다.");
      },
    });
  };

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
            onSubmit={handleSubmit(onValid)}
            className="flex flex-col gap-y-8"
            noValidate
          >
            <FormSection label="경기 성격">
              <Controller
                name="matchType"
                control={control}
                render={({ field }) => (
                  <SegmentToggle
                    options={MATCH_TYPE_OPTIONS}
                    value={field.value}
                    onChange={(value) => {
                      if (value === "MATCH") {
                        toast("추후 추가될 예정입니다.");
                        return;
                      }
                      field.onChange(value);
                    }}
                  />
                )}
              />
            </FormSection>

            <AnimatePresence>
              {currentMatchType === "MATCH" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Controller
                    name="opponentName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="상대팀"
                        placeholder="상대팀 이름을 입력해주세요."
                        showBorderBottom={false}
                        maxLength={30}
                        onClear={() => field.onChange("")}
                        onChange={(e) => {
                          const filteredValue = e.target.value.replace(
                            /[^a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ\s]/g,
                            "",
                          );
                          field.onChange(filteredValue);
                        }}
                      />
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <FormSection label="일정">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => {
                          const next = date ? format(date, "yyyy-MM-dd") : "";
                          field.onChange(next);
                          if (next)
                            setValue("endDate", next, { shouldValidate: true });
                        }}
                        placeholder="시작 날짜 선택"
                        className="min-w-0 h-12 w-full"
                      />
                    )}
                  />
                  <Controller
                    name="startTime"
                    control={control}
                    render={({ field }) => (
                      <TimePicker
                        id={`${id}-start-time`}
                        value={field.value}
                        onChange={field.onChange}
                        aria-label="시작 시간 선택"
                        className="min-w-0 w-full"
                      />
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => {
                      const startDate = form.getValues("startDate");
                      return (
                        <DatePicker
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          onChange={(date) => {
                            const next = date ? format(date, "yyyy-MM-dd") : "";
                            field.onChange(next);
                            if (next && startDate && next < startDate) {
                              setValue("startDate", next, {
                                shouldValidate: true,
                              });
                            }
                          }}
                          placeholder="종료 날짜 선택"
                          className="min-w-0 h-12 w-full"
                        />
                      );
                    }}
                  />
                  <Controller
                    name="endTime"
                    control={control}
                    render={({ field }) => (
                      <TimePicker
                        id={`${id}-end-time`}
                        value={field.value}
                        onChange={field.onChange}
                        aria-label="종료 시간 선택"
                        className="min-w-0 w-full"
                      />
                    )}
                  />
                </div>
              </div>
            </FormSection>

            <Controller
              name="venue"
              control={control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-4">
                  <div onClick={handleAddressClick} className="cursor-pointer">
                    <TextField
                      label="경기 장소"
                      placeholder="경기 장소를 검색하세요"
                      className="text-Fill_Primary pointer-events-none"
                      showBorderBottom={false}
                      leftIcon={location}
                      errorMessage={
                        (
                          fieldState.error as unknown as {
                            address?: { message?: string };
                          }
                        )?.address?.message || fieldState.error?.message
                      }
                      value={field.value?.address || ""}
                      name={field.name}
                      readOnly
                    />
                  </div>
                  {currentVenue?.latitude !== undefined &&
                    currentVenue?.longitude !== undefined &&
                    currentVenue.latitude !== 0 &&
                    currentVenue.longitude !== 0 && (
                      <NaverDynamicMap
                        latitude={currentVenue.latitude}
                        longitude={currentVenue.longitude}
                      />
                    )}
                </div>
              )}
            />

            <FormSection label="쿼터">
              <div className="grid grid-cols-2 gap-2">
                <Controller
                  name="quarterCount"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      options={QUARTER_COUNT_OPTIONS}
                      value={String(field.value)}
                      onChange={(val) => field.onChange(Number(val))}
                      placeholder="쿼터 수"
                      className="w-full"
                    />
                  )}
                />
                <Controller
                  name="quarterDuration"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      options={QUARTER_DURATION_OPTIONS}
                      value={String(field.value)}
                      onChange={(val) => field.onChange(Number(val))}
                      placeholder="시간"
                      className="w-full"
                    />
                  )}
                />
              </div>
            </FormSection>

            <FormSection label="투표 마감 일정">
              <Controller
                name="voteDeadline"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={VOTE_DEADLINE_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="선택해주세요"
                    className="w-full"
                  />
                )}
              />
            </FormSection>

            <AnimatePresence>
              {currentMatchType === "MATCH" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <FormSection label="유니폼">
                    <Controller
                      name="uniformType"
                      control={control}
                      render={({ field }) => (
                        <div className="flex gap-6">
                          <UniformOption
                            type="HOME"
                            label="홈"
                            isSelected={field.value === "HOME"}
                            onSelect={() => field.onChange("HOME")}
                            imagePath={getUniformImagePath("SOLID_RED")}
                          />
                          <UniformOption
                            type="AWAY"
                            label="어웨이"
                            isSelected={field.value === "AWAY"}
                            onSelect={() => field.onChange("AWAY")}
                            imagePath={getUniformImagePath("SOLID_BLUE")}
                          />
                        </div>
                      )}
                    />
                  </FormSection>
                </motion.div>
              )}
            </AnimatePresence>

            <FormSection label="메모">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    id={`${id}-description`}
                    placeholder="추가 메모사항을 입력하세요."
                    rows={3}
                    maxLength={100}
                    className="w-full px-4 py-3 bg-Fill_Quatiary border border-transparent rounded-[0.625rem] text-sm text-Label-Primary placeholder:text-Label-Tertiary outline-none focus:border-Fill_AccentPrimary transition-colors resize-none"
                  />
                )}
              />
            </FormSection>

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
