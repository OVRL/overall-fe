"use client";

import OnboardingFormationSelector from "../OnboardingFormationSelector";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Position } from "@/types/position";
import { useState } from "react";

import { OnboardingStepProps } from "@/types/onboarding";

const MainFormationCollect = ({
  onNext,
  data,
  onDataChange,
}: OnboardingStepProps) => {
  const [mainPosition, setMainPosition] = useState<Position | undefined>(
    (data.mainPosition as Position) || "FW"
  );
  const handleClick = () => {
    onDataChange((prev) => ({ ...prev, mainPosition }));
    onNext();
  };
  return (
    <section className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0">
        <OnboardingTitle>
          {data.name} 선수! <br />
          <span className="text-Label-AccentPrimary">메인 포지션</span>을
          선택해주세요!
        </OnboardingTitle>
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <OnboardingFormationSelector
            value={mainPosition ? [mainPosition] : []}
            onChange={(positions) => setMainPosition(positions[0])}
            className="h-full w-auto max-w-full"
          />
        </div>
      </div>
      <Button
        variant="primary"
        size="xl"
        onClick={handleClick}
        disabled={!mainPosition}
        className={cn(
          "mt-10",
          !mainPosition && "bg-gray-900 text-Label-Tertiary"
        )}
      >
        다음
      </Button>
    </section>
  );
};

export default MainFormationCollect;
