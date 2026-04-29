"use client";

import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";
import { env } from "@/lib/env";
import { createPkcePair } from "@/lib/social/google/googlePkce";
import {
  createOAuthState,
  postOAuthState,
} from "@/lib/social/oauthStateClient";
import { useOAuthRedirectUri } from "@/hooks/useOAuthRedirectUri";
import {
  SOCIAL_OAUTH_CONNECTING_LABEL,
  useSocialOAuthStart,
} from "@/hooks/useSocialOAuthStart";

type Props = {
  className?: string;
  leftIcon?: React.ReactNode;
  label: string;
};

/**
 * 구글 로그인 — Authorization Code + PKCE (RFC 7636).
 * 공개 클라이언트 Web 앱에서 code_verifier를 httpOnly에 저장하고,
 * 콜백 RSC에서 토큰 교환·userinfo까지 처리합니다.
 */
export function GoogleLoginButton({ className, leftIcon, label }: Props) {
  const { pending, run } = useSocialOAuthStart({
    errorTitle: "구글 로그인을 시작할 수 없습니다.",
  });

  const redirectUri = useOAuthRedirectUri("/social/google/callback");

  return (
    <Button
      size="xl"
      className={cn(className, "cursor-pointer", pending && "cursor-wait")}
      leftIcon={
        pending ? (
          <LoadingSpinner label="구글 로그인 진행 중" size="sm" />
        ) : (
          leftIcon
        )
      }
      aria-label={label}
      aria-busy={pending}
      disabled={pending || !redirectUri}
      type="button"
      onClick={() => {
        if (!redirectUri || pending) return;
        void run(async () => {
          const state = createOAuthState();
          const { codeVerifier, codeChallenge } = await createPkcePair();

          await postOAuthState({
            provider: "google",
            state,
            codeVerifier,
          });

          const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
          url.searchParams.set("client_id", env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
          url.searchParams.set("redirect_uri", redirectUri);
          url.searchParams.set("response_type", "code");
          url.searchParams.set("scope", "openid email profile");
          url.searchParams.set("state", state);
          url.searchParams.set("code_challenge", codeChallenge);
          url.searchParams.set("code_challenge_method", "S256");

          window.location.assign(url.toString());
        });
      }}
    >
      {pending ? SOCIAL_OAUTH_CONNECTING_LABEL : label}
    </Button>
  );
}
