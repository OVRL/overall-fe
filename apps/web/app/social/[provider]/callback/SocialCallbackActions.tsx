"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { toast } from "@/lib/toast";
import type { CallbackProvider } from "@/lib/social/extractSocialEmail";
import {
  SOCIAL_OAUTH_SNAPSHOT_STORAGE_KEY,
  type SocialOauthSnapshot,
} from "@/lib/social/socialOauthStorage";
import { useSocialLoginMutation } from "./useSocialLoginMutation";

type GraphQLProvider = "KAKAO" | "NAVER" | "GOOGLE";

function toGraphQLProvider(provider: CallbackProvider): GraphQLProvider {
  const map: Record<CallbackProvider, GraphQLProvider> = {
    kakao: "KAKAO",
    naver: "NAVER",
    google: "GOOGLE",
  };
  return map[provider];
}

type Props = {
  provider: CallbackProvider;
  /** OAuth 교환 성공 시에만 전달 */
  accessToken: string | null;
  email: string | null;
  userMe: unknown | null;
  oauthOk: boolean;
};

export function SocialCallbackActions({
  provider,
  accessToken,
  email,
  userMe,
  oauthOk,
}: Props) {
  const [commit, isInFlight] = useSocialLoginMutation();
  const [sessionSaved, setSessionSaved] = useState(false);

  const snapshot = useMemo((): SocialOauthSnapshot => {
    return {
      provider,
      accessToken: accessToken ?? "",
      email,
      userMe,
      savedAt: new Date().toISOString(),
    };
  }, [provider, accessToken, email, userMe]);

  useEffect(() => {
    if (!oauthOk || !accessToken) return;
    try {
      sessionStorage.setItem(
        SOCIAL_OAUTH_SNAPSHOT_STORAGE_KEY,
        JSON.stringify(snapshot),
      );
    } catch {
      // 스토리지 불가 환경은 무시
    }
  }, [oauthOk, accessToken, snapshot]);

  const canSubmit = oauthOk && Boolean(accessToken) && Boolean(email);

  return (
    <div className="flex flex-col gap-3 mt-4">
      {!oauthOk ? null : !email ? (
        <p className="text-sm text-Label-Alternative">
          프로필에서 이메일을 찾을 수 없습니다. 카카오는 동의 항목(이메일),
          네이버/구글은 계정 이메일 제공 여부를 확인해 주세요.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          size="l"
          disabled={!canSubmit || isInFlight || sessionSaved}
          onClick={() => {
            if (!accessToken || !email) return;

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
                  const user = response.socialLogin;
                  const tokens = user.tokens ?? [];
                  // tokens는 정렬이 보장되지 않을 수 있어, id가 가장 큰(최신) 토큰을 우선 사용합니다.
                  const latest = tokens
                    .filter((t) => t?.accessToken)
                    .reduce<typeof tokens[number] | null>((acc, cur) => {
                      if (!cur) return acc;
                      if (!acc) return cur;
                      return cur.id > acc.id ? cur : acc;
                    }, null);

                  const at = latest?.accessToken ?? undefined;
                  const rt = latest?.refreshToken ?? undefined;

                  if (!at) {
                    toast.error("앱 세션용 토큰을 받지 못했습니다.", {
                      description:
                        "백엔드 응답의 tokens 필드를 확인해 주세요.",
                    });
                    return;
                  }

                  try {
                    const res = await fetch("/api/auth/set-session", {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      credentials: "same-origin",
                      body: JSON.stringify({
                        accessToken: at,
                        refreshToken: rt,
                        userId: user.id,
                      }),
                    });
                    if (!res.ok) {
                      const j = (await res.json().catch(() => null)) as {
                        error?: string;
                      } | null;
                      throw new Error(j?.error ?? `HTTP ${res.status}`);
                    }
                    setSessionSaved(true);
                    toast.success("로그인되었습니다.");
                    window.location.href = "/";
                  } catch (e) {
                    toast.error("세션 저장에 실패했습니다.", {
                      description:
                        e instanceof Error ? e.message : String(e ?? ""),
                    });
                  }
                })();
              },
              onError: (err) => {
                const message = err?.message ?? "";
                const isNotRegistered =
                  message.includes("가입되지 않은 사용자") ||
                  message.includes("회원가입") ||
                  message.includes("Not Found") ||
                  message.includes("404");

                if (isNotRegistered) {
                  toast.info("가입된 계정이 없어요. 회원가입을 진행합니다.");
                  window.location.replace("/onboarding");
                  return;
                }

                toast.error(message || "소셜 로그인에 실패했습니다.");
              },
            });
          }}
        >
          {sessionSaved ? "로그인 완료" : isInFlight ? "요청 중…" : "로그인하기"}
        </Button>

        <Link href="/login/social">
          <Button size="l" variant="ghost">
            로그인 화면으로
          </Button>
        </Link>
      </div>
    </div>
  );
}
