import { useState } from "react";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import AuthTextField from "@/components/login/AuthTextField";
import SelectMainFoot from "../SelectMainFoot";

import { OnboardingStepProps } from "@/types/onboarding";
import SelectGender from "../SelectGender";

import { useModifyUserMutation } from "../../_hooks/useModifyUserMutation";
import {
  UpdateUserInput,
  Position,
} from "@/__generated__/useModifyUserMutation.graphql";
import useModal from "@/hooks/useModal";

const AdditionalInfoCollect = ({
  onNext,
  data,
  onDataChange,
}: OnboardingStepProps) => {
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

    commit({
      variables: {
        input: updateInput,
        profileImage: null, // Placeholder for uploadable, handled by network layer
      },
      uploadables: {
        profileImage: data.profileImageFile,
      },
      onCompleted: () => {
        onNext();
      },
      onError: (error) => {
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
            <AuthTextField
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

          <AuthTextField
            label="선호하는 등번호"
            placeholder="선호하는 등번호를 입력해주세요."
            type="number"
            value={info.preferredNumber}
            onChange={(e) =>
              setInfo((prev) => ({ ...prev, preferredNumber: e.target.value }))
            }
          />
          <AuthTextField
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
          완료하기
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
