"use client";

import { Info, AlertTriangle, XCircle, Loader2, X } from "lucide-react";
import Icon from "../Icon";
import checkCircle from "@/public/icons/check_circle.svg";
import { cn } from "@/lib/utils";

export type ToastViewType =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loading";

const typeStyles: Record<
  ToastViewType,
  { container: string; icon: React.ReactNode }
> = {
  default: {
    container: cn(
      "rounded-lg border border-[var(--color-border-card)] bg-[var(--color-surface-card)]",
      "text-[var(--color-Label-Primary)] shadow-[var(--shadow-card)]",
      "min-w-[280px] max-w-[400px] w-full",
    ),
    icon: null,
  },
  success: {
    container: cn(
      "rounded-2xl border border-[var(--color-toast-success-border)] bg-[var(--color-toast-success-bg)]",
      "shadow-[var(--shadow-toast-success)]",
      "min-w-[320px] max-w-[400px] w-full",
      "text-[var(--color-white)]",
    ),
    icon: <Icon src={checkCircle} className="size-5 shrink-0" aria-hidden />,
  },
  error: {
    container: cn(
      "rounded-lg border border-[var(--color-border-card)] bg-[var(--color-surface-card)]",
      "text-[var(--color-Label-Primary)] shadow-[var(--shadow-card)]",
      "min-w-[280px] max-w-[400px] w-full border-l-4 border-l-[var(--color-Fill_Error)]",
    ),
    icon: <XCircle className="size-5 shrink-0" aria-hidden />,
  },
  warning: {
    container: cn(
      "rounded-lg border border-[var(--color-border-card)] bg-[var(--color-surface-card)]",
      "text-[var(--color-Label-Primary)] shadow-[var(--shadow-card)]",
      "min-w-[280px] max-w-[400px] w-full border-l-4 border-l-[var(--color-Position-GK-Yellow)]",
    ),
    icon: <AlertTriangle className="size-5 shrink-0" aria-hidden />,
  },
  info: {
    container: cn(
      "rounded-lg border border-[var(--color-border-card)] bg-[var(--color-surface-card)]",
      "text-[var(--color-Label-Primary)] shadow-[var(--shadow-card)]",
      "min-w-[280px] max-w-[400px] w-full border-l-4 border-l-[var(--color-blue-400)]",
    ),
    icon: <Info className="size-5 shrink-0" aria-hidden />,
  },
  loading: {
    container: cn(
      "rounded-lg border border-[var(--color-border-card)] bg-[var(--color-surface-card)]",
      "text-[var(--color-Label-Primary)] shadow-[var(--shadow-card)]",
      "min-w-[280px] max-w-[400px] w-full",
    ),
    icon: <Loader2 className="size-5 shrink-0 animate-spin" aria-hidden />,
  },
};

/** 닫기 버튼 위치: 레이아웃에서 순서로 제어 (먼저 오면 왼쪽) */
const closeButtonClass =
  "size-6 rounded-full border-0 bg-transparent text-[var(--color-Label-Tertiary)] hover:bg-white/10 hover:text-[var(--color-Label-Primary)] flex items-center justify-center shrink-0 transition-colors";

export interface ToastViewProps {
  type: ToastViewType;
  title: string;
  description?: string;
  onClose: () => void;
  /** 닫기 버튼을 왼쪽에 둘지 오른쪽에 둘지 (기본: 오른쪽) */
  closeButtonPosition?: "left" | "right";
  action?: { label: string; onClick: () => void };
  cancel?: { label: string; onClick: () => void };
}

/**
 * 헤드리스 토스트 UI - 레이아웃·아이콘·닫기 위치를 모두 이 컴포넌트에서 제어
 * Sonner toast.custom() 안에서 이 컴포넌트를 렌더링해 사용
 */
export function ToastView({
  type,
  title,
  description,
  onClose,
  closeButtonPosition = "right",
  action,
  cancel,
}: ToastViewProps) {
  const { container, icon } = typeStyles[type];
  const isSuccess = type === "success";

  return (
    <div
      className={cn("relative flex items-start gap-3 p-4", container)}
      role="status"
      aria-live="polite"
    >
      {/* 닫기 버튼: closeButtonPosition에 따라 DOM 순서로 배치 */}
      {closeButtonPosition === "left" && (
        <button
          type="button"
          onClick={onClose}
          className={closeButtonClass}
          aria-label="닫기"
        >
          <X className="size-4" />
        </button>
      )}

      <div className="flex min-w-0 flex-1 gap-2">
        {icon != null && (
          <div className="mt-0.5 shrink-0 text-current" aria-hidden>
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm font-semibold leading-normal w-66 truncate",
              isSuccess && "text-(--color-white)",
            )}
          >
            {title}
          </p>
          {description != null && description !== "" && (
            <p
              className={cn(
                "mt-1 text-sm leading-normal",
                isSuccess ? "text-white/80" : "text-(--color-Label-Secondary)",
              )}
            >
              {description}
            </p>
          )}
          {(action != null || cancel != null) && (
            <div className="mt-2 flex gap-2">
              {action != null && (
                <button
                  type="button"
                  onClick={() => {
                    action.onClick();
                    onClose();
                  }}
                  className="rounded-lg bg-(--color-Fill_AccentPrimary) px-3 py-1.5 text-sm font-medium text-(--color-Label-Fixed_black) hover:opacity-90"
                >
                  {action.label}
                </button>
              )}
              {cancel != null && (
                <button
                  type="button"
                  onClick={() => {
                    cancel.onClick();
                    onClose();
                  }}
                  className="rounded-lg border border-border-card bg-transparent px-3 py-1.5 text-sm font-medium text-(--color-Label-Secondary) hover:bg-white/5"
                >
                  {cancel.label}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {closeButtonPosition === "right" && (
        <button
          type="button"
          onClick={onClose}
          className={closeButtonClass}
          aria-label="닫기"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
