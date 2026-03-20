import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** 온보딩 패널 CTA 링크 공통 스타일 (터치 피드백·포커스·reduced motion) */
export const onboardingCtaLinkClassName = cn(
  buttonVariants({ size: "m", variant: "primary" }),
  "inline-flex w-fit min-h-11 min-w-11 items-center justify-center px-3 py-1.5 text-xm font-semibold bg-(--color-toast-success-bg) text-Label-AccentPrimary rounded-[0.625rem] shrink-0",
  "touch-manipulation transition-transform duration-150 ease-out motion-reduce:transition-none",
  "active:scale-[0.98] motion-reduce:active:scale-100",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Fill_AccentPrimary focus-visible:ring-offset-2 focus-visible:ring-offset-black/50",
);
