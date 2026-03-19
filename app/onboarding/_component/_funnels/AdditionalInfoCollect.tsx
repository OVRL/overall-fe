import { useState, useRef } from "react";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";
import TextField from "@/components/ui/TextField";
import SelectMainFoot from "../SelectMainFoot";

import { OnboardingStepProps } from "@/types/onboarding";
import SelectGender from "../SelectGender";

import { useModifyUserMutation } from "../../_hooks/useModifyUserMutation";
import {
  UpdateUserInput,
  Position,
} from "@/__generated__/useModifyUserMutation.graphql";
import useModal from "@/hooks/useModal";

/** 완료하기 클릭 후 최소 이 시간(ms) 동안 로딩 스피너를 보여줌. 스텝 전환이 너무 빨라 리프레시처럼 보이는 현상 방지 */
const MIN_LOADING_DISPLAY_MS = 500;

const AdditionalInfoCollect = ({
  onNext,
  data,
  onDataChange,
}: OnboardingStepProps) => {
  const loadingStartedAtRef = useRef<number | null>(null);

  const [info, setInfo] = useState({
    gender: (data.gender as "M" | "W") || "M",
    activityArea: data.activityArea || "",
    activityAreaCode: "",
    foot: (data.foot as "L" | "R" | "B") || "R",
    preferredNumber: data.preferredNumber?.toString() || "",
    favoritePlayer: data.favoritePlayer || "",
  });

  const [commit, isMutationInFlight] = useModifyUserMutation();
  const { openModal } = useModal("ADDRESS_SEARCH");

  const handleComplete = () => {
    if (!data.profileImageFile) {
      alert("프로필 이미지가 필요합니다.");
      return;
    }

    // onDataChange는 onCompleted에서만 호출. 클릭 직후 부모 setState 시 리마운트 등으로 폼 데이터가 비워지는 현상 방지
    const updateInput: UpdateUserInput = {
      id: data.id!, // data.id is checked above
      name: data.name!, // Name should be collected by now
      phone: data.phone!, // Phone should be collected
      birthDate: data.birthDate,
      mainPosition: data.mainPosition as Position | undefined | null,
      subPositions: data.subPositions as readonly Position[] | null | undefined,
      gender: info.gender,
      activityArea: info.activityAreaCode || info.activityArea,
      foot: info.foot,
      preferredNumber: info.preferredNumber
        ? parseFloat(info.preferredNumber)
        : null,
      favoritePlayer: info.favoritePlayer,
    };

    loadingStartedAtRef.current = Date.now();
    commit({
      variables: {
        input: updateInput,
        profileImage: null, // Placeholder for uploadable, handled by network layer
      },
      uploadables: {
        profileImage: data.profileImageFile,
      },
      onCompleted: () => {
        // 뮤테이션 성공 시점에만 부모 formData 반영 (클릭 직후 onDataChange 시 리마운트로 데이터 소실 방지)
        onDataChange((prev) => ({
          ...prev,
          gender: info.gender,
          activityArea: info.activityArea,
          foot: info.foot,
          preferredNumber: info.preferredNumber
            ? parseInt(info.preferredNumber, 10)
            : undefined,
          favoritePlayer: info.favoritePlayer,
        }));
        const elapsed = Date.now() - (loadingStartedAtRef.current ?? 0);
        const remaining = Math.max(0, MIN_LOADING_DISPLAY_MS - elapsed);
        if (remaining > 0) {
          setTimeout(() => {
            loadingStartedAtRef.current = null;
            onNext();
          }, remaining);
        } else {
          loadingStartedAtRef.current = null;
          onNext();
        }
      },
      onError: (error) => {
        loadingStartedAtRef.current = null;
        console.error("Mutation failed", error);
      },
    });
  };

  const handleLater = () => {
    if (!data.profileImageFile) {
      alert("프로필 이미지가 필요합니다.");
      return;
    }

    const previousData = { ...data };
    const updateInput: UpdateUserInput = {
      id: data.id!,
      name: previousData.name!,
      phone: previousData.phone!,
      birthDate: previousData.birthDate,
      mainPosition: previousData.mainPosition as Position | undefined | null,
      subPositions: previousData.subPositions as
        | readonly Position[]
        | null
        | undefined,
    };

    commit({
      variables: {
        input: updateInput,
        profileImage: null,
      },
      uploadables: {
        profileImage: data.profileImageFile,
      },
      onCompleted: () => {
        onNext(); // Next step or finish
      },
      onError: (error) => {
        console.error("Mutation failed", error);
      },
    });
  };

  const isFormFilled = Object.values(info).every((value) => !!value);

  return (
    <section className="flex flex-col h-full pb-12">
      <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
        <OnboardingTitle>
          추가 정보를
          <br />
          입력해주세요.
        </OnboardingTitle>
        <div className="mt-8 flex flex-col gap-y-6 pb-6">
          <SelectGender
            gender={info.gender}
            setGender={(gender) =>
              setInfo((prev) => ({
                ...prev,
                gender: gender,
              }))
            }
          />
          <div
            role="button"
            tabIndex={0}
            className="cursor-pointer outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
            onClick={() =>
              openModal({
                onComplete: ({ address, code }) =>
                  setInfo((prev) => ({
                    ...prev,
                    activityArea: address,
                    activityAreaCode: code,
                  })),
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openModal({
                  onComplete: ({ address, code }) =>
                    setInfo((prev) => ({
                      ...prev,
                      activityArea: address,
                      activityAreaCode: code,
                    })),
                });
              }
            }}
          >
            <TextField
              label="활동지역"
              placeholder="주소검색"
              type="text"
              value={info.activityArea}
              readOnly
              className="pointer-events-none"
            />
          </div>

          <SelectMainFoot
            mainFoot={info.foot}
            setMainFoot={(foot) =>
              setInfo((prev) => ({
                ...prev,
                foot: foot,
              }))
            }
          />

          <TextField
            label="선호하는 등번호"
            placeholder="선호하는 등번호를 입력해주세요."
            type="number"
            value={info.preferredNumber}
            onChange={(e) =>
              setInfo((prev) => ({ ...prev, preferredNumber: e.target.value }))
            }
          />
          <TextField
            label="좋아하는 선수"
            placeholder="좋아하는 선수를 입력해주세요."
            type="text"
            value={info.favoritePlayer}
            onChange={(e) =>
              setInfo((prev) => ({ ...prev, favoritePlayer: e.target.value }))
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <Button
          variant="primary"
          size="xl"
          onClick={handleComplete}
          disabled={!isFormFilled || isMutationInFlight}
          className={cn(
            "w-full transition-colors",
            !isFormFilled && "bg-gray-900 text-Label-Tertiary",
          )}
        >
          {isMutationInFlight ? (
            <LoadingSpinner label="저장 중입니다." size="sm" />
          ) : (
            "완료하기"
          )}
        </Button>
        <Button
          variant="line"
          size="xl"
          onClick={handleLater}
          disabled={isMutationInFlight}
        >
          다음에 작성하기
        </Button>
      </div>
    </section>
  );
};

export default AdditionalInfoCollect;
