import { useState } from "react";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import AuthTextField from "@/components/login/AuthTextField";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const AuthNumber = () => {
  const [authNumber, setAuthNumber] = useState("");

  const handleClick = () => {};

  return (
    <section className="flex flex-col gap-y-10 h-full">
      <div className="flex-1">
        <OnboardingTitle>
          문자로 받은
          <br />
          인증번호를 입력해주세요.
        </OnboardingTitle>
        <div className="mt-20">
          <AuthTextField
            label="인증번호"
            placeholder="인증번호를 입력해주세요."
            type="number"
            value={authNumber}
            onChange={(e) => setAuthNumber(e.target.value)}
          />
        </div>
      </div>
      <Button
        variant="primary"
        size="xl"
        onClick={handleClick}
        disabled={!authNumber}
        className={cn(!authNumber && "bg-gray-900 text-Label-Tertiary")}
      >
        인증완료
      </Button>
    </section>
  );
};

export default AuthNumber;
