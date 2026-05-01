import type { NativeSocialProvider } from "@/components/login/NativeSocialLoginScreen";
import { persistNativeAuthSession } from "@/lib/nativeWebSession";

import { isSocialLoginNotRegisteredMessage } from "./isSocialLoginNotRegisteredMessage";
import type { SocialOauthSnapshotPayload } from "./nativeSocialTypes";
import { SOCIAL_OAUTH_SNAPSHOT_STORAGE_KEY } from "./nativeSocialTypes";

const SOCIAL_LOGIN_MUTATION = `
  mutation NativeSocialLogin($input: SocialLoginInput!) {
    socialLogin(input: $input) {
      id
      email
      tokens {
        id
        accessToken
        refreshToken
      }
    }
  }
`;

function toGqlProvider(
  p: NativeSocialProvider,
): "KAKAO" | "NAVER" | "GOOGLE" {
  if (p === "kakao") return "KAKAO";
  if (p === "naver") return "NAVER";
  return "GOOGLE";
}

type SocialLoginResult =
  | { kind: "ok" }
  | { kind: "not_registered"; snapshot: SocialOauthSnapshotPayload }
  | { kind: "error"; message: string };

function pickLatestAppToken(
  tokens: Array<{
    id?: number | null;
    accessToken?: string | null;
    refreshToken?: string | null;
  } | null | undefined>,
): { accessToken: string; refreshToken?: string | null } | null {
  const withAt = (tokens ?? []).filter(
    (t) => t?.accessToken && String(t.accessToken).length > 0,
  ) as Array<{
    id: number;
    accessToken: string;
    refreshToken?: string | null;
  }>;
  if (withAt.length === 0) return null;
  return withAt.reduce((a, b) => (b.id > a.id ? b : a));
}

/** Relay 웹과 동일 입력으로 소셜 로그인 후 세션 저장 (미가입 시 스냅샷만 반환) */
export async function completeNativeSocialLogin(params: {
  webOrigin: string;
  provider: NativeSocialProvider;
  providerAccessToken: string;
  email: string | null;
  userMe: unknown | null;
}): Promise<SocialLoginResult> {
  const { webOrigin, provider, providerAccessToken, email, userMe } = params;

  if (!email) {
    return {
      kind: "error",
      message: "이메일 동의·수집이 없어 계속할 수 없습니다. 웹 동의 항목을 확인해 주세요.",
    };
  }

  const graphqlRes = await fetch(`${webOrigin}/api/graphql`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: SOCIAL_LOGIN_MUTATION,
      variables: {
        input: {
          accessToken: providerAccessToken,
          email,
          provider: toGqlProvider(provider),
        },
      },
    }),
  });

  const raw = (await graphqlRes.json()) as {
    data?: {
      socialLogin?: {
        id: string | number;
        tokens?: Array<{
          id: number;
          accessToken?: string | null;
          refreshToken?: string | null;
        } | null>;
      };
    };
    errors?: Array<{ message?: string }>;
  };

  const firstErr = raw.errors?.[0]?.message ?? "";
  if (firstErr && isSocialLoginNotRegisteredMessage(firstErr)) {
    return {
      kind: "not_registered",
      snapshot: {
        provider,
        accessToken: providerAccessToken,
        email,
        userMe,
        savedAt: new Date().toISOString(),
      },
    };
  }

  if (firstErr) {
    return { kind: "error", message: firstErr };
  }

  const user = raw.data?.socialLogin;
  const appTok = user?.tokens
    ? pickLatestAppToken(user.tokens)
    : null;
  if (!user || !appTok?.accessToken) {
    return { kind: "error", message: "로그인 토큰을 받지 못했습니다." };
  }

  await persistNativeAuthSession(webOrigin, {
    accessToken: appTok.accessToken,
    refreshToken: appTok.refreshToken,
    userId: user.id,
  });

  return { kind: "ok" };
}

/** WebView `sessionStorage` + `/privacy-consent` 핸드오프 (웹 `SocialCallbackAutoLogin` 정합) */
export function buildPrivacyConsentHandoffScript(snapshot: SocialOauthSnapshotPayload): string {
  return `(function(){
    try {
      sessionStorage.setItem(${JSON.stringify(SOCIAL_OAUTH_SNAPSHOT_STORAGE_KEY)}, ${JSON.stringify(JSON.stringify(snapshot))});
    } catch (e) {}
    window.location.replace("/privacy-consent");
  })(); true;`;
}
