"use client";

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

type Props = {
  className?: string;
  leftIcon?: React.ReactNode;
  label: string;
};

/**
 * 네이버 로그인 연동 URL 생성 (개발가이드 3.4.2)
 * https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=...&redirect_uri=...&state=...
 */
export function NaverLoginButton({ className, leftIcon, label }: Props) {
  const { pending, run } = useSocialOAuthStart({
    errorTitle: "네이버 로그인을 시작할 수 없습니다.",
  });

  const redirectUri = useOAuthRedirectUri("/social/naver/callback");

  return (
    <Button
      size="xl"
      className={cn(className, "cursor-pointer", pending && "cursor-wait")}
      leftIcon={
        pending ? (
          <LoadingSpinner label="네이버 로그인 진행 중" size="sm" />
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
          await postOAuthState({ provider: "naver", state });

          const url = new URL("https://nid.naver.com/oauth2.0/authorize");
          url.searchParams.set("response_type", "code");
          url.searchParams.set(
            "client_id",
            env.NEXT_PUBLIC_NAVER_LOGIN_CLIENT_ID,
          );
          url.searchParams.set("redirect_uri", redirectUri);
          url.searchParams.set("state", state);

          window.location.assign(url.toString());
        });
      }}
    >
      {pending ? SOCIAL_OAUTH_CONNECTING_LABEL : label}
    </Button>
  );
}
