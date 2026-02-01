"use client";

import OnboardingFormationSelector from "../OnboardingFormationSelector";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Position } from "@/types/position";
import { useState } from "react";
import { OnboardingStepProps } from "../OnboardingStepProps";

const SubFormationCollect = ({
  onNext,
  data,
  onDataChange,
}: OnboardingStepProps) => {
  const [subFormation, setSubFormation] = useState<Position[]>(
    (data.subFormation as Position[]) || [],
  );

  const mainFormation = (data.mainFormation as Position[]) || [];

  const handleClick = () => {
    onDataChange((prev) => ({ ...prev, subFormation }));
    onNext();
  };

  const isComplete = subFormation.length === 2;

  return (
    <section className="flex flex-col gap-y-10 h-full">
      <div className="flex-1">
        <OnboardingTitle>
          {data.name} 선수! <br />
          <span className="text-Label-AccentPrimary">서브 포지션</span>을
          선택해주세요!
        </OnboardingTitle>
        <OnboardingFormationSelector
          value={subFormation}
          onChange={(newPositions) => {
            if (newPositions.length <= 2) {
              setSubFormation(newPositions);
            }
          }}
          className="mt-20"
          multiSelect={true}
          disabledPositions={mainFormation}
        />
        {/* Helper text if needed, e.g., "select 2 positions" */}
      </div>
      <Button
        variant="primary"
        size="xl"
        onClick={handleClick}
        disabled={!isComplete}
        className={cn(!isComplete && "bg-gray-900 text-Label-Tertiary")}
      >
        다음
      </Button>
    </section>
  );
};

export default SubFormationCollect;
