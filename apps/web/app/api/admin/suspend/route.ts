import { NextRequest, NextResponse } from "next/server";
import { adminStore } from "@/lib/admin-store";
import { suspendStore } from "@/lib/suspend-store";

function getRequesterEmail(req: NextRequest): string | null {
  return req.headers.get("x-user-email");
}

// GET: 정지 목록 조회 or 특정 이메일 조회
export async function GET(req: NextRequest) {
  const requesterEmail = getRequesterEmail(req);
  if (!requesterEmail || !adminStore.isAdmin(requesterEmail)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const email = req.nextUrl.searchParams.get("email");
  if (email) {
    const suspension = suspendStore.get(email);
    return NextResponse.json({ suspension: suspension ?? null, isSuspended: suspendStore.isSuspended(email) });
  }

  return NextResponse.json({ suspensions: suspendStore.listAll() });
}

// POST: 이용정지
export async function POST(req: NextRequest) {
  const requesterEmail = getRequesterEmail(req);
  if (!requesterEmail || !adminStore.isAdmin(requesterEmail)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const body = await req.json();
  const { targetEmail, days, reason } = body as { targetEmail: string; days: number | "permanent"; reason?: string };

  if (!targetEmail || days === undefined) {
    return NextResponse.json({ error: "targetEmail과 days가 필요합니다." }, { status: 400 });
  }

  if (adminStore.isAdmin(targetEmail)) {
    return NextResponse.json({ error: "관리자 계정은 정지할 수 없습니다." }, { status: 400 });
  }

  const suspension = suspendStore.suspend(targetEmail, requesterEmail, days, reason);
  return NextResponse.json({ ok: true, suspension });
}

// DELETE: 정지 해제
export async function DELETE(req: NextRequest) {
  const requesterEmail = getRequesterEmail(req);
  if (!requesterEmail || !adminStore.isAdmin(requesterEmail)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "email이 필요합니다." }, { status: 400 });
  }

  const ok = suspendStore.unsuspend(email);
  return NextResponse.json({ ok });
}
