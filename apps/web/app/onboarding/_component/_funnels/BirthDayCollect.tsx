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
  lockedFields,
}: OnboardingStepProps) => {
  const [birthDay, setBirthDay] = useState(data.birthDate || "");
  const locked = lockedFields?.birthDate === true;

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
            onChange={(e) => {
              if (locked) return;
              setBirthDay(e.target.value);
            }}
            onClear={locked ? undefined : () => setBirthDay("")}
            readOnly={locked}
            aria-readonly={locked}
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
