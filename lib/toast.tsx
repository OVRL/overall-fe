"use client";

/**
 * 토스트 횡단관심사 (헤드리스)
 * - Sonner toast.custom() + ToastView로 UI 완전 제어
 * - 사용 예: toast.success("저장됨"), toast.error("실패", { description: "..." })
 */
import { toast as sonnerToast } from "sonner";
import { ToastView, type ToastViewType } from "@/components/ui/shadcn/ToastView";

const DEFAULT_DURATION = 4000;

export type ToastOptions = {
  description?: string;
  duration?: number;
  /** 닫기 버튼 위치 (기본: right) */
  closeButtonPosition?: "left" | "right";
  action?: { label: string; onClick: () => void };
  cancel?: { label: string; onClick: () => void };
};

function renderToast(
  type: ToastViewType,
  title: string,
  options: ToastOptions | undefined,
  onClose: () => void
) {
  return (
    <ToastView
      type={type}
      title={title}
      description={options?.description}
      onClose={onClose}
      closeButtonPosition={options?.closeButtonPosition ?? "right"}
      action={options?.action}
      cancel={options?.cancel}
    />
  );
}

/** 기본 토스트 */
export function toast(message: string, options?: ToastOptions) {
  return sonnerToast.custom(
    (id) => renderToast("default", message, options, () => sonnerToast.dismiss(id)),
    { duration: options?.duration ?? DEFAULT_DURATION }
  );
}

/** 성공 토스트 */
toast.success = (message: string, options?: ToastOptions) => {
  return sonnerToast.custom(
    (id) => renderToast("success", message, options, () => sonnerToast.dismiss(id)),
    { duration: options?.duration ?? DEFAULT_DURATION }
  );
};

/** 에러 토스트 */
toast.error = (message: string, options?: ToastOptions) => {
  return sonnerToast.custom(
    (id) => renderToast("error", message, options, () => sonnerToast.dismiss(id)),
    { duration: options?.duration ?? DEFAULT_DURATION }
  );
};

/** 경고 토스트 */
toast.warning = (message: string, options?: ToastOptions) => {
  return sonnerToast.custom(
    (id) => renderToast("warning", message, options, () => sonnerToast.dismiss(id)),
    { duration: options?.duration ?? DEFAULT_DURATION }
  );
};

/** 정보 토스트 */
toast.info = (message: string, options?: ToastOptions) => {
  return sonnerToast.custom(
    (id) => renderToast("info", message, options, () => sonnerToast.dismiss(id)),
    { duration: options?.duration ?? DEFAULT_DURATION }
  );
};

/** 로딩 토스트 (반환된 id로 toast.dismiss(id) 호출해 닫기) */
toast.loading = (message: string, options?: ToastOptions) => {
  return sonnerToast.custom(
    (id) => renderToast("loading", message, options, () => sonnerToast.dismiss(id)),
    { duration: options?.duration ?? Infinity }
  );
};

/** Promise 토스트 (로딩 → 성공/실패 시 우리 ToastView로 전환) */
toast.promise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((err: unknown) => string);
  }
) => {
  const id = sonnerToast.custom(
    (tid) => (
      <ToastView
        type="loading"
        title={messages.loading}
        onClose={() => sonnerToast.dismiss(tid)}
      />
    ),
    { duration: Infinity }
  );
  return promise
    .then((data) => {
      sonnerToast.dismiss(id);
      const msg =
        typeof messages.success === "function" ? messages.success(data) : messages.success;
      sonnerToast.custom(
        (tid) => (
          <ToastView
            type="success"
            title={msg}
            onClose={() => sonnerToast.dismiss(tid)}
          />
        ),
        { duration: DEFAULT_DURATION }
      );
      return data;
    })
    .catch((err: unknown) => {
      sonnerToast.dismiss(id);
      const msg =
        typeof messages.error === "function" ? messages.error(err) : messages.error;
      sonnerToast.custom(
        (tid) => (
          <ToastView
            type="error"
            title={msg}
            onClose={() => sonnerToast.dismiss(tid)}
          />
        ),
        { duration: DEFAULT_DURATION }
      );
      throw err;
    });
};

toast.dismiss = sonnerToast.dismiss;

/** 완전 커스텀 JSX (기존 Sonner custom 그대로 노출) */
toast.custom = sonnerToast.custom;
