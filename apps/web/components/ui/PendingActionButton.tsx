import type { ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";

/**
 * `Button` + `LoadingSpinner` 조합.
 * 뮤테이션·폼 제출 등 이 버튼이 연 비동기 작업이 끝날 때까지 스피너·비활성·`aria-busy`를 일관되게 적용한다.
 * 소셜 OAuth처럼 `leftIcon`만 스피너로 바꾸는 패턴은 이 컴포넌트 대상이 아니다.
 */
export type PendingActionButtonProps = Omit<ButtonProps, "children" | "aria-busy"> & {
  /** pending이 아닐 때 표시할 버튼 내용 */
  children: ReactNode;
  /** 이 버튼에서 실행한 비동기 작업이 진행 중이면 true */
  pending: boolean;
  /** pending일 때 `LoadingSpinner`에 전달하는 스크린 리더용 문구 */
  pendingLabel: string;
  /** 스피너 크기. 버튼 내부는 기본 `sm` */
  spinnerSize?: "sm" | "md";
};

/**
 * 비동기 액션이 진행 중일 때 스피너로 children을 대체하고, `disabled`·`aria-busy`·`cursor-wait`를 맞춘다.
 * `disabled`는 그대로 병합되며, `pending`이 true이면 항상 비활성으로 둔다.
 */
export function PendingActionButton({
  children,
  pending,
  pendingLabel,
  spinnerSize = "sm",
  disabled,
  className,
  ...rest
}: PendingActionButtonProps) {
  return (
    <Button
      {...rest}
      disabled={!!disabled || pending}
      aria-busy={pending}
      className={cn(pending && "cursor-wait", className)}
    >
      {pending ? (
        <LoadingSpinner label={pendingLabel} size={spinnerSize} />
      ) : (
        children
      )}
    </Button>
  );
}

PendingActionButton.displayName = "PendingActionButton";
