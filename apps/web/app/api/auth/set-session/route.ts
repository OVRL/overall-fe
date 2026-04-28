import { NextRequest, NextResponse } from "next/server";

type Body = {
  accessToken?: string;
  refreshToken?: string;
  userId?: string | number;
};

/**
 * 클라이언트가 받은 JWT 등을 httpOnly 쿠키로 저장합니다.
 * GraphQL socialLogin 성공 후 프론트에서 한 번 호출합니다.
 *
 * POST /api/auth/set-session  JSON: { accessToken, refreshToken?, userId? }
 */
export async function POST(request: NextRequest) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "잘못된 JSON" }, { status: 400 });
  }

  const accessToken = body.accessToken;
  if (!accessToken || typeof accessToken !== "string") {
    return NextResponse.json(
      { ok: false, error: "accessToken이 필요합니다." },
      { status: 400 },
    );
  }

  const refreshToken =
    typeof body.refreshToken === "string" ? body.refreshToken : undefined;
  const userId =
    body.userId != null && body.userId !== ""
      ? String(body.userId)
      : undefined;

  const res = NextResponse.json({ ok: true });

  const cookieBase = {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/" as const,
  };

  res.cookies.set("accessToken", accessToken, {
    ...cookieBase,
    maxAge: 60 * 60,
  });

  if (refreshToken) {
    res.cookies.set("refreshToken", refreshToken, {
      ...cookieBase,
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  if (userId) {
    res.cookies.set("userId", userId, {
      ...cookieBase,
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return res;
}
