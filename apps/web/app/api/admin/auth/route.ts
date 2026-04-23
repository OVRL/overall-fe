import { NextRequest, NextResponse } from "next/server";
import { adminStore } from "@/lib/admin-store";
import { cookies } from "next/headers";

/** 쿠키에서 현재 로그인한 사용자 이메일을 가져오는 헬퍼 */
async function getCurrentUserEmail(
  request: NextRequest,
): Promise<string | null> {
  // 헤더에서 이메일 가져오기 (클라이언트에서 전송)
  return request.headers.get("x-user-email");
}

/** GET /api/admin/auth — 현재 사용자의 어드민 여부 확인 */
export async function GET(request: NextRequest) {
  const email = await getCurrentUserEmail(request);
  if (!email) {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }

  const admin = adminStore.getAdmin(email);
  if (!admin) {
    return NextResponse.json({ isAdmin: false }, { status: 403 });
  }

  return NextResponse.json({
    isAdmin: true,
    role: admin.role,
    email: admin.email,
  });
}

/** POST /api/admin/auth — 어드민 권한 부여 */
export async function POST(request: NextRequest) {
  const email = await getCurrentUserEmail(request);
  if (!email) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const { targetEmail } = body;

  if (!targetEmail) {
    return NextResponse.json(
      { error: "대상 이메일을 입력해주세요." },
      { status: 400 },
    );
  }

  const result = adminStore.grantAdmin(targetEmail, email);
  if (!result) {
    return NextResponse.json(
      { error: "권한이 없습니다. 슈퍼어드민만 권한을 부여할 수 있습니다." },
      { status: 403 },
    );
  }

  return NextResponse.json(result, { status: 201 });
}

/** DELETE /api/admin/auth — 어드민 권한 회수 */
export async function DELETE(request: NextRequest) {
  const email = await getCurrentUserEmail(request);
  if (!email) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const targetEmail = searchParams.get("email");

  if (!targetEmail) {
    return NextResponse.json(
      { error: "대상 이메일을 입력해주세요." },
      { status: 400 },
    );
  }

  const success = adminStore.revokeAdmin(targetEmail, email);
  if (!success) {
    return NextResponse.json(
      { error: "권한이 없거나 대상을 찾을 수 없습니다." },
      { status: 403 },
    );
  }

  return NextResponse.json({ success: true });
}
