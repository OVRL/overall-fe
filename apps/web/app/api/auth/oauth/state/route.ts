import { NextRequest, NextResponse } from "next/server";

const STATE_COOKIE_PREFIX = "oauth_state_";

/**
 * 로그인 시작 직전 state를 서버(httpOnly 쿠키)에 저장합니다.
 * 콜백 페이지(RSC)에서 OAuth가 돌려준 state와 비교합니다.
 *
 * POST /api/auth/oauth/state  body: { provider: "naver"|"kakao", state: string }
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    provider?: string;
    state?: string;
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

  res.cookies.set(`${STATE_COOKIE_PREFIX}${provider}`, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/",
  });

  return res;
}
