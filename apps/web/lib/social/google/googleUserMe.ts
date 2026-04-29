import { env } from "@/lib/env";
import { safeFetchJson } from "@/lib/social/safeFetchJson";

export type GoogleExchangeResult =
  | { ok: true; accessToken: string; userMe: unknown }
  | { ok: false; error: unknown };

async function exchangeAuthorizationCode(params: {
  code: string;
  redirectUri: string;
  codeVerifier: string;
}) {
  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("code", params.code);
  body.set("redirect_uri", params.redirectUri);
  body.set("client_id", env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  body.set("code_verifier", params.codeVerifier);
  if (env.GOOGLE_CLIENT_SECRET) {
    body.set("client_secret", env.GOOGLE_CLIENT_SECRET);
  }

  const res = await safeFetchJson("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body,
  });

  if (!res.ok) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[google] token 요청 실패", res.error);
    }
    return { ok: false as const, error: res.error };
  }

  return {
    ok: true as const,
    data: res.data as { access_token?: string },
  };
}

async function requestGoogleUserInfo(accessToken: string) {
  const res = await safeFetchJson(
    "https://openidconnect.googleapis.com/v1/userinfo",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!res.ok) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[google] userinfo 요청 실패", res.error);
    }
    return { ok: false as const, error: res.error };
  }
  return { ok: true as const, data: res.data };
}

/** PKCE로 받은 code → 토큰 → OpenID userinfo */
export async function exchangeGoogleCodeForUserMe(params: {
  code: string;
  redirectUri: string;
  codeVerifier: string;
}): Promise<GoogleExchangeResult> {
  const tokenRes = await exchangeAuthorizationCode(params);

  if (!tokenRes.ok) {
    return { ok: false, error: tokenRes.error };
  }

  const accessToken = tokenRes.data.access_token;
  if (!accessToken) {
    return { ok: false, error: "google access_token을 받지 못했습니다." };
  }

  const userInfoRes = await requestGoogleUserInfo(accessToken);
  if (!userInfoRes.ok) {
    return { ok: false, error: userInfoRes.error };
  }

  return { ok: true, accessToken, userMe: userInfoRes.data };
}
