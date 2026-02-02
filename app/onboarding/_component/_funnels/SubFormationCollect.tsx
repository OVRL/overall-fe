"use client";

import OnboardingFormationSelector from "../OnboardingFormationSelector";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Position } from "@/types/position";
import { useState } from "react";
import { OnboardingStepProps } from "@/types/onboarding";

const SubFormationCollect = ({
  onNext,
  data,
  onDataChange,
}: OnboardingStepProps) => {
  const [subPositions, setSubPositions] = useState<Position[]>(
    (data.subPositions as Position[]) || []
  );

  const mainPosition = (data.mainPosition as Position) || undefined;

  const handleClick = () => {
    onDataChange((prev) => ({ ...prev, subPositions }));
    onNext();
  };

  const isComplete = subPositions.length === 2;

  return (
    <section className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0">
        <OnboardingTitle>
          {data.name} 선수! <br />
          <span className="text-Label-AccentPrimary">서브 포지션</span>을
          선택해주세요!
        </OnboardingTitle>
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <OnboardingFormationSelector
            value={subPositions}
            onChange={(newPositions) => {
              if (newPositions.length <= 2) {
                setSubPositions(newPositions);
              }
            }}
            className="h-full w-auto max-w-full"
            multiSelect={true}
            disabledPositions={mainPosition ? [mainPosition] : []}
          />
        </div>₩
      </div>
      <Button
        variant="primary"
        size="xl"
        onClick={handleClick}
        disabled={!isComplete}
        className={cn(
          "mt-10",
          !isComplete && "bg-gray-900 text-Label-Tertiary"
        )}
      >
        다음
      </Button>
    </section>
  );
};

export default SubFormationCollect;
