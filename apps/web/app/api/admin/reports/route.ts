import { NextRequest, NextResponse } from "next/server";
import { adminStore } from "@/lib/admin-store";
import { reportStore, type ReportStatus } from "@/lib/report-store";

function getRequesterEmail(req: NextRequest): string | null {
  return req.headers.get("x-user-email");
}

export async function GET(req: NextRequest) {
  const email = getRequesterEmail(req);
  if (!email || !adminStore.isAdmin(email)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }
  return NextResponse.json({ reports: reportStore.list(), pendingCount: reportStore.pendingCount() });
}

export async function PATCH(req: NextRequest) {
  const email = getRequesterEmail(req);
  if (!email || !adminStore.isAdmin(email)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const body = await req.json();
  const { id, status, note } = body as { id: string; status: ReportStatus; note?: string };

  if (!id || !status) {
    return NextResponse.json({ error: "id와 status가 필요합니다." }, { status: 400 });
  }

  const updated = reportStore.updateStatus(id, status, email, note);
  if (!updated) return NextResponse.json({ error: "신고를 찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json({ ok: true, report: updated });
}
