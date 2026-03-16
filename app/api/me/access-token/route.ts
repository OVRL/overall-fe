import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * 쿠키의 accessToken만 반환. 클라이언트에서 백엔드 GraphQL 직접 호출할 때 사용 (디버깅/로컬 확인용).
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { accessToken: null, error: "쿠키에 accessToken 없음" },
        { status: 200 },
      );
    }
    return NextResponse.json({ accessToken, error: null });
  } catch (err) {
    console.error("GET /api/me/access-token 예외:", err);
    return NextResponse.json(
      { accessToken: null, error: err instanceof Error ? err.message : "서버 오류" },
      { status: 200 },
    );
  }
}
