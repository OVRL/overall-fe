import Link from "@/components/Link";
import { cn } from "@/lib/utils";
import { onboardingCtaLinkClassName } from "./onboardingCtaLinkClass";

const OnboardingBestXl = () => {
  return (
    <div className="absolute top-1/2 left-1/2 z-10 flex w-79 -translate-x-1/2 -translate-y-1/2 justify-center pointer-events-none">
      <div
        className={cn(
          "pointer-events-auto flex w-full flex-col items-center gap-y-4 rounded-[1.875rem] border-2 border-dashed border-border-card bg-black/40 py-6",
          "transition-[border-color] duration-150 ease-in-out hover:border-gray-500",
          "animate-onboarding-enter motion-reduce:animate-none",
        )}
      >
        <p className="text-lg font-semibold text-white text-center">
          <span className="text-Label-AccentPrimary">BEST XI</span>을
          선정해보세요.
        </p>
        <p className="text-sm text-white text-center font-semibold">
          팀 관리 {">"} 베스트 11 관리에서 <br /> 설정할 수 있습니다.
        </p>
        <Link
          href="/team-management/best-eleven"
          className={onboardingCtaLinkClassName}
        >
          설정하기
        </Link>
      </div>
    </div>
  );
};

export default OnboardingBestXl;
