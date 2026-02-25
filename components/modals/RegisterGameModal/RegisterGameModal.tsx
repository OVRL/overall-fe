"use client";

import { useId } from "react";
import { Controller } from "react-hook-form";
import { format } from "date-fns";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import { DatePicker } from "@/components/ui/date/DatePicker";
import { TimePicker } from "@/components/ui/date/TimePicker";
import ModalLayout from "../ModalLayout";
import useModal from "@/hooks/useModal";
import FormSection from "./FormSection";
import SegmentToggle from "./SegmentToggle";
import UniformOption from "./UniformOption";
import {
  GAME_TYPE,
  UNIFORM,
  QUARTER_COUNT_OPTIONS,
  QUARTER_DURATION_OPTIONS,
  VOTE_DEADLINE_OPTIONS,
} from "./constants";
import { getUniformImagePath } from "@/app/create-team/_lib/uniformDesign";
import TextField from "@/components/ui/TextField";
import location from "@/public/icons/location.svg";
import type { RegisterGameValues } from "./schema";
import { useRegisterGameForm } from "./useRegisterGameForm";

const gameTypeOptions = [
  { value: "MATCH" as const, label: GAME_TYPE.MATCH },
  { value: "INTERNAL" as const, label: GAME_TYPE.INTERNAL },
];

function RegisterGameModal() {
  const { hideModal } = useModal();
  const id = useId();
  const { form, resetToDefaults } = useRegisterGameForm();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const onValid = (data: RegisterGameValues) => {
    // TODO: API 연동 시 payload 전송
    console.log("Form submitted:", data);
    hideModal();
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
                name="gameType"
                control={control}
                render={({ field }) => (
                  <SegmentToggle
                    options={gameTypeOptions}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </FormSection>

            <TextField
              label="상대팀"
              placeholder="상대팀 이름을 입력해주세요."
              showBorderBottom={false}
              errorMessage={errors.opponentName?.message}
              onClear={() =>
                setValue("opponentName", "", { shouldValidate: true })
              }
              {...register("opponentName")}
            />

            <FormSection label="일정">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) =>
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        }
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
                    render={({ field }) => (
                      <DatePicker
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) =>
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                        }
                        placeholder="종료 날짜 선택"
                        className="min-w-0 h-12 w-full"
                      />
                    )}
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
                {errors.endDate && (
                  <p className="text-sm text-Fill_Error">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </FormSection>

            <Controller
              name="venue"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  label="경기 장소"
                  placeholder="경기 장소를 입력하세요"
                  showBorderBottom={false}
                  leftIcon={location}
                  errorMessage={fieldState.error?.message}
                  onClear={() => field.onChange("")}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
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
                      value={field.value}
                      onChange={field.onChange}
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
                      value={field.value}
                      onChange={field.onChange}
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

            <FormSection label="유니폼">
              <Controller
                name="uniform"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-2">
                    <UniformOption
                      type="HOME"
                      label={UNIFORM.HOME}
                      isSelected={field.value === "HOME"}
                      onSelect={() => field.onChange("HOME")}
                      imagePath={getUniformImagePath("SOLID_RED")}
                    />
                    <UniformOption
                      type="AWAY"
                      label={UNIFORM.AWAY}
                      isSelected={field.value === "AWAY"}
                      onSelect={() => field.onChange("AWAY")}
                      imagePath={getUniformImagePath("SOLID_BLUE")}
                    />
                  </div>
                )}
              />
            </FormSection>

            <FormSection label="메모">
              <textarea
                id={`${id}-memo`}
                placeholder="추가 메모사항을 입력하세요"
                rows={3}
                className="w-full px-4 py-3 bg-Fill_Quatiary border border-transparent rounded-[0.625rem] text-sm text-Label-Primary placeholder:text-Label-Tertiary outline-none focus:border-Fill_AccentPrimary transition-colors resize-none"
                {...register("memo")}
              />
            </FormSection>

            <div className="flex gap-3 pt-2 pl-3">
              <Button
                type="submit"
                variant="primary"
                size="xl"
                className="flex-1"
              >
                등록
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

export default RegisterGameModal;
