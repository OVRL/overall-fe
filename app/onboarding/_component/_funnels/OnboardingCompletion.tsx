"use client";

import { useEffect } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import Button from "@/components/ui/Button";

const OnboardingCompletion = () => {
  const router = useRouter();

  useEffect(() => {
    // Mobile-optimized confetti settings
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      // Launch confetti from the top corners
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.2 }, // Top left
        colors: ["#FFD700", "#FF4500", "#008080"], // Example festive colors
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.2 }, // Top right
        colors: ["#FFD700", "#FF4500", "#008080"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <section className="flex flex-col h-full">
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
        onClick={() => router.push("/home")}
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
