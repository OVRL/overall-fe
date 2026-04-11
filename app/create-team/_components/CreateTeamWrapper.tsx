"use client";

import { useCallback, useMemo } from "react";
import { fetchQuery } from "relay-runtime";
import { useRelayEnvironment } from "react-relay";
import Header from "@/components/Header";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import backIcon from "@/public/icons/arrow_back.svg";
import TextField from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import useModal from "@/hooks/useModal";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";
import EmblemUploader from "./EmblemUploader";
import { useCreateTeamForm } from "../_hooks/useCreateTeamForm";
import UniformColorSelector from "./UniformColorSelector";
import { type UniformDesign } from "../_lib/uniformDesign";
import { DatePicker } from "@/components/ui/date/DatePicker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import locationIcon from "@/public/icons/location.svg";
import { useBridgeRouter } from "@/hooks/bridge/useBridgeRouter";
import { useUserStore } from "@/contexts/UserContext";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";
import { SHOW_TEAM_CREATED_MODAL_KEY } from "@/lib/teamCreatedModalStorage";
import { useUserId } from "@/hooks/useUserId";
import { FindTeamMemberQuery } from "@/lib/relay/queries/findTeamMemberQuery";
import {
  FindManyTeamMemberQuery,
  ROSTER_PAGE_SIZE,
} from "@/lib/relay/queries/findManyTeamMemberQuery";
import { observableToPromise } from "@/lib/relay/observableToPromise";

const CreateTeamWrapper = () => {
  const { openModal } = useModal("ADDRESS_SEARCH");
  const router = useBridgeRouter();
  const user = useUserStore((state) => state.user);
  const userId = useUserId();
  const environment = useRelayEnvironment();
  const { setSelectedTeamId } = useSelectedTeamId();
  const { form, onSubmit, isInFlight } = useCreateTeamForm({
    onSuccess: async (createdTeam) => {
      const teamIdNum = parseNumericIdFromRelayGlobalId(createdTeam.id);
      // 뱃지 등에서 새 팀 이름·이미지가 바로 보이도록 name/emblem 전달
      setSelectedTeamId(
        createdTeam.id,
        teamIdNum ?? undefined,
        createdTeam.name ?? null,
        createdTeam.emblem ?? null,
      );
      // Relay 스토어 갱신 후 이동. (헤더·햄버거 findTeamMember + 홈 로스터 findManyTeamMember)
      if (userId != null) {
        try {
          await observableToPromise(
            fetchQuery(environment, FindTeamMemberQuery, { userId }),
          );
          if (teamIdNum != null) {
            await observableToPromise(
              fetchQuery(environment, FindManyTeamMemberQuery, {
                limit: ROSTER_PAGE_SIZE,
                offset: 0,
                teamId: teamIdNum,
              }),
            );
          }
        } catch (e) {
          // refetch 실패해도 쿠키·Provider는 이미 새 팀으로 설정됨. 이동은 진행하고 다음 로드에서 동기화됨.
          console.warn("[CreateTeam] Relay refetch failed, navigating anyway", e);
        }
      }
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(SHOW_TEAM_CREATED_MODAL_KEY, "1");
      }
      router.replace("/");
    },
  });
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = form;

  const homeUniform = watch("homeUniform");
  const awayUniform = watch("awayUniform");

  // rerender-최소화: 안정된 콜백 참조로 자식 리렌더 감소 (Vercel best practice)
  const setHomeUniform = useCallback(
    (design: UniformDesign) =>
      setValue("homeUniform", design, { shouldValidate: true }),
    [setValue],
  );
  const setAwayUniform = useCallback(
    (design: UniformDesign) =>
      setValue("awayUniform", design, { shouldValidate: true }),
    [setValue],
  );
  const setEmblemFile = useCallback(
    (file: File | null) =>
      setValue("emblemFile", file ?? undefined, { shouldValidate: true }),
    [setValue],
  );

  const headerLeftAction = useMemo(
    () => ({
      icon: backIcon,
      onClick: router.back,
      alt: "뒤로가기 버튼",
      nofill: true as const,
    }),
    [router],
  );

  const handleFormSubmit = useCallback(
    (data: Parameters<typeof onSubmit>[0]) => {
      onSubmit(data);
    },
    [onSubmit],
  );

  const canSubmit = Boolean(user) && isValid && !isInFlight;

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col pb-12 gap-10 h-full"
    >
      <Header leftAction={headerLeftAction} />

      <section className="flex flex-col h-full">
        <div className="flex-1 min-h-0">
          <OnboardingTitle>클럽 만들기</OnboardingTitle>
          <div className="mt-10 flex flex-col gap-y-6">
            <Controller
              name="clubName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="클럽 이름"
                  placeholder="클럽 이름을 입력해주세요."
                  showBorderBottom={false}
                  errorMessage={error?.message}
                  onChange={(e) => {
                    const value = e.target.value;
                    // IME 조합 중(한글 등)에는 필터 적용하지 않음 — 자모가 지워지지 않도록
                    const isComposing =
                      "isComposing" in e.nativeEvent &&
                      e.nativeEvent.isComposing;
                    if (isComposing) {
                      field.onChange(value.slice(0, 15));
                      return;
                    }
                    const filteredValue = value
                      .replace(/[^a-zA-Z0-9가-힣\s]/g, "")
                      .slice(0, 15);
                    field.onChange(filteredValue);
                  }}
                />
              )}
            />

            <Controller
              name="activityArea"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  className="w-full cursor-pointer text-left outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
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
                  aria-label="주요 활동지역 선택하기"
                >
                  <TextField
                    label="주요 활동지역"
                    placeholder="클릭해서 주요 활동 장소를 찾아보세요"
                    type="text"
                    showBorderBottom={false}
                    leftIcon={locationIcon}
                    leftIconClassName="text-Label-Primary"
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
              render={() => <EmblemUploader onImageSelected={setEmblemFile} />}
            />

            <div className="flex flex-col gap-6">
              <Controller
                name="homeUniform"
                control={control}
                render={({ field }) => (
                  <UniformColorSelector
                    label="홈 유니폼"
                    value={field.value}
                    onChange={setHomeUniform}
                    disabledDesign={awayUniform}
                  />
                )}
              />

              <Controller
                name="awayUniform"
                control={control}
                render={({ field }) => (
                  <UniformColorSelector
                    label="어웨이 유니폼"
                    value={field.value}
                    onChange={setAwayUniform}
                    disabledDesign={homeUniform}
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
            disabled={!canSubmit}
            className={cn(
              "w-full transition-colors",
              !canSubmit && "bg-gray-900 text-Label-Tertiary",
            )}
          >
            {isInFlight ? (
              <LoadingSpinner label="만들기 중입니다." size="sm" />
            ) : (
              "클럽 생성하기"
            )}
          </Button>
        </div>
      </section>
    </form>
  );
};

export default CreateTeamWrapper;
