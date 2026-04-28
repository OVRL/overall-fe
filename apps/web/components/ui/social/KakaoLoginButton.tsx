"use client";

import { useCallback, useMemo, useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { env } from "@/lib/env";

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Auth: {
        authorize: (options?: { redirectUri?: string; state?: string }) => void;
      };
    };
  }
}

type Props = {
  className?: string;
  leftIcon?: React.ReactNode;
  label: string;
};

function createState(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function KakaoLoginButton({ className, leftIcon, label }: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const disabled = !ready || Boolean(error);

  const redirectUri = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/social/kakao/callback`;
  }, []);

  const authorize = useCallback(async () => {
    if (!window.Kakao) throw new Error("kakao sdk가 준비되지 않았습니다.");
    const state = createState();
    await fetch("/api/auth/oauth/state", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ provider: "kakao", state }),
    });
    window.Kakao.Auth.authorize({ redirectUri, state });
  }, [redirectUri]);

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        strategy="afterInteractive"
        onReady={() => {
          try {
            if (!window.Kakao) throw new Error("kakao sdk가 window에 주입되지 않았습니다.");
            if (!window.Kakao.isInitialized()) {
              window.Kakao.init(env.NEXT_PUBLIC_KAKAO_JS_KEY);
            }
            setReady(true);
          } catch (e) {
            setError(e instanceof Error ? e.message : "알 수 없는 에러");
          }
        }}
        onError={() => setError("kakao sdk 로드 실패")}
        crossOrigin="anonymous"
        data-overall="kakao-sdk"
      />

      <Button
        size="xl"
        className={cn(className, disabled && "cursor-not-allowed")}
        leftIcon={leftIcon}
        aria-disabled={disabled}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          void authorize();
        }}
        type="button"
      >
        {error ? "카카오 로그인 준비 실패" : label}
      </Button>
    </>
  );
}

