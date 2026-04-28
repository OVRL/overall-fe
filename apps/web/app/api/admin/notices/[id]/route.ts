import { NextRequest, NextResponse } from "next/server";
import { adminStore } from "@/lib/admin-store";
import { noticeStore } from "@/lib/notice-store";

function getRequesterEmail(req: NextRequest): string | null {
  return req.headers.get("x-user-email");
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const email = getRequesterEmail(req);
  if (!email || !adminStore.isAdmin(email)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();
  const updated = noticeStore.update(id, body);
  if (!updated) return NextResponse.json({ error: "공지를 찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json({ ok: true, notice: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const email = getRequesterEmail(req);
  if (!email || !adminStore.isAdmin(email)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }
  const { id } = await params;
  const ok = noticeStore.delete(id);
  if (!ok) return NextResponse.json({ error: "공지를 찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
