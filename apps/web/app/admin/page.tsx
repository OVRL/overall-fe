"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "./layout";
import { STATUS_LABELS, CATEGORY_LABELS, type Inquiry } from "@/lib/inquiry-store";

interface DashboardStats {
  totalTeams: number;
  totalUsers: number;
  totalInquiries: number;
  pendingInquiries: number;
}

export default function AdminDashboardPage() {
  const { email } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalTeams: 0,
    totalUsers: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // 문의 데이터
        const inqRes = await fetch("/api/inquiries");
        const inqData = await inqRes.json();

        // 팀 & 사용자 데이터 (GraphQL)
        const gqlRes = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            query: `query AdminDashboard {
              findManyTeam(limit: 1, offset: 0) { totalCount }
              findManyUser(limit: 1, offset: 0) { totalCount }
            }`,
          }),
        });
        const gqlData = await gqlRes.json();

        setStats({
          totalTeams: gqlData?.data?.findManyTeam?.totalCount ?? 0,
          totalUsers: gqlData?.data?.findManyUser?.totalCount ?? 0,
          totalInquiries: inqData?.totalCount ?? 0,
          pendingInquiries: inqData?.pendingCount ?? 0,
        });
        setRecentInquiries((inqData?.items ?? []).slice(0, 5));
      } catch (err) {
        console.error("대시보드 데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const statCards = [
    { label: "전체 팀", value: stats.totalTeams, color: "text-blue-400", bg: "bg-blue-400/10", href: "/admin/teams" },
    { label: "전체 사용자", value: stats.totalUsers, color: "text-green-600", bg: "bg-green-600/10", href: "/admin/users" },
    { label: "전체 문의", value: stats.totalInquiries, color: "text-gray-400", bg: "bg-gray-400/10", href: "/admin/inquiries" },
    { label: "미답변 문의", value: stats.pendingInquiries, color: "text-red-400", bg: "bg-red-400/10", href: "/admin/inquiries?status=pending" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-Label-Primary">대시보드</h1>
        <p className="mt-1 text-sm text-gray-500">
          OVR 서비스 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-2xl border border-gray-900 bg-surface-secondary p-5 transition-all hover:border-gray-800 hover:bg-surface-elevated"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
              <span className={`text-lg font-bold ${card.color}`}>
                {loading ? "-" : card.value}
              </span>
            </div>
            <p className="text-xs font-medium text-gray-500 group-hover:text-gray-400">
              {card.label}
            </p>
            {!loading && (
              <p className={`mt-1 text-2xl font-bold ${card.color}`}>
                {card.value.toLocaleString()}
              </p>
            )}
            {loading && (
              <div className="mt-1 h-8 w-16 animate-pulse rounded bg-gray-900" />
            )}
          </Link>
        ))}
      </div>

      {/* Recent Inquiries */}
      <div className="rounded-2xl border border-gray-900 bg-surface-secondary">
        <div className="flex items-center justify-between border-b border-gray-900 px-6 py-4">
          <h2 className="text-base font-bold text-Label-Primary">최근 문의</h2>
          <Link
            href="/admin/inquiries"
            className="text-xs text-green-600 transition-colors hover:text-green-500"
          >
            전체 보기 →
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-900" />
            ))}
          </div>
        ) : recentInquiries.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12">
            <svg className="h-10 w-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
            </svg>
            <p className="text-sm text-gray-600">아직 문의가 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-900">
            {recentInquiries.map((inq) => (
              <Link
                key={inq.id}
                href={`/admin/inquiries/${inq.id}`}
                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-elevated"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-Label-Primary">
                    {inq.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-600">
                    {inq.name} · {CATEGORY_LABELS[inq.category]} · {new Date(inq.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[0.625rem] font-semibold ${
                    inq.status === "pending"
                      ? "bg-red-400/10 text-red-400"
                      : inq.status === "answered"
                        ? "bg-green-600/10 text-green-600"
                        : "bg-gray-600/10 text-gray-600"
                  }`}
                >
                  {STATUS_LABELS[inq.status]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
