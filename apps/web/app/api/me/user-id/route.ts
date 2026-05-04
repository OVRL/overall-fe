import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * 쿠키의 userId만 반환. 백엔드 호출 없이 클라이언트가 /api/graphql 등으로 유저 조회할 때 사용.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get("userId")?.value;
    if (process.env.NODE_ENV === "development") {
      const hasAccess = cookieStore.get("accessToken")?.value != null;
      const hasRefresh = cookieStore.get("refreshToken")?.value != null;
      console.log("[OVRL login/social][api/me/user-id]", {
        hasUserIdCookie: userIdStr != null && userIdStr.length > 0,
        hasAccessCookie: hasAccess,
        hasRefreshCookie: hasRefresh,
      });
    }
    if (!userIdStr) {
      return NextResponse.json({ userId: null, error: "쿠키에 userId 없음" }, { status: 200 });
    }
    const userId = Number(userIdStr);
    if (Number.isNaN(userId)) {
      return NextResponse.json({ userId: null, error: "유효하지 않은 userId" }, { status: 200 });
    }
    return NextResponse.json({ userId, error: null });
  } catch (err) {
    console.error("GET /api/me/user-id 예외:", err);
    return NextResponse.json(
      { userId: null, error: err instanceof Error ? err.message : "서버 오류" },
      { status: 200 },
    );
  }
}
