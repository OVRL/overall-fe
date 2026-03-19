"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useTheme } from "next-themes";
import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

/**
 * 헤드리스 Toaster
 * - 토스트 UI는 ToastView에서 전부 렌더링 (toast.custom 사용)
 * - 이 컴포넌트는 Sonner 컨테이너만 담당: unstyled, 닫기/아이콘 없음
 * - position: 768px 이상 bottom-right, 미만 bottom-center (useIsMobile 767 기준)
 * @see https://sonner.emilkowal.ski/styling#headless--tailwindcss
 */
export function Toaster({
  toastOptionsOverride,
}: {
  toastOptionsOverride?: ToasterProps["toastOptions"];
} = {}) {
  const { resolvedTheme } = useTheme();
  const isMobile = useIsMobile(767);
  const position = isMobile ? "bottom-center" : "bottom-right";
  return (
    <SonnerToaster
      position={position}
      expand={false}
      visibleToasts={3}
      closeButton={false}
      toastOptions={{
        unstyled: true,
        ...toastOptionsOverride,
      }}
      theme={(resolvedTheme as "light" | "dark") ?? "dark"}
      dir="ltr"
    />
  );
}
