"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  STATUS_LABELS,
  CATEGORY_LABELS,
  type Inquiry,
  type InquiryStatus,
} from "@/lib/inquiry-store";
import { useAdminAuth } from "../../layout";
import { toast } from "sonner";

export default function AdminInquiryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { email } = useAdminAuth();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [replying, setReplying] = useState(false);

  async function loadInquiry() {
    try {
      const res = await fetch(`/api/inquiries/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setInquiry(data);
    } catch {
      setInquiry(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInquiry();
  }, [id]);

  async function handleReply(e: FormEvent) {
    e.preventDefault();
    if (!replyContent.trim() || replying) return;

    setReplying(true);
    try {
      const res = await fetch(`/api/inquiries/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent, author: email }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setInquiry(data);
      setReplyContent("");
      toast.success("답변이 등록되었습니다.");
    } catch {
      toast.error("답변 등록에 실패했습니다.");
    } finally {
      setReplying(false);
    }
  }

  async function handleStatusChange(status: InquiryStatus) {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setInquiry(data);
      toast.success(`상태가 "${STATUS_LABELS[status]}"(으)로 변경되었습니다.`);
    } catch {
      toast.error("상태 변경에 실패했습니다.");
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-900" />
        <div className="h-64 animate-pulse rounded-2xl bg-gray-900" />
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-sm text-gray-500">문의를 찾을 수 없습니다.</p>
        <Link
          href="/admin/inquiries"
          className="text-sm text-green-600 hover:text-green-500"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back button */}
      <Link
        href="/admin/inquiries"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-Label-Primary"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        목록으로
      </Link>

      {/* Inquiry Detail Card */}
      <div className="rounded-2xl border border-gray-900 bg-surface-secondary">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-900 px-6 py-4">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-2.5 py-1 text-[0.625rem] font-semibold ${
                inquiry.status === "pending"
                  ? "bg-red-400/10 text-red-400"
                  : inquiry.status === "answered"
                    ? "bg-green-600/10 text-green-600"
                    : "bg-gray-600/10 text-gray-600"
              }`}
            >
              {STATUS_LABELS[inquiry.status]}
            </span>
            <span className="text-xs text-gray-600">
              #{inquiry.id} · {CATEGORY_LABELS[inquiry.category]}
            </span>
          </div>
          <div className="flex gap-2">
            {inquiry.status !== "answered" && (
              <button
                type="button"
                onClick={() => handleStatusChange("answered")}
                className="rounded-lg bg-green-600/10 px-3 py-1.5 text-xs font-medium text-green-600 transition-colors hover:bg-green-600/20"
              >
                답변완료
              </button>
            )}
            {inquiry.status !== "closed" && (
              <button
                type="button"
                onClick={() => handleStatusChange("closed")}
                className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-800"
              >
                종료
              </button>
            )}
            {inquiry.status === "closed" && (
              <button
                type="button"
                onClick={() => handleStatusChange("pending")}
                className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-gray-800"
              >
                다시 열기
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 px-6 py-5">
          <h2 className="text-lg font-bold text-Label-Primary">
            {inquiry.title}
          </h2>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
            <span>
              <strong className="text-gray-400">이름:</strong> {inquiry.name}
            </span>
            <span>
              <strong className="text-gray-400">이메일:</strong> {inquiry.email}
            </span>
            {inquiry.phone && (
              <span>
                <strong className="text-gray-400">연락처:</strong>{" "}
                {inquiry.phone}
              </span>
            )}
            <span>
              <strong className="text-gray-400">작성일:</strong>{" "}
              {new Date(inquiry.createdAt).toLocaleString("ko-KR")}
            </span>
          </div>

          <div className="rounded-xl bg-gray-1300 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-Label-Secondary">
              {inquiry.content}
            </p>
          </div>
        </div>
      </div>

      {/* Replies */}
      {inquiry.replies.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-Label-Primary">
            답변 ({inquiry.replies.length})
          </h3>
          {inquiry.replies.map((reply) => (
            <div
              key={reply.id}
              className="rounded-2xl border border-green-600/20 bg-green-600/5 px-6 py-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-green-600">
                  {reply.author}
                </span>
                <span className="text-[0.625rem] text-gray-600">
                  {new Date(reply.createdAt).toLocaleString("ko-KR")}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-Label-Secondary">
                {reply.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Reply Form */}
      {inquiry.status !== "closed" && (
        <form
          onSubmit={handleReply}
          className="rounded-2xl border border-gray-900 bg-surface-secondary p-6"
        >
          <h3 className="mb-4 text-sm font-bold text-Label-Primary">
            답변 작성
          </h3>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답변 내용을 입력해주세요..."
            rows={5}
            className="w-full resize-none rounded-xl border border-gray-900 bg-gray-1300 px-4 py-3 text-sm text-Label-Primary placeholder:text-gray-700 transition-colors focus:border-green-600 focus:outline-none"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={!replyContent.trim() || replying}
              className="rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-Label-Fixed_black transition-all hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {replying ? "전송 중..." : "답변 전송"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
