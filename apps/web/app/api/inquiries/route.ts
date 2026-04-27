import { NextRequest, NextResponse } from "next/server";
import {
  inquiryStore,
  type InquiryCategory,
  type InquiryStatus,
} from "@/lib/inquiry-store";

/** GET /api/inquiries — 문의 목록 조회 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status") as InquiryStatus | null;

  const items = inquiryStore.findAll(status ?? undefined);
  return NextResponse.json({
    items,
    totalCount: inquiryStore.totalCount,
    pendingCount: inquiryStore.pendingCount,
  });
}

/** POST /api/inquiries — 문의 생성 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, category, title, content } = body;

    // partnership 카테고리는 email 없이 phone만으로 가능
    const isPartnership = category === "partnership";
    if (!name || (!email && !isPartnership) || !title || !content) {
      return NextResponse.json(
        { error: "필수 항목을 입력해주세요." },
        { status: 400 },
      );
    }

    const inquiry = inquiryStore.create({
      name,
      phone: phone || "",
      email,
      category: (category as InquiryCategory) || "other",
      title,
      content,
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청입니다." },
      { status: 400 },
    );
  }
}
