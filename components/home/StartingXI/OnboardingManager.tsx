import Link from "@/components/Link";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const OnboardingManager = () => {
  return (
    <div className="border-2 border-dashed border-gray-700 bg-black/40 rounded-[1.875rem] p-6 flex gap-4 w-102.25 justify-between items-center">
      <h3 className="text-lg font-semibold text-Label-AccentPrimary">감독</h3>
      <p className="text-sm text-gray-400 text-center font-semibold">
        <span className="text-white">
          팀 관리 {">"} 팀 설정 {">"} 선수단
        </span>
        에서 <br /> 설정할 수 있습니다.
      </p>
      <Link
        href="/team-management/best-eleven"
        className={cn(
          buttonVariants({ size: "m", variant: "primary" }),
          "text-xm px-3 py-1.5 font-semibold bg-(--color-toast-success-bg) text-Label-AccentPrimary rounded-[0.625rem] w-fit",
        )}
      >
        설정하기
      </Link>
    </div>
  );
};

export default OnboardingManager;
