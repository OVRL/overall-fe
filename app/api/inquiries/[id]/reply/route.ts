import { NextRequest, NextResponse } from "next/server";
import { inquiryStore } from "@/lib/inquiry-store";
import { sendReplyEmail } from "@/lib/email";

/** POST /api/inquiries/[id]/reply — 답변 작성 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { content, author } = body;

  if (!content) {
    return NextResponse.json(
      { error: "답변 내용을 입력해주세요." },
      { status: 400 },
    );
  }

  const inquiry = inquiryStore.addReply(id, content, author || "관리자");
  if (!inquiry) {
    return NextResponse.json(
      { error: "문의를 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  // --- 추가된 부분: 실제 이메일 전송 시도 ---
  try {
    if (inquiry.email) {
      await sendReplyEmail({
        to: inquiry.email,
        title: inquiry.title,
        replyContent: content,
        author: author || "관리자",
      });
    }
  } catch (error) {
    console.error("이메일 전송 실패, 하지만 답변은 저장됨", error);
  }

  return NextResponse.json(inquiry);
}
