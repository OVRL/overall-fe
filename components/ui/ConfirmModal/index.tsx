import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

type ConfirmModalProps = {
  children: ReactNode;
  className?: string;
};

export function ConfirmModal({ children, className }: ConfirmModalProps) {
  return (
    <div
      className={cn(
        "w-[90vw] max-w-93 bg-gray-1200 rounded-[1.25rem] pt-12 pb-3 flex flex-col gap-3",
        className,
      )}
      onClick={(e) => e.stopPropagation()} // Prevent closing via backdrop mapping
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
        "text-white text-[1.4375rem] font-semibold text-center whitespace-pre-wrap",
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
        "text-gray-400 text-center whitespace-pre-wrap font-semibold text-center",
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
  return (
    <div className={cn("flex gap-3 px-6 pt-10 pb-6 w-full", className)}>
      {children}
    </div>
  );
}

function CancelButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="l"
      className={cn("flex-1", className)}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function ConfirmButton({
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
      className={cn("flex-1", className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

ConfirmModal.Title = Title;
ConfirmModal.Description = Description;
ConfirmModal.Actions = Actions;
ConfirmModal.CancelButton = CancelButton;
ConfirmModal.ConfirmButton = ConfirmButton;
