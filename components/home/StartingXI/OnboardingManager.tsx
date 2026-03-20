import Link from "@/components/Link";
import { cn } from "@/lib/utils";
import { onboardingCtaLinkClassName } from "./onboardingCtaLinkClass";

const OnboardingManager = () => {
  return (
    <div
      className={cn(
        "flex w-102.25 items-center justify-between gap-4 rounded-[1.875rem] border-2 border-dashed border-border-card bg-black/40 p-6",
        "transition-[border-color] duration-150 ease-in-out hover:border-gray-500",
        "animate-onboarding-enter motion-reduce:animate-none",
      )}
    >
      <h3 className="text-lg font-semibold text-Label-AccentPrimary">감독</h3>
      <p className="text-sm text-gray-400 text-center font-semibold">
        <span className="text-white">
          팀 관리 {">"} 팀 설정 {">"} 선수단
        </span>
        에서 <br /> 설정할 수 있습니다.
      </p>
      <Link
        href="/team-management/best-eleven"
        className={onboardingCtaLinkClassName}
      >
        설정하기
      </Link>
    </div>
  );
};

export default OnboardingManager;
