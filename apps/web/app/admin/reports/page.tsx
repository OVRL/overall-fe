"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "../layout";
import { toast } from "sonner";
import {
  REPORT_TYPE_LABELS,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_COLORS,
  type Report,
  type ReportStatus,
} from "@/lib/report-store";

const STATUS_FLOW: ReportStatus[] = ["pending", "reviewing", "resolved", "dismissed"];

export default function AdminReportsPage() {
  const { email } = useAdminAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<ReportStatus | "all">("all");
  const [detailReport, setDetailReport] = useState<Report | null>(null);
  const [note, setNote] = useState("");

  async function load() {
    const res = await fetch("/api/admin/reports", { headers: { "x-user-email": email ?? "" } });
    const data = await res.json();
    setReports(data.reports ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: ReportStatus) {
    const res = await fetch("/api/admin/reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-user-email": email ?? "" },
      body: JSON.stringify({ id, status, note }),
    });
    if (res.ok) {
      toast.success("상태가 변경되었습니다.");
      setDetailReport(null);
      setNote("");
      await load();
    } else {
      toast.error("변경에 실패했습니다.");
    }
  }

  const filtered = filterStatus === "all" ? reports : reports.filter((r) => r.status === filterStatus);
  const pending = reports.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-Label-Primary">신고 관리</h1>
        <p className="mt-1 text-sm text-gray-500">전체 {reports.length}건 · 미처리 {pending}건</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(["all", ...STATUS_FLOW] as const).map((s) => (
          <button key={s} type="button" onClick={() => setFilterStatus(s)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-colors ${
              filterStatus === s ? "bg-green-600/10 border-green-600/30 text-green-600" : "border-gray-900 text-gray-500 hover:text-Label-Primary"
            }`}>
            {s === "all" ? "전체" : REPORT_STATUS_LABELS[s]}
            {s === "pending" && pending > 0 && <span className="ml-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] text-white">{pending}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-900" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center rounded-2xl border border-gray-900 bg-surface-secondary py-20">
          <p className="text-sm text-gray-600">신고 내역이 없습니다</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-900 bg-surface-secondary overflow-hidden">
          <div className="divide-y divide-gray-900">
            {filtered.map((report) => (
              <div key={report.id} className="px-5 py-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-surface-elevated transition-colors"
                onClick={() => { setDetailReport(report); setNote(report.note ?? ""); }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="rounded px-1.5 py-0.5 text-[0.5625rem] font-semibold bg-gray-900 text-gray-400">
                      {REPORT_TYPE_LABELS[report.type]}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[0.625rem] font-semibold ${REPORT_STATUS_COLORS[report.status]}`}>
                      {REPORT_STATUS_LABELS[report.status]}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-Label-Primary truncate">
                    <span className="text-gray-500">{report.reporterEmail}</span>
                    <span className="text-gray-700 mx-1">→</span>
                    <span className="text-red-400">{report.targetName ?? report.targetEmail}</span>
                  </p>
                  <p className="mt-1 text-xs text-gray-600 line-clamp-1">{report.description}</p>
                </div>
                <p className="text-xs text-gray-600 shrink-0">{new Date(report.createdAt).toLocaleDateString("ko-KR")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail modal */}
      {detailReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDetailReport(null)} />
          <div className="relative w-full max-w-md bg-surface-secondary border border-gray-900 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold text-Label-Primary">신고 상세</h3>
              <span className={`rounded-full px-2 py-1 text-[0.625rem] font-semibold ${REPORT_STATUS_COLORS[detailReport.status]}`}>
                {REPORT_STATUS_LABELS[detailReport.status]}
              </span>
            </div>

            <div className="space-y-3 rounded-xl bg-gray-1300 border border-gray-900 p-4 text-sm">
              <div className="flex gap-2"><span className="text-gray-600 w-16 shrink-0">신고자</span><span className="text-gray-400">{detailReport.reporterEmail}</span></div>
              <div className="flex gap-2"><span className="text-gray-600 w-16 shrink-0">대상</span><span className="text-red-400">{detailReport.targetName ?? detailReport.targetEmail}</span></div>
              <div className="flex gap-2"><span className="text-gray-600 w-16 shrink-0">유형</span><span className="text-Label-Primary">{REPORT_TYPE_LABELS[detailReport.type]}</span></div>
              <div className="flex gap-2"><span className="text-gray-600 w-16 shrink-0">내용</span><span className="text-Label-Primary">{detailReport.description}</span></div>
              <div className="flex gap-2"><span className="text-gray-600 w-16 shrink-0">접수일</span><span className="text-gray-500">{new Date(detailReport.createdAt).toLocaleString("ko-KR")}</span></div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400">처리 메모 (선택)</label>
              <input value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="처리 내용을 간단히 기록하세요"
                className="w-full rounded-xl border border-gray-900 bg-gray-1300 px-3 py-2.5 text-sm text-Label-Primary placeholder:text-gray-700 focus:border-green-600 focus:outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {STATUS_FLOW.filter((s) => s !== detailReport.status).map((s) => (
                <button key={s} type="button" onClick={() => updateStatus(detailReport.id, s)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${REPORT_STATUS_COLORS[s]} border-current/30 hover:opacity-80`}>
                  {REPORT_STATUS_LABELS[s]}으로 변경
                </button>
              ))}
            </div>

            <button type="button" onClick={() => setDetailReport(null)}
              className="w-full py-2.5 rounded-xl bg-gray-900 text-gray-400 text-sm font-semibold hover:bg-gray-800 transition-colors">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
