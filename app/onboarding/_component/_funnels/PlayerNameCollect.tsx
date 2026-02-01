import { useState } from "react";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import AuthTextField from "@/components/login/AuthTextField";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { OnboardingStepProps } from "../OnboardingStepProps";

const PlayerNameCollect = ({
  onNext,
  data,
  onDataChange,
}: OnboardingStepProps) => {
  const [name, setName] = useState(data.name || "");

  const handleClick = () => {
    onDataChange((prev) => ({ ...prev, name }));
    onNext();
  };

  return (
    <section className="flex flex-col gap-y-10 h-full">
      <div className="flex-1">
        <OnboardingTitle>
          반갑습니다.
          <br />
          선수 이름을 입력해주세요.
        </OnboardingTitle>
        <div className="mt-20">
          <AuthTextField
            label="선수 이름"
            placeholder="선수 이름을 입력해주세요."
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      <Button
        variant="primary"
        size="xl"
        onClick={handleClick}
        disabled={!name}
        className={cn(!name && "bg-gray-900 text-Label-Tertiary")}
      >
        다음
      </Button>
    </section>
  );
};

export default PlayerNameCollect;
