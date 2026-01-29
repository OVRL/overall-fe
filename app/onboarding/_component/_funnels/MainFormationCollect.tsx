"use client";

import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Position } from "@/types/position";
import { useState } from "react";

const MainFormationCollect = () => {
  const [mainFormation, setMainFormation] = useState<Position>("FW");
  const handleClick = () => {};
  return (
    <section className="flex flex-col gap-y-10 h-full">
      <div className="flex-1">
        <OnboardingTitle>
          <span className="text-Label-AccentPrimary">메인 포지션</span>을
          선택해주세요!
        </OnboardingTitle>
        <div className="mt-20"></div>
      </div>
      <Button
        variant="primary"
        size="xl"
        onClick={handleClick}
        disabled={!mainFormation}
        className={cn(!mainFormation && "bg-gray-900 text-Label-Tertiary")}
      >
        다음
      </Button>
    </section>
  );
};

export default MainFormationCollect;
