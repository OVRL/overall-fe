"use client";

import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import Button from "@/components/ui/Button";
import { useState } from "react";
import PhoneNumberTextField from "@/components/onboarding/PhoneNumberTextField";
import { cn } from "@/lib/utils";

const PhoneNumberCollect = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleClick = () => {
    const cleanPhoneNumber = phoneNumber.replace(/-/g, "");
    console.log("API로 보낼 값:", cleanPhoneNumber);
    // TODO: API 요청 로직 추가
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
        disabled={!phoneNumber}
        className={cn(!phoneNumber && "bg-gray-900 text-Label-Tertiary")}
      >
        인증번호 받기
      </Button>
    </section>
  );
};

export default PhoneNumberCollect;
