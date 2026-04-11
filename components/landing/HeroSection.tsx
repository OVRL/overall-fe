"use client";

import Image from "next/image";
import GradationBg from "./GradationBg";
import LandingStartForm from "./LandingStartForm";
const HeroSection = () => {
  return (
    <section className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden">
      <Image
        src="/images/landing_bg.webp"
        alt="Hero Background"
        fill
        quality={100}
        className="object-cover"
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(118.28% 50% at 50% 50%, rgba(0, 0, 0, 0.00) 0%, #000 100%)",
        }}
      />
      <GradationBg
        align="left"
        width={675}
        variant="transparent-leading"
        blackStopPercent={80.46}
        transparentStopPercent={90.75}
      />
      <GradationBg
        align="right"
        width={703}
        variant="transparent-trailing"
        blackStopPercent={80.46}
        transparentStopPercent={92.37}
      />
      <div className="absolute inset-0 z-3 xl:inset-y-0 xl:left-90 xl:right-0 xl:flex xl:min-w-0 xl:items-center xl:gap-30">
        <div className="pointer-events-none absolute inset-0 xl:relative xl:inset-auto xl:h-full xl:min-h-0 xl:min-w-0 xl:flex-1 xl:max-w-150">
          <Image
            src="/videos/landing_video.webp"
            alt=""
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center px-4 pb-safe pt-safe xl:static xl:inset-auto xl:h-153 xl:w-107.5 xl:shrink-0 xl:items-stretch xl:justify-start xl:p-0 xl:px-6">
          <div className="w-full max-w-107.5 xl:h-full xl:max-w-none">
            <LandingStartForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
