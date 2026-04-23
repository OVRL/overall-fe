import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "size-6",
  md: "size-8",
} as const;

export interface LoadingSpinnerProps {
  /** 스크린 리더용 로딩 문구 (접근성 필수) */
  label: string;
  /** 스피너 크기. 버튼 내부 등은 sm, 모달/큰 영역은 md */
  size?: keyof typeof sizeClasses;
  className?: string;
}

/**
 * 접근성(sr-only + aria-hidden)을 갖춘 로딩 스피너.
 * 버튼/폼 제출 중, 모달 로딩 등에서 재사용.
 */
export function LoadingSpinner({
  label,
  size = "sm",
  className,
}: LoadingSpinnerProps) {
  return (
    <>
      <span className="sr-only">{label}</span>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-Fill_Quatiary border-t-Fill_AccentPrimary",
          sizeClasses[size],
          className,
        )}
        aria-hidden
      />
    </>
  );
}
