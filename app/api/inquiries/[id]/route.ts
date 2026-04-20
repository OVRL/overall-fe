import { NextRequest, NextResponse } from "next/server";
import { inquiryStore, type InquiryStatus } from "@/lib/inquiry-store";

/** GET /api/inquiries/[id] — 문의 상세 조회 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const inquiry = inquiryStore.findById(id);
  if (!inquiry) {
    return NextResponse.json(
      { error: "문의를 찾을 수 없습니다." },
      { status: 404 },
    );
  }
  return NextResponse.json(inquiry);
}

/** PATCH /api/inquiries/[id] — 문의 상태 변경 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { status } = body as { status: InquiryStatus };

  const inquiry = inquiryStore.updateStatus(id, status);
  if (!inquiry) {
    return NextResponse.json(
      { error: "문의를 찾을 수 없습니다." },
      { status: 404 },
    );
  }
  return NextResponse.json(inquiry);
}
