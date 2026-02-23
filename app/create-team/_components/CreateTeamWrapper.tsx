"use client";

import Header from "@/components/Header";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import backIcon from "@/public/icons/arrow_back.svg";
import AuthTextField from "@/components/login/AuthTextField";
import { Button } from "@/components/ui/Button";
import useModal from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";
import EmblemUploader from "./EmblemUploader";
import ControlledAuthTextField from "./ControlledAuthTextField";
import { useCreateTeamForm } from "../_hooks/useCreateTeamForm";
import UniformColorSelector from "./UniformColorSelector";

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
                  <AuthTextField
                    label="주요 활동지역"
                    placeholder="지번, 도로명, 법정동 등으로 검색해주세요"
                    type="text"
                    value={field.value}
                    readOnly
                    className="pointer-events-none"
                    onChange={() => {}}
                  />
                </button>
              )}
            />

            <ControlledAuthTextField
              control={control}
              name="clubName"
              label="클럽 이름"
              placeholder="예: 강남구 슛돌이 FC"
            />

            <ControlledAuthTextField
              control={control}
              name="foundingDate"
              label="클럽 창단일"
              placeholder="예: 2025-01-01"
              type="date"
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
