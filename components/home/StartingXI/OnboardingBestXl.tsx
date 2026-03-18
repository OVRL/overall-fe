import Link from "@/components/Link";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const OnboardingBestXl = () => {
  return (
    <div className="border-2 border-dashed border-gray-700 bg-black/40 rounded-[1.875rem] py-6 flex flex-col gap-y-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-79 items-center">
      <p className="text-lg font-semibold text-white text-center">
        <span className="text-Label-AccentPrimary">BEST XI</span> 을
        선정해보세요.
      </p>
      <p className="text-sm text-white text-center font-semibold">
        팀 관리 {">"} 베스트 11 관리에서 <br /> 설정할 수 있습니다.
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

export default OnboardingBestXl;
