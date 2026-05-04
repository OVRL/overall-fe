"use client";

import { useEffect, useRef } from "react";
import { applySessionFromTokens } from "@/lib/auth/applySessionFromTokens";
import type { CallbackProvider } from "@/lib/social/extractSocialEmail";
import {
  SOCIAL_OAUTH_SNAPSHOT_STORAGE_KEY,
  type SocialOauthSnapshot,
} from "@/lib/social/socialOauthStorage";
import { isSocialLoginNotRegisteredError } from "@/lib/social/isSocialLoginNotRegisteredError";
import { useSocialLoginMutation } from "./useSocialLoginMutation";

/** Relay `socialLogin` 선택 필드와 동일한 형태(LoginResponseModel 일부). */
type SocialLoginRelayPayload = {
  readonly id: number;
  readonly accessToken: string | null | undefined;
  readonly refreshToken: string | null | undefined;
};

type GraphQLProvider = "KAKAO" | "NAVER" | "GOOGLE";

function toGraphQLProvider(provider: CallbackProvider): GraphQLProvider {
  const map: Record<CallbackProvider, GraphQLProvider> = {
    kakao: "KAKAO",
    naver: "NAVER",
    google: "GOOGLE",
  };
  return map[provider];
}

/** React Strict Mode 이중 effect·재방문 시 동일 토큰으로 중복 뮤테이션 방지 */
const socialLoginStartedForAccessToken = new Set<string>();

type Props = {
  provider: CallbackProvider;
  accessToken: string | null;
  email: string | null;
  userMe: unknown | null;
  oauthOk: boolean;
};

export function SocialCallbackAutoLogin({
  provider,
  accessToken,
  email,
  userMe,
  oauthOk,
}: Props) {
  const [commit] = useSocialLoginMutation();
  const emailMissingRedirect = useRef(false);

  /** 이메일 없음 → 소셜 로그인 화면으로 (버튼 없이 자동 이동) */
  useEffect(() => {
    if (!oauthOk || email || emailMissingRedirect.current) return;
    emailMissingRedirect.current = true;
    window.location.replace("/login/social");
  }, [oauthOk, email]);

  useEffect(() => {
    if (!oauthOk || !accessToken || !email) return;
    if (socialLoginStartedForAccessToken.has(accessToken)) return;
    socialLoginStartedForAccessToken.add(accessToken);

    const snapshot: SocialOauthSnapshot = {
      provider,
      accessToken,
      email,
      userMe,
      savedAt: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem(
        SOCIAL_OAUTH_SNAPSHOT_STORAGE_KEY,
        JSON.stringify(snapshot),
      );
    } catch {
      // 스토리지 불가 시에도 로그인 시도는 계속
    }

    commit({
      variables: {
        input: {
          accessToken,
          email,
          provider: toGraphQLProvider(provider),
        },
      },
      onCompleted: (response) => {
        void (async () => {
          const login = response.socialLogin as unknown as SocialLoginRelayPayload;
          const at = login.accessToken ?? undefined;
          const rt = login.refreshToken ?? undefined;

          if (!at) {
            socialLoginStartedForAccessToken.delete(accessToken);
            window.location.replace("/login/social");
            return;
          }

          try {
            await applySessionFromTokens({
              accessToken: at,
              refreshToken: rt,
              userId: login.id,
            });
            try {
              sessionStorage.removeItem(SOCIAL_OAUTH_SNAPSHOT_STORAGE_KEY);
            } catch {
              // ignore
            }
            window.location.replace("/");
          } catch {
            socialLoginStartedForAccessToken.delete(accessToken);
            window.location.replace("/login/social");
          }
        })();
      },
      onError: (err) => {
        const message = err?.message ?? "";
        if (isSocialLoginNotRegisteredError(message)) {
          window.location.replace("/privacy-consent");
          return;
        }
        socialLoginStartedForAccessToken.delete(accessToken);
        window.location.replace("/login/social");
      },
    });
  }, [oauthOk, accessToken, email, provider, userMe, commit]);

  /* 화면에는 아무것도 두지 않음 — 스크린리더만 안내 */
  return (
    <p className="sr-only" aria-live="polite">
      로그인 처리 중입니다.
    </p>
  );
}
