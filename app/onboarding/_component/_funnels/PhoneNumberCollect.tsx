"use client";

import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import Button from "@/components/ui/Button";
import { useState } from "react";
import PhoneNumberTextField from "@/components/onboarding/PhoneNumberTextField";
import { cn } from "@/lib/utils";

import { OnboardingStepProps } from "@/types/onboarding";
import { z } from "zod";

const phoneNumberSchema = z
  .string()
  .regex(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/);

const PhoneNumberCollect = ({
  onNext,
  data,
  onDataChange,
}: OnboardingStepProps) => {
  const [phoneNumber, setPhoneNumber] = useState(data.phone || "");

  const handleClick = () => {
    const cleanPhoneNumber = phoneNumber.replace(/-/g, "");
    console.log("API로 보낼 값:", cleanPhoneNumber);
    onDataChange((prev) => ({ ...prev, phone: cleanPhoneNumber }));
    onNext();
  };

  return (
    <section className="flex flex-col gap-y-10 h-full">
      <div className="flex-1">
        <OnboardingTitle>전화번호를 알려주세요.</OnboardingTitle>
        <div className="mt-20">
          <PhoneNumberTextField
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onClear={() => setPhoneNumber("")}
          />
        </div>
      </div>
      <Button
        variant="primary"
        size="xl"
        onClick={handleClick}
        disabled={!phoneNumberSchema.safeParse(phoneNumber).success}
        className={cn(
          !phoneNumberSchema.safeParse(phoneNumber).success &&
            "bg-gray-900 text-Label-Tertiary"
        )}
      >
        인증번호 받기
      </Button>
    </section>
  );
};

export default PhoneNumberCollect;
