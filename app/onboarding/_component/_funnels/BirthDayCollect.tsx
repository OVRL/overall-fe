import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import BirthDayTextField from "@/components/onboarding/BirthDayTextField";

import { OnboardingStepProps } from "@/types/onboarding";

import { z } from "zod";

const birthDaySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const BirthDayCollect = ({
  onNext,
  data,
  onDataChange,
}: OnboardingStepProps) => {
  const [birthDay, setBirthDay] = useState(data.birthDate || "");

  const handleClick = () => {
    onDataChange((prev) => ({ ...prev, birthDate: birthDay }));
    onNext();
  };

  return (
    <section className="flex flex-col gap-y-10 h-full pb-12">
      <div className="flex-1">
        <OnboardingTitle>
          {data.name} 선수! <br />
          생년월일을 알려주세요.
        </OnboardingTitle>
        <div className="mt-20">
          <BirthDayTextField
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
          />
        </div>
      </div>
      <Button
        variant="primary"
        size="xl"
        onClick={handleClick}
        disabled={!birthDaySchema.safeParse(birthDay).success}
        className={cn(
          !birthDaySchema.safeParse(birthDay).success &&
            "bg-gray-900 text-Label-Tertiary",
        )}
      >
        다음
      </Button>
    </section>
  );
};

export default BirthDayCollect;
