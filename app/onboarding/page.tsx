"use client";
import Header from "@/components/Header";
import backIcon from "@/public/icons/arrow_back.svg";
import OnboardingFunnelWrapper from "./_component/OnboardingFunnelWrapper";

const OnboardingPage = () => {
  return (
    <div className="flex flex-col gap-y-10 h-full pb-12">
      <Header
        leftAction={{
          icon: backIcon,
          onClick: () => {},
          alt: "뒤로가기 버튼",
          nofill: true,
        }}
      />
      <main className="px-4 flex-1">
        <OnboardingFunnelWrapper />
      </main>
    </div>
  );
};

export default OnboardingPage;
