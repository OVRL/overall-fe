"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/lib/toast";

const MESSAGES: Record<
  string,
  { title: string; description?: string }
> = {
  unsupported_provider: {
    title: "지원하지 않는 로그인 방식입니다.",
  },
  oauth_provider: {
    title: "소셜 로그인이 취소되었거나 오류가 발생했습니다.",
  },
  missing_code: {
    title: "인가 코드를 받지 못했습니다.",
    description: "다시 로그인해 주세요.",
  },
  missing_host: {
    title: "요청 정보를 확인할 수 없습니다.",
    description: "다시 시도해 주세요.",
  },
  missing_state: {
    title: "보안 검증(state)에 실패했습니다.",
    description: "다시 로그인해 주세요.",
  },
  state_mismatch: {
    title: "보안 검증에 실패했습니다.",
    description: "다시 로그인해 주세요.",
  },
  missing_pkce: {
    title: "구글 로그인 세션이 만료되었습니다.",
    description: "다시 시도해 주세요.",
  },
  exchange_failed: {
    title: "소셜 계정 정보를 가져오지 못했습니다.",
    description: "네트워크·VPN·방화벽을 확인한 뒤 다시 시도해 주세요.",
  },
};

/** 소셜 콜백에서 `?socialErr=` 과 함께 리다이렉트된 경우 한 번만 토스트 후 쿼리 제거 */
export function SocialOAuthCallbackToast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const consumedRef = useRef(false);

  useEffect(() => {
    const code = searchParams.get("socialErr");
    if (!code) {
      consumedRef.current = false;
      return;
    }
    if (consumedRef.current) return;
    consumedRef.current = true;

    const preset = MESSAGES[code];
    if (preset) {
      toast.error(preset.title, {
        ...(preset.description ? { description: preset.description } : {}),
      });
    } else {
      toast.error("소셜 로그인 처리 중 문제가 발생했습니다.");
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("socialErr");
    const qs = nextParams.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchParams, pathname, router]);

  return null;
}
