import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

type AlertModalProps = {
  children: ReactNode;
  className?: string;
};

/**
 * 확인 버튼이 하나뿐인 알림용 모달 컨테이너입니다. ConfirmModal과 동일한 카드 스타일을 사용합니다.
 */
export function AlertModal({ children, className }: AlertModalProps) {
  return (
    <div
      className={cn(
        "w-[90vw] max-w-85 md:max-w-100 bg-surface-card border border-border-card rounded-xl p-5 md:p-6 flex flex-col gap-6 shadow-xl",
        className,
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

function Title({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-white text-lg md:text-xl font-semibold text-center whitespace-pre-wrap",
        className,
      )}
    >
      {children}
    </h2>
  );
}

function Description({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-white/90 text-sm md:text-base font-normal text-center whitespace-pre-wrap mt-2",
        className,
      )}
    >
      {children}
    </p>
  );
}

function Actions({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("flex w-full", className)}>{children}</div>;
}

function PrimaryButton({
  children,
  onClick,
  className,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="primary"
      size="l"
      className={cn("w-full", className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

AlertModal.Title = Title;
AlertModal.Description = Description;
AlertModal.Actions = Actions;
AlertModal.PrimaryButton = PrimaryButton;
