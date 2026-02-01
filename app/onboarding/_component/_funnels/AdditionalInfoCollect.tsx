import { useState } from "react";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import AuthTextField from "@/components/login/AuthTextField";
import SelectMainFoot from "../SelectMainFoot";

import { OnboardingStepProps } from "../OnboardingStepProps";

const AdditionalInfoCollect = ({
  onNext,
  data,
  onDataChange,
}: OnboardingStepProps) => {
  const [mainFoot, setMainFoot] = useState<"left" | "right">("right");
  const [address, setAddress] = useState("");
  const [preferredNumber, setPreferredNumber] = useState("");
  const [favoritePlayer, setFavoritePlayer] = useState("");

  const handleClick = () => {
    // Schema has 'gender' (maybe mainFoot?), 'provider', 'phone', 'email', 'name'.
    // Address, preferredNumber, favoritePlayer are NOT in schema.
    // Usage implies we just collect them.
    onDataChange((prev) => ({
      ...prev,
      // Mapping these to schema fields if possible, or just ignoring for schema compliance
      // as per "follow schema" instruction.
      // I will just call onNext() for now to enable navigation.
    }));
    onNext();
  };

  const isFormFilled =
    !!address && mainFoot.length > 0 && !!preferredNumber && !!favoritePlayer;

  return (
    <section className="flex flex-col gap-y-10 h-full">
      <div className="flex-1">
        <OnboardingTitle>
          추가 정보를
          <br />
          입력해주세요.
        </OnboardingTitle>
        <div className="mt-20 flex flex-col gap-y-6">
          <AuthTextField
            label="활동지역"
            placeholder="주소검색"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <SelectMainFoot mainFoot={mainFoot} setMainFoot={setMainFoot} />

          <AuthTextField
            label="선호하는 등번호"
            placeholder="선호하는 등번호를 입력해주세요."
            type="number"
            value={preferredNumber}
            onChange={(e) => setPreferredNumber(e.target.value)}
          />
          <AuthTextField
            label="좋아하는 선수"
            placeholder="좋아하는 선수를 입력해주세요."
            type="text"
            value={favoritePlayer}
            onChange={(e) => setFavoritePlayer(e.target.value)}
          />
        </div>
      </div>
      <Button
        variant="primary"
        size="xl"
        onClick={handleClick}
        disabled={!isFormFilled}
        className={cn(!isFormFilled && "bg-gray-900 text-Label-Tertiary")}
      >
        다음
      </Button>
    </section>
  );
};

export default AdditionalInfoCollect;
