import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { CallbackProvider } from "@/lib/social/extractSocialEmail";
import { extractEmailFromSocialProfile } from "@/lib/social/extractSocialEmail";
import { exchangeGoogleCodeForUserMe } from "@/lib/social/google/googleUserMe";
import { exchangeKakaoCodeForUserMe } from "@/lib/social/kakao/kakaoUserMe";
import { exchangeNaverCodeForUserMe } from "@/lib/social/naver/naverUserMe";
import { SocialCallbackAutoLogin } from "./SocialCallbackAutoLogin";

export const dynamic = "force-dynamic";

const STATE_COOKIE_PREFIX = "oauth_state_";
const PKCE_COOKIE_PREFIX = "oauth_pkce_";

const LOGIN_SOCIAL = "/login/social";

function redirectToLoginSocial(socialErr: string): never {
  redirect(`${LOGIN_SOCIAL}?socialErr=${encodeURIComponent(socialErr)}`);
}

type PageProps = {
  params: Promise<{ provider: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function SocialCallbackPage({
  params,
  searchParams,
}: PageProps) {
  const { provider } = await params;
  const sp = await searchParams;

  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "";
  const proto = requestHeaders.get("x-forwarded-proto") ?? "http";
  const origin = host ? `${proto}://${host}` : "";
  const redirectUri = origin
    ? `${origin}/social/${provider}/callback`
    : "";

  const code = first(sp.code);
  const state = first(sp.state);
  const oauthError = first(sp.error);

  const cookieStore = await cookies();

  if (provider !== "kakao" && provider !== "naver" && provider !== "google") {
    redirectToLoginSocial("unsupported_provider");
  }

  if (oauthError) {
    redirectToLoginSocial("oauth_provider");
  }

  if (!code) {
    redirectToLoginSocial("missing_code");
  }

  if (!redirectUri) {
    redirectToLoginSocial("missing_host");
  }

  let result:
    | { ok: true; accessToken: string; userMe: unknown }
    | { ok: false; error: unknown };

  const providerKey = provider as CallbackProvider;

  if (provider === "kakao") {
    if (!state) {
      redirectToLoginSocial("missing_state");
    }

    const expected = cookieStore.get(`${STATE_COOKIE_PREFIX}${provider}`)?.value;
    if (!expected || expected !== state) {
      redirectToLoginSocial("state_mismatch");
    }

    result = await exchangeKakaoCodeForUserMe({
      code,
      redirectUri,
    });
  } else if (provider === "google") {
    if (!state) {
      redirectToLoginSocial("missing_state");
    }

    const expectedGoogle = cookieStore.get(
      `${STATE_COOKIE_PREFIX}${provider}`,
    )?.value;
    if (!expectedGoogle || expectedGoogle !== state) {
      redirectToLoginSocial("state_mismatch");
    }

    const codeVerifier = cookieStore.get(
      `${PKCE_COOKIE_PREFIX}${provider}`,
    )?.value;
    if (!codeVerifier) {
      redirectToLoginSocial("missing_pkce");
    }

    result = await exchangeGoogleCodeForUserMe({
      code,
      redirectUri,
      codeVerifier,
    });
  } else {
    if (!state) {
      redirectToLoginSocial("missing_state");
    }

    const expected = cookieStore.get(`${STATE_COOKIE_PREFIX}${provider}`)?.value;
    if (!expected || expected !== state) {
      redirectToLoginSocial("state_mismatch");
    }

    result = await exchangeNaverCodeForUserMe({
      code,
      state,
      redirectUri,
    });
  }

  const emailFromProfile =
    result.ok === true
      ? extractEmailFromSocialProfile(providerKey, result.userMe)
      : null;

  if (result.ok !== true) {
    redirectToLoginSocial("exchange_failed");
  }

  /* OAuth 교환 성공 후 UI 없이 자동 로그인만 수행 — 성공 시 `/`, 미가입 시 `/privacy-consent`→`/onboarding`, 그 외 `/login/social` */
  return (
    <main className="min-h-dvh bg-bg-0">
      <SocialCallbackAutoLogin
        provider={providerKey}
        oauthOk={result.ok === true}
        accessToken={result.accessToken}
        email={emailFromProfile}
        userMe={result.userMe}
      />
    </main>
  );
}
