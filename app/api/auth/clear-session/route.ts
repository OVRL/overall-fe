import { NextRequest, NextResponse } from "next/server";
import { SELECTED_TEAM_ID_COOKIE_KEY } from "@/lib/cookie/selectedTeamId";

const AUTH_COOKIE_KEYS = [
  "accessToken",
  "refreshToken",
  "userId",
  SELECTED_TEAM_ID_COOKIE_KEY,
] as const;

/**
 * 인증 쿠키를 삭제한 뒤 redirect 쿼리로 리다이렉트합니다.
 * layout에서 Unauthorized 시 여기로 보내면 리다이렉트 루프를 막을 수 있습니다.
 * GET /api/auth/clear-session?redirect=/
 */
export async function GET(request: NextRequest) {
  const redirectTo =
    request.nextUrl.searchParams.get("redirect") ?? "/";

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
