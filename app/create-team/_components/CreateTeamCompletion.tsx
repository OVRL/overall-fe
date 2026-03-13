"use client";

import { useEffect } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import OnboardingTitle from "@/components/onboarding/OnboardingTitle";
import Button from "@/components/ui/Button";
import { useBridgeRouter } from "@/hooks/bridge/useBridgeRouter";

const CreateTeamCompletion = () => {
  const router = useBridgeRouter();

  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.45 },
        colors: ["#B8FF12", "#76AD00", "#F1F1F1"], // Example festive colors
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.45 }, // Top right
        colors: ["#B8FF12", "#76AD00", "#F1F1F1"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <section className="flex flex-col h-full pb-12">
      <div className="flex flex-col flex-1 min-h-0 gap-y-4 pb-4 pt-20">
        <OnboardingTitle>
          축하드립니다! <br />
          팀이 생성 되었습니다.
        </OnboardingTitle>
        <div className="relative w-full flex-1 min-h-0">
          <Image
            src="/images/team_squad_picture.webp"
            alt="팀 스쿼드 사진"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </div>

      <Button
        onClick={() => router.replace("/home")}
        variant="primary"
        size="xl"
        className="w-full py-4 rounded-xl bg-[#CCFF00] text-black font-bold text-lg hover:bg-[#b3e600] transition-colors"
      >
        홈으로
      </Button>
    </section>
  );
};

export default CreateTeamCompletion;
