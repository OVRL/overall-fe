"use client";

import { useCallback, useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";
import { env } from "@/lib/env";
import {
  createOAuthState,
  postOAuthState,
} from "@/lib/social/oauthStateClient";
import { useOAuthRedirectUri } from "@/hooks/useOAuthRedirectUri";
import {
  SOCIAL_OAUTH_CONNECTING_LABEL,
  useSocialOAuthStart,
} from "@/hooks/useSocialOAuthStart";

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

export function KakaoLoginButton({ className, leftIcon, label }: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { pending, run } = useSocialOAuthStart({
    errorTitle: "카카오 로그인을 시작할 수 없습니다.",
  });
  const disabled = !ready || Boolean(error) || pending;

  const redirectUri = useOAuthRedirectUri("/social/kakao/callback");

  const authorize = useCallback(async () => {
    await run(async () => {
      if (!window.Kakao) {
        throw new Error("kakao sdk가 준비되지 않았습니다.");
      }
      const state = createOAuthState();
      await postOAuthState({ provider: "kakao", state });
      window.Kakao.Auth.authorize({ redirectUri, state });
    });
  }, [redirectUri, run]);

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
        className={cn(
          className,
          disabled && "cursor-not-allowed",
          pending && "cursor-wait",
        )}
        leftIcon={
          pending ? (
            <LoadingSpinner label="카카오 로그인 진행 중" size="sm" />
          ) : (
            leftIcon
          )
        }
        disabled={disabled}
        aria-busy={pending}
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
        {error ? "카카오 로그인 준비 실패" : pending ? SOCIAL_OAUTH_CONNECTING_LABEL : label}
      </Button>
    </>
  );
}
