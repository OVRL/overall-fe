"use client";

import Header from "@/components/Header";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import backIcon from "@/public/icons/arrow_back.svg";
import TextField from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import useModal from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";
import EmblemUploader from "./EmblemUploader";
import ControlledTextField from "@/components/ui/ControlledTextField";
import { useCreateTeamForm } from "../_hooks/useCreateTeamForm";
import UniformColorSelector from "./UniformColorSelector";
import { DatePicker } from "@/components/ui/date/DatePicker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import locationIcon from "@/public/icons/location.svg";

const CreateTeamWrapper = () => {
  const { openModal } = useModal("ADDRESS_SEARCH");

  const { form, onSubmit } = useCreateTeamForm();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col pb-12 gap-10 h-full"
    >
      <Header
        leftAction={{
          icon: backIcon,
          onClick: () => {},
          alt: "뒤로가기 버튼",
          nofill: true,
        }}
      />

      <section className="flex flex-col h-full">
        <div className="flex-1 min-h-0">
          <OnboardingTitle>클럽 만들기</OnboardingTitle>
          <div className="mt-10 flex flex-col gap-y-6">
            <ControlledTextField
              control={control}
              name="clubName"
              label="클럽 이름"
              placeholder="클럽 이름을 입력해주세요."
              showBorderBottom={false}
            />

            <Controller
              name="activityArea"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  className="w-full text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                  onClick={() =>
                    openModal({
                      onComplete: ({ address, code }) => {
                        setValue("activityArea", address, {
                          shouldValidate: true,
                        });
                        setValue("activityAreaCode", code);
                      },
                    })
                  }
                >
                  <TextField
                    label="주요 활동지역"
                    placeholder="클릭해서 주요 활동 장소를 찾아보세요"
                    type="text"
                    showBorderBottom={false}
                    leftIcon={locationIcon}
                    value={field.value}
                    readOnly
                    className="pointer-events-none"
                    onChange={() => {}}
                  />
                </button>
              )}
            />

            <Controller
              control={control}
              name="foundingDate"
              render={({ field }) => (
                <div className="flex flex-col w-full gap-y-1.5 px-3">
                  <span className="text-sm font-semibold text-Label-Primary">
                    클럽 창단일
                  </span>
                  <DatePicker
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) =>
                      field.onChange(
                        date ? format(date, "yyyy-MM-dd", { locale: ko }) : "",
                      )
                    }
                    placeholder="2026. 01. 01."
                  />
                </div>
              )}
            />

            <Controller
              name="emblemFile"
              control={control}
              render={() => (
                <EmblemUploader
                  onImageSelected={(file) => {
                    setValue("emblemFile", file || undefined, {
                      shouldValidate: true,
                    });
                  }}
                />
              )}
            />

            <div className="flex flex-col gap-6">
              <Controller
                name="homeUniform"
                control={control}
                render={({ field }) => (
                  <UniformColorSelector
                    label="홈 유니폼 컬러"
                    value={field.value}
                    onChange={(color) =>
                      setValue("homeUniform", color, { shouldValidate: true })
                    }
                  />
                )}
              />

              <Controller
                name="awayUniform"
                control={control}
                render={({ field }) => (
                  <UniformColorSelector
                    label="어웨이 유니폼 컬러"
                    value={field.value}
                    onChange={(color) =>
                      setValue("awayUniform", color, { shouldValidate: true })
                    }
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-auto pt-6">
          <Button
            type="submit"
            variant="primary"
            size="xl"
            disabled={!isValid}
            className={cn(
              "w-full transition-colors",
              !isValid && "bg-gray-900 text-Label-Tertiary",
            )}
          >
            다음
          </Button>
        </div>
      </section>
    </form>
  );
};

export default CreateTeamWrapper;
