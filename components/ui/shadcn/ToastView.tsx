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

/** 토스트 공통 컨테이너 스타일 (success 디자인을 기본으로) */
const TOAST_BASE_CONTAINER = cn(
  "rounded-2xl border border-[var(--color-toast-success-border)] bg-[var(--color-toast-success-bg)]",
  "shadow-[var(--shadow-toast-success)]",
  "min-w-80 max-w-100 w-full",
  "text-[var(--color-white)]",
);

const TOAST_ICON_CLASS = "size-5 shrink-0";

const typeIcons: Record<ToastViewType, React.ReactNode | null> = {
  default: null,
  success: <Icon src={checkCircle} className={TOAST_ICON_CLASS} aria-hidden />,
  error: <XCircle className={TOAST_ICON_CLASS} aria-hidden />,
  warning: <AlertTriangle className={TOAST_ICON_CLASS} aria-hidden />,
  info: <Info className={TOAST_ICON_CLASS} aria-hidden />,
  loading: (
    <Loader2 className={cn(TOAST_ICON_CLASS, "animate-spin")} aria-hidden />
  ),
};

const typeStyles = (Object.keys(typeIcons) as ToastViewType[]).reduce(
  (acc, type) => {
    acc[type] = { container: TOAST_BASE_CONTAINER, icon: typeIcons[type] };
    return acc;
  },
  {} as Record<
    ToastViewType,
    { container: string; icon: React.ReactNode | null }
  >,
);

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
          <p className="text-sm font-semibold leading-normal w-66 truncate text-(--color-white)">
            {title}
          </p>
          {description != null && description !== "" && (
            <p className="mt-1 text-sm leading-normal text-white/80">
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
