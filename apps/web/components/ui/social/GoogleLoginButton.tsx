"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { env } from "@/lib/env";
import { createPkcePair } from "@/lib/social/google/googlePkce";

type Props = {
  className?: string;
  leftIcon?: React.ReactNode;
  label: string;
};

/** OAuth state(CSRF 방지). */
function createState(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/**
 * 구글 로그인 — Authorization Code + PKCE (RFC 7636).
 * 공개 클라이언트 Web 앱에서 code_verifier를 httpOnly에 저장하고,
 * 콜백 RSC에서 토큰 교환·userinfo까지 처리합니다.
 */
export function GoogleLoginButton({ className, leftIcon, label }: Props) {
  const redirectUri = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/social/google/callback`;
  }, []);

  return (
    <Button
      size="xl"
      className={cn(className, "cursor-pointer")}
      leftIcon={leftIcon}
      aria-label={label}
      type="button"
      onClick={async () => {
        if (!redirectUri) return;

        const state = createState();
        const { codeVerifier, codeChallenge } = await createPkcePair();

        await fetch("/api/auth/oauth/state", {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            provider: "google",
            state,
            codeVerifier,
          }),
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
      }}
    >
      {label}
    </Button>
  );
}
