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
            "radial-gradient(118.28% 50% at 50% 50%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.3) 100%)",
        }}
      />
      <div className="absolute inset-0 z-3 lg:flex lg:min-w-0 lg:items-center lg:justify-center lg:gap-14 xl:gap-30 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 lg:relative lg:inset-auto lg:h-[85vh] xl:h-[92vh] lg:w-auto lg:min-h-0 lg:min-w-0 lg:flex lg:items-center lg:justify-center lg:mt-10">
          <GradationBg
            align="left"
            width="120%"
            variant="transparent-leading"
            blackStopPercent={80.46}
            transparentStopPercent={90.75}
            className="max-lg:-left-[10%] lg:-left-[22.8%] lg:right-auto lg:-top-[10vh] lg:-bottom-[10vh]"
          />
          <GradationBg
            align="right"
            width="125%"
            variant="transparent-trailing"
            blackStopPercent={80.46}
            transparentStopPercent={92.37}
            className="max-lg:left-[0%] lg:left-[3.5%] lg:right-auto lg:-top-[10vh] lg:-bottom-[10vh]"
          />
          <Image
            src="/videos/landing_video.webp"
            alt=""
            width={562}
            height={1002}
            unoptimized
            className="absolute top-1/2 left-1/2 w-full h-full max-lg:object-cover lg:object-contain lg:relative z-10 lg:top-auto lg:left-auto lg:h-full lg:w-auto lg:translate-x-0 lg:translate-y-0 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center px-4 pb-safe pt-safe lg:relative z-20 lg:inset-auto lg:h-auto xl:h-153 lg:w-[400px] xl:w-107.5 lg:shrink-0 lg:items-center xl:items-stretch lg:justify-center xl:justify-start lg:p-0 lg:px-6">
          <div className="w-full max-w-107.5 lg:h-full lg:max-w-none">
            <LandingStartForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
