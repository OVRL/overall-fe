import { NextRequest, NextResponse } from "next/server";
import { adminStore } from "@/lib/admin-store";
import { noticeStore, type NoticeType } from "@/lib/notice-store";

function getRequesterEmail(req: NextRequest): string | null {
  return req.headers.get("x-user-email");
}

export async function GET(req: NextRequest) {
  const email = getRequesterEmail(req);
  if (!email || !adminStore.isAdmin(email)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }
  return NextResponse.json({ notices: noticeStore.list() });
}

export async function POST(req: NextRequest) {
  const email = getRequesterEmail(req);
  if (!email || !adminStore.isAdmin(email)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const body = await req.json();
  const { title, content, type, isPinned, isPublished, startsAt, endsAt } = body as {
    title: string;
    content: string;
    type: NoticeType;
    isPinned?: boolean;
    isPublished?: boolean;
    startsAt?: string;
    endsAt?: string;
  };

  if (!title?.trim() || !content?.trim() || !type) {
    return NextResponse.json({ error: "title, content, type이 필요합니다." }, { status: 400 });
  }

  const notice = noticeStore.create({
    title: title.trim(),
    content: content.trim(),
    type,
    isPinned: isPinned ?? false,
    isPublished: isPublished ?? false,
    createdBy: email,
    startsAt: startsAt ?? null,
    endsAt: endsAt ?? null,
  });
  return NextResponse.json({ ok: true, notice });
}
