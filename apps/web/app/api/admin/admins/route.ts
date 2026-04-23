import { NextRequest, NextResponse } from "next/server";
import { adminStore } from "@/lib/admin-store";

/** GET /api/admin/admins — 어드민 목록 조회 */
export async function GET(request: NextRequest) {
  const email = request.headers.get("x-user-email");
  if (!email || !adminStore.isAdmin(email)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  return NextResponse.json({ admins: adminStore.listAdmins() });
}
