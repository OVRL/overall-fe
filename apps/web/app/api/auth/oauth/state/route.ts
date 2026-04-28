import { NextRequest, NextResponse } from "next/server";

const STATE_COOKIE_PREFIX = "oauth_state_";
/** 구글 PKCE(code_verifier) 저장용 — authorize 전에 설정하고 콜백에서 토큰 교환 시 사용 */
const PKCE_COOKIE_PREFIX = "oauth_pkce_";

/**
 * 로그인 시작 직전 state를 서버(httpOnly 쿠키)에 저장합니다.
 * 콜백 페이지(RSC)에서 OAuth가 돌려준 state와 비교합니다.
 * 구글 PKCE 시 codeVerifier를 함께 넘기면 별도 httpOnly 쿠키에 저장합니다.
 *
 * POST /api/auth/oauth/state  body: { provider, state, codeVerifier?: string }
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    provider?: string;
    state?: string;
    codeVerifier?: string;
  };

  const provider = body.provider;
  const state = body.state;

  if (!provider || !state) {
    return NextResponse.json(
      { ok: false, error: "provider 또는 state가 없습니다." },
      { status: 400 },
    );
  }

  const res = NextResponse.json({ ok: true });

  const cookieOpts = {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 10,
    path: "/" as const,
  };

  res.cookies.set(`${STATE_COOKIE_PREFIX}${provider}`, state, cookieOpts);

  const codeVerifier = body.codeVerifier;
  if (typeof codeVerifier === "string" && codeVerifier.length > 0) {
    res.cookies.set(`${PKCE_COOKIE_PREFIX}${provider}`, codeVerifier, cookieOpts);
  }

  return res;
}
