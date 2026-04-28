"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "../layout";

interface StatsData {
  totalUsers: number;
  totalTeams: number;
  totalMatches: number;
  totalInquiries: number;
  pendingInquiries: number;
  recentUsers: { id: number; name: string | null; email: string; createdAt?: string }[];
  recentTeams: { id: number; name: string | null; createdAt?: string }[];
}

interface ProviderCount {
  provider: string;
  count: number;
}

function StatCard({ label, value, sub, color = "text-Label-Primary" }: { label: string; value: number | string; sub?: string; color?: string }) {
  return (
    <div className="rounded-2xl border border-gray-900 bg-surface-secondary p-5">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-600">{sub}</p>}
    </div>
  );
}

export default function AdminStatsPage() {
  const { email } = useAdminAuth();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [providerCounts, setProviderCounts] = useState<ProviderCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [usersRes, teamsRes, matchesRes, inqRes] = await Promise.all([
        fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            query: `query StatsUsers {
              findManyUser(limit: 300, offset: 0) {
                totalCount
                items { id name email provider }
              }
            }`,
          }),
        }),
        fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            query: `query StatsTeams {
              findManyTeam(limit: 300, offset: 0) {
                totalCount
                items { id name }
              }
            }`,
          }),
        }),
        fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            query: `query StatsMatches {
              findMatch(limit: 300, offset: 0) {
                totalCount
              }
            }`,
          }),
        }),
        fetch("/api/inquiries"),
      ]);

      const usersData = await usersRes.json();
      const teamsData = await teamsRes.json();
      const matchesData = await matchesRes.json();
      const inqData = await inqRes.json().catch(() => ({ inquiries: [] }));

      const users = usersData?.data?.findManyUser?.items ?? [];
      const teams = teamsData?.data?.findManyTeam?.items ?? [];
      const inquiries = inqData?.inquiries ?? [];

      // Provider distribution
      const pmap: Record<string, number> = {};
      for (const u of users) {
        const p = u.provider ?? "unknown";
        pmap[p] = (pmap[p] ?? 0) + 1;
      }
      setProviderCounts(
        Object.entries(pmap)
          .map(([provider, count]) => ({ provider, count }))
          .sort((a, b) => b.count - a.count)
      );

      setStats({
        totalUsers: usersData?.data?.findManyUser?.totalCount ?? users.length,
        totalTeams: teamsData?.data?.findManyTeam?.totalCount ?? teams.length,
        totalMatches: matchesData?.data?.findMatch?.totalCount ?? 0,
        totalInquiries: inquiries.length,
        pendingInquiries: inquiries.filter((i: { status: string }) => i.status === "pending").length,
        recentUsers: users.slice(0, 5),
        recentTeams: teams.slice(0, 5),
      });
      setLoading(false);
    }
    load();
  }, [email]);

  function providerLabel(p: string) {
    const m: Record<string, string> = { kakao: "카카오", naver: "네이버", google: "구글", apple: "애플", unknown: "미상" };
    return m[p.toLowerCase()] ?? p;
  }

  function providerColor(p: string) {
    const m: Record<string, string> = {
      kakao: "bg-yellow-500",
      naver: "bg-green-600",
      google: "bg-blue-500",
      apple: "bg-gray-400",
    };
    return m[p.toLowerCase()] ?? "bg-gray-700";
  }

  const total = providerCounts.reduce((s, c) => s + c.count, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-Label-Primary">서비스 통계</h1>
        <p className="mt-1 text-sm text-gray-500">현재 서비스 현황 요약</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-900" />)}
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard label="전체 사용자" value={stats.totalUsers} color="text-green-400" />
            <StatCard label="전체 팀" value={stats.totalTeams} color="text-blue-400" />
            <StatCard label="전체 경기" value={stats.totalMatches} color="text-purple-400" />
            <StatCard label="문의" value={stats.totalInquiries} sub={`미처리 ${stats.pendingInquiries}건`} color="text-yellow-400" />
          </div>

          {/* Provider distribution */}
          {providerCounts.length > 0 && (
            <div className="rounded-2xl border border-gray-900 bg-surface-secondary p-6 space-y-4">
              <h2 className="text-sm font-bold text-Label-Primary">로그인 방식 분포</h2>
              <div className="space-y-3">
                {providerCounts.map((pc) => {
                  const pct = total > 0 ? Math.round((pc.count / total) * 100) : 0;
                  return (
                    <div key={pc.provider} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{providerLabel(pc.provider)}</span>
                        <span className="text-gray-500">{pc.count}명 ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-900 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${providerColor(pc.provider)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent users */}
            <div className="rounded-2xl border border-gray-900 bg-surface-secondary p-5 space-y-4">
              <h2 className="text-sm font-bold text-Label-Primary">최근 등록 사용자</h2>
              {stats.recentUsers.length === 0 ? (
                <p className="text-xs text-gray-600">없음</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-Label-Primary">{u.name ?? "이름 없음"}</p>
                        <p className="text-xs text-gray-600">{u.email}</p>
                      </div>
                      <span className="text-xs text-gray-600">#{u.id}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent teams */}
            <div className="rounded-2xl border border-gray-900 bg-surface-secondary p-5 space-y-4">
              <h2 className="text-sm font-bold text-Label-Primary">최근 등록 팀</h2>
              {stats.recentTeams.length === 0 ? (
                <p className="text-xs text-gray-600">없음</p>
              ) : (
                <div className="space-y-3">
                  {stats.recentTeams.map((t) => (
                    <div key={t.id} className="flex items-center justify-between">
                      <p className="text-sm font-medium text-Label-Primary">{t.name ?? "이름 없음"}</p>
                      <span className="text-xs text-gray-600">#{t.id}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
