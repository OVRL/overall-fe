"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "../layout";
import { toast } from "sonner";
import {
  NOTICE_TYPE_LABELS,
  NOTICE_TYPE_COLORS,
  type Notice,
  type NoticeType,
} from "@/lib/notice-store";

const TYPE_OPTIONS: { label: string; value: NoticeType }[] = [
  { label: "공지", value: "info" },
  { label: "경고", value: "warning" },
  { label: "점검", value: "maintenance" },
  { label: "업데이트", value: "update" },
];

const EMPTY_FORM = {
  title: "",
  content: "",
  type: "info" as NoticeType,
  isPinned: false,
  isPublished: false,
  startsAt: "",
  endsAt: "",
};

export default function AdminNoticesPage() {
  const { email } = useAdminAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Notice | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/notices", { headers: { "x-user-email": email ?? "" } });
    const data = await res.json();
    setNotices(data.notices ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM });
    setShowForm(true);
  }

  function openEdit(notice: Notice) {
    setEditTarget(notice);
    setForm({
      title: notice.title,
      content: notice.content,
      type: notice.type,
      isPinned: notice.isPinned,
      isPublished: notice.isPublished,
      startsAt: notice.startsAt ?? "",
      endsAt: notice.endsAt ?? "",
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("제목과 내용을 입력하세요.");
      return;
    }
    setSaving(true);
    try {
      const body = { ...form, startsAt: form.startsAt || null, endsAt: form.endsAt || null };
      let res: Response;
      if (editTarget) {
        res = await fetch(`/api/admin/notices/${editTarget.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-user-email": email ?? "" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/admin/notices", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-user-email": email ?? "" },
          body: JSON.stringify(body),
        });
      }
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(editTarget ? "공지가 수정되었습니다." : "공지가 등록되었습니다.");
      setShowForm(false);
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(notice: Notice) {
    const res = await fetch(`/api/admin/notices/${notice.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-user-email": email ?? "" },
      body: JSON.stringify({ isPublished: !notice.isPublished }),
    });
    if (res.ok) {
      toast.success(notice.isPublished ? "공지를 비공개로 전환했습니다." : "공지를 게시했습니다.");
      await load();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("공지를 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/admin/notices/${id}`, {
      method: "DELETE",
      headers: { "x-user-email": email ?? "" },
    });
    if (res.ok) { toast.success("삭제되었습니다."); await load(); }
  }

  const published = notices.filter((n) => n.isPublished).length;
  const pinned = notices.filter((n) => n.isPinned).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-Label-Primary">공지사항 관리</h1>
          <p className="mt-1 text-sm text-gray-500">전체 {notices.length}개 · 게시 중 {published}개 · 고정 {pinned}개</p>
        </div>
        <button type="button" onClick={openCreate}
          className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-black hover:bg-green-500 transition-colors">
          + 공지 작성
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-900" />)}</div>
      ) : notices.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-900 bg-surface-secondary py-20">
          <p className="text-sm text-gray-600">등록된 공지가 없습니다</p>
          <button type="button" onClick={openCreate} className="text-sm text-green-600 hover:underline">첫 공지 작성하기</button>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div key={notice.id} className="rounded-2xl border border-gray-900 bg-surface-secondary p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`rounded-full px-2 py-0.5 text-[0.625rem] font-semibold ${NOTICE_TYPE_COLORS[notice.type]}`}>
                      {NOTICE_TYPE_LABELS[notice.type]}
                    </span>
                    {notice.isPinned && <span className="rounded-full px-2 py-0.5 text-[0.625rem] font-semibold bg-yellow-500/10 text-yellow-400">📌 고정</span>}
                    {notice.isPublished ? (
                      <span className="rounded-full px-2 py-0.5 text-[0.625rem] font-semibold bg-green-500/10 text-green-400">게시중</span>
                    ) : (
                      <span className="rounded-full px-2 py-0.5 text-[0.625rem] font-semibold bg-gray-500/10 text-gray-500">비공개</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-Label-Primary">{notice.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{notice.content}</p>
                  <p className="mt-2 text-xs text-gray-600">
                    {new Date(notice.createdAt).toLocaleDateString("ko-KR")} · {notice.createdBy}
                    {notice.endsAt && ` · ~${new Date(notice.endsAt).toLocaleDateString("ko-KR")}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button type="button" onClick={() => handleTogglePublish(notice)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${notice.isPublished ? "bg-gray-700/40 text-gray-400 hover:bg-gray-700" : "bg-green-600/10 text-green-600 hover:bg-green-600/20"}`}>
                    {notice.isPublished ? "비공개" : "게시"}
                  </button>
                  <button type="button" onClick={() => openEdit(notice)}
                    className="rounded-lg px-2.5 py-1 text-xs font-medium bg-gray-900 text-gray-400 hover:bg-gray-800 transition-colors">
                    수정
                  </button>
                  <button type="button" onClick={() => handleDelete(notice.id)}
                    className="rounded-lg px-2.5 py-1 text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-lg bg-surface-secondary border border-gray-900 rounded-2xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-Label-Primary">{editTarget ? "공지 수정" : "공지 작성"}</h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400">유형</label>
              <div className="flex gap-2 flex-wrap">
                {TYPE_OPTIONS.map((opt) => (
                  <button key={opt.value} type="button" onClick={() => setForm((f) => ({ ...f, type: opt.value }))}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${form.type === opt.value ? NOTICE_TYPE_COLORS[opt.value] + " border-current" : "border-gray-900 text-gray-500 hover:text-Label-Primary"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400">제목</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="공지 제목" className="w-full rounded-xl border border-gray-900 bg-gray-1300 px-3 py-2.5 text-sm text-Label-Primary placeholder:text-gray-700 focus:border-green-600 focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400">내용</label>
              <textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={5} placeholder="공지 내용을 입력하세요"
                className="w-full rounded-xl border border-gray-900 bg-gray-1300 px-3 py-2.5 text-sm text-Label-Primary placeholder:text-gray-700 focus:border-green-600 focus:outline-none resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">게시 시작 (선택)</label>
                <input type="datetime-local" value={form.startsAt} onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
                  className="w-full rounded-xl border border-gray-900 bg-gray-1300 px-3 py-2 text-sm text-Label-Primary focus:border-green-600 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">게시 종료 (선택)</label>
                <input type="datetime-local" value={form.endsAt} onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
                  className="w-full rounded-xl border border-gray-900 bg-gray-1300 px-3 py-2 text-sm text-Label-Primary focus:border-green-600 focus:outline-none" />
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPinned} onChange={(e) => setForm((f) => ({ ...f, isPinned: e.target.checked }))}
                  className="rounded" />
                <span className="text-sm text-gray-400">상단 고정</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                  className="rounded" />
                <span className="text-sm text-gray-400">즉시 게시</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-900 text-gray-400 text-sm font-semibold hover:bg-gray-800 transition-colors">
                취소
              </button>
              <button type="button" onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-green-600 text-black text-sm font-semibold hover:bg-green-500 transition-colors disabled:opacity-50">
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
