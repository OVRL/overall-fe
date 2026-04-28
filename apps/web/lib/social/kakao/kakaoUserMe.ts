import { env } from "@/lib/env";

export type KakaoExchangeResult =
  | { ok: true; accessToken: string; userMe: unknown }
  | { ok: false; error: unknown };

async function requestKakaoToken(params: {
  code: string;
  redirectUri: string;
}) {
  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("client_id", env.KAKAO_REST_API_KEY);
  body.set("redirect_uri", params.redirectUri);
  body.set("code", params.code);
  if (env.KAKAO_CLIENT_SECRET) {
    body.set("client_secret", env.KAKAO_CLIENT_SECRET);
  }

  const res = await fetch("https://kauth.kakao.com/oauth/token", {
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

  return { ok: true as const, data: json as { access_token?: string } };
}

async function requestKakaoUserMe(accessToken: string) {
  const res = await fetch("https://kapi.kakao.com/v2/user/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    cache: "no-store",
  });

  const json = (await res.json()) as unknown;
  if (!res.ok) {
    return { ok: false as const, error: json };
  }
  return { ok: true as const, data: json };
}

/** 인가 코드로 액세스 토큰 발급 후 `/v2/user/me` 조회 */
export async function exchangeKakaoCodeForUserMe(params: {
  code: string;
  redirectUri: string;
}): Promise<KakaoExchangeResult> {
  const tokenRes = await requestKakaoToken(params);

  if (!tokenRes.ok) {
    return { ok: false, error: tokenRes.error };
  }

  const accessToken = tokenRes.data.access_token;
  if (!accessToken) {
    return { ok: false, error: "kakao access_token을 받지 못했습니다." };
  }

  const userMeRes = await requestKakaoUserMe(accessToken);
  if (!userMeRes.ok) {
    return { ok: false, error: userMeRes.error };
  }

  return { ok: true, accessToken, userMe: userMeRes.data };
}
