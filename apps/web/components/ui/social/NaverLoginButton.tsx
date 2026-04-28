"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { env } from "@/lib/env";

type Props = {
  className?: string;
  leftIcon?: React.ReactNode;
  label: string;
};

/** OAuth state(CSRF 방지용). 네이버 로그인 개발가이드 요청 변수 state와 동일 목적입니다. */
function createState(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

/**
 * 네이버 로그인 연동 URL 생성 (개발가이드 3.4.2)
 * https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=...&redirect_uri=...&state=...
 */
export function NaverLoginButton({ className, leftIcon, label }: Props) {
  const redirectUri = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/social/naver/callback`;
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

        await fetch("/api/auth/oauth/state", {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ provider: "naver", state }),
        });

        const url = new URL("https://nid.naver.com/oauth2.0/authorize");
        url.searchParams.set("response_type", "code");
        url.searchParams.set("client_id", env.NEXT_PUBLIC_NAVER_LOGIN_CLIENT_ID);
        url.searchParams.set("redirect_uri", redirectUri);
        url.searchParams.set("state", state);

        window.location.assign(url.toString());
      }}
    >
      {label}
    </Button>
  );
}
