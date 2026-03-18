"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import Button from "@/components/ui/Button";
import { useCelebrationConfetti } from "@/hooks/useCelebrationConfetti";

const OnboardingCompletion = () => {
  const router = useRouter();

  useCelebrationConfetti();

  return (
    <section className="flex flex-col h-full pb-12">
      <div className="flex flex-col flex-1 min-h-0 gap-y-4 pb-4">
        <OnboardingTitle>회원 가입을 축하합니다!</OnboardingTitle>
        <div className="relative w-full flex-1 min-h-0">
          <Image
            src="/images/soccer_chibi_squad.webp"
            alt="Onboarding Complete Characters"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </div>

      <Button
        onClick={() => router.replace("/landing")}
        variant="primary"
        size="xl"
        className="w-full py-4 rounded-xl bg-[#CCFF00] text-black font-bold text-lg hover:bg-[#b3e600] transition-colors"
      >
        시작하기
      </Button>
    </section>
  );
};

export default OnboardingCompletion;
