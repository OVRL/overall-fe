"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "../layout";

interface InviteCode {
  id: number;
  code: string;
  createdAt: string;
  expiredAt: string;
  teamId: number;
  team?: { id: number; name: string | null } | null;
}

export default function AdminInviteCodesPage() {
  const { email } = useAdminAuth();
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          query: `query AdminInviteCodes {
            findManyInviteCode(limit: 300, offset: 0) {
              totalCount
              items {
                id code createdAt expiredAt teamId
                team { id name }
              }
            }
          }`,
        }),
      });
      const data = await res.json();
      setCodes(data?.data?.findManyInviteCode?.items ?? []);
      setLoading(false);
    }
    load();
  }, [email]);

  const now = new Date();

  const filtered = codes.filter((c) => {
    const isExpired = new Date(c.expiredAt) < now;
    if (filter === "active" && isExpired) return false;
    if (filter === "expired" && !isExpired) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.code.toLowerCase().includes(q) ||
        c.team?.name?.toLowerCase().includes(q) ||
        String(c.teamId).includes(q)
      );
    }
    return true;
  });

  const activeCount = codes.filter((c) => new Date(c.expiredAt) >= now).length;
  const expiredCount = codes.filter((c) => new Date(c.expiredAt) < now).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-Label-Primary">초대코드 조회</h1>
        <p className="mt-1 text-sm text-gray-500">전체 {codes.length}개 · 유효 {activeCount}개 · 만료 {expiredCount}개</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "전체", value: codes.length, color: "text-Label-Primary" },
          { label: "유효", value: activeCount, color: "text-green-400" },
          { label: "만료", value: expiredCount, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-900 bg-surface-secondary p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex gap-2">
          {(["all", "active", "expired"] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-colors ${
                filter === f ? "bg-green-600/10 border-green-600/30 text-green-600" : "border-gray-900 text-gray-500 hover:text-Label-Primary"
              }`}>
              {f === "all" ? "전체" : f === "active" ? "유효" : "만료"}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="코드 또는 팀명으로 검색..."
            className="w-full rounded-xl border border-gray-900 bg-surface-secondary py-2 pl-9 pr-3 text-sm text-Label-Primary placeholder:text-gray-700 focus:border-green-600 focus:outline-none" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-900 bg-surface-secondary overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-900" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-600">결과가 없습니다</div>
        ) : (
          <>
            <div className="hidden md:grid md:grid-cols-12 border-b border-gray-900 px-5 py-3 gap-3">
              <span className="col-span-1 text-xs font-medium text-gray-600">ID</span>
              <span className="col-span-3 text-xs font-medium text-gray-600">코드</span>
              <span className="col-span-2 text-xs font-medium text-gray-600">팀</span>
              <span className="col-span-2 text-xs font-medium text-gray-600">생성일</span>
              <span className="col-span-2 text-xs font-medium text-gray-600">만료일</span>
              <span className="col-span-2 text-xs font-medium text-gray-600">상태</span>
            </div>
            <div className="divide-y divide-gray-900">
              {filtered.map((code) => {
                const isExpired = new Date(code.expiredAt) < now;
                return (
                  <div key={code.id} className="px-5 py-3 md:grid md:grid-cols-12 md:items-center md:gap-3">
                    <span className="hidden md:block text-xs text-gray-600 col-span-1">{code.id}</span>
                    <span className="hidden md:block font-mono text-xs text-green-400 col-span-3 truncate">{code.code}</span>
                    <span className="hidden md:block text-xs text-gray-400 col-span-2 truncate">{code.team?.name ?? `팀 #${code.teamId}`}</span>
                    <span className="hidden md:block text-xs text-gray-600 col-span-2">{new Date(code.createdAt).toLocaleDateString("ko-KR")}</span>
                    <span className="hidden md:block text-xs text-gray-600 col-span-2">{new Date(code.expiredAt).toLocaleDateString("ko-KR")}</span>
                    <span className="hidden md:block col-span-2">
                      <span className={`rounded-full px-2 py-0.5 text-[0.625rem] font-semibold ${isExpired ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
                        {isExpired ? "만료" : "유효"}
                      </span>
                    </span>
                    {/* Mobile */}
                    <div className="md:hidden flex items-center justify-between">
                      <div>
                        <p className="font-mono text-xs text-green-400">{code.code}</p>
                        <p className="text-xs text-gray-500">{code.team?.name ?? `팀 #${code.teamId}`} · 만료 {new Date(code.expiredAt).toLocaleDateString("ko-KR")}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[0.625rem] font-semibold ${isExpired ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"}`}>
                        {isExpired ? "만료" : "유효"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
