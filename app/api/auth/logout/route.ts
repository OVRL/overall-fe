import { NextRequest, NextResponse } from "next/server";
import { SELECTED_TEAM_ID_COOKIE_KEY } from "@/lib/cookie/selectedTeamId";
import { logoutBackend } from "@/lib/auth/logout";
import { env } from "@/lib/env";

const AUTH_COOKIE_KEYS = [
  "accessToken",
  "refreshToken",
  "userId",
  SELECTED_TEAM_ID_COOKIE_KEY,
] as const;

/**
 * 백엔드 logout API 호출 후 인증 쿠키를 삭제하고 redirect 쿼리로 리다이렉트합니다.
 * GET /api/auth/logout?redirect=/login/social
 */
export async function GET(request: NextRequest) {
  const redirectTo =
    request.nextUrl.searchParams.get("redirect") ?? "/login/social";

  const refreshToken =
    request.cookies.get("refreshToken")?.value ??
    (process.env.NODE_ENV === "development" ? env.DEV_REFRESH_TOKEN : undefined);

  if (refreshToken) {
    await logoutBackend(refreshToken);
  }

  const response = NextResponse.redirect(new URL(redirectTo, request.url));

  for (const key of AUTH_COOKIE_KEYS) {
    response.cookies.set(key, "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return response;
}
