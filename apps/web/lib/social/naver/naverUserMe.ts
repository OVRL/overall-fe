import { env } from "@/lib/env";

export type NaverExchangeResult =
  | { ok: true; userMe: unknown }
  | { ok: false; error: unknown };

async function requestNaverToken(params: {
  code: string;
  state: string;
  redirectUri: string;
}) {
  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("client_id", env.NAVER_CLIENT_ID);
  body.set("client_secret", env.NAVER_CLIENT_SECRET);
  body.set("code", params.code);
  body.set("state", params.state);
  body.set("redirect_uri", params.redirectUri);

  const res = await fetch("https://nid.naver.com/oauth2.0/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body,
    cache: "no-store",
  });

  const json = (await res.json()) as unknown;
  if (!res.ok) {
    return { ok: false as const, error: json };
  }

  return {
    ok: true as const,
    data: json as { access_token?: string; token_type?: string },
  };
}

async function requestNaverUserMe(accessToken: string) {
  const res = await fetch("https://openapi.naver.com/v1/nid/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const json = (await res.json()) as unknown;
  if (!res.ok) {
    return { ok: false as const, error: json };
  }
  return { ok: true as const, data: json };
}

/** 인가 코드로 액세스 토큰 발급 후 `/v1/nid/me` 조회 */
export async function exchangeNaverCodeForUserMe(params: {
  code: string;
  state: string;
  redirectUri: string;
}): Promise<NaverExchangeResult> {
  const tokenRes = await requestNaverToken(params);

  if (!tokenRes.ok) {
    return { ok: false, error: tokenRes.error };
  }

  const accessToken = tokenRes.data.access_token;
  if (!accessToken) {
    return { ok: false, error: "naver access_token을 받지 못했습니다." };
  }

  const userMeRes = await requestNaverUserMe(accessToken);
  if (!userMeRes.ok) {
    return { ok: false, error: userMeRes.error };
  }

  return { ok: true, userMe: userMeRes.data };
}
