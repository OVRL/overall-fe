import { useState } from "react";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import AuthTextField from "@/components/login/AuthTextField";
import SelectMainFoot from "../SelectMainFoot";

import { OnboardingStepProps } from "@/types/onboarding";
import SelectGender from "../SelectGender";

const AdditionalInfoCollect = ({
  onNext,
  data,
  onDataChange,
}: OnboardingStepProps) => {
  const [info, setInfo] = useState({
    gender: (data.gender as "M" | "W") || "M",
    activityArea: data.activityArea || "",
    foot: (data.foot as "L" | "R" | "B") || "R",
    preferredNumber: data.preferredNumber?.toString() || "",
    favoritePlayer: data.favoritePlayer || "",
  });

  const handleClick = () => {
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
    onNext();
  };

  const isFormFilled =
    !!info.activityArea &&
    info.foot.length > 0 &&
    !!info.preferredNumber &&
    !!info.favoritePlayer;

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
          <AuthTextField
            label="활동지역"
            placeholder="주소검색"
            type="text"
            value={info.activityArea}
            onChange={(e) =>
              setInfo((prev) => ({ ...prev, activityArea: e.target.value }))
            }
          />

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
      <Button
        variant="primary"
        size="xl"
        onClick={handleClick}
        disabled={!isFormFilled}
        className={cn(
          "w-full transition-colors",
          !isFormFilled && "bg-gray-900 text-Label-Tertiary",
        )}
      >
        다음
      </Button>
    </section>
  );
};

export default AdditionalInfoCollect;
