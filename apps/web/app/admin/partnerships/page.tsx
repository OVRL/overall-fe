"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  STATUS_LABELS,
  type Inquiry,
} from "@/lib/inquiry-store";

const statusFilters: { value: string; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "pending", label: "대기중" },
  { value: "answered", label: "답변완료" },
  { value: "closed", label: "종료" },
];

function PhoneLink({ phone }: { phone: string }) {
  if (!phone) return <span className="text-gray-600 text-xs">-</span>;
  return (
    <a
      href={`tel:${phone.replace(/\D/g, "")}`}
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1.5 rounded-lg bg-green-600/10 px-2.5 py-1 text-xs font-semibold text-green-400 transition-colors hover:bg-green-600/20"
    >
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
      {phone}
    </a>
  );
}

export default function AdminPartnershipsPage() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        let url = "/api/inquiries?category=partnership";
        if (statusFilter !== "all") {
          url += `&status=${statusFilter}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setInquiries(data?.items ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-Label-Primary">제휴 관리</h1>
        <p className="mt-1 text-sm text-gray-500">
          제휴/협업 신청 내역을 확인하고 연락하세요
        </p>
      </div>

      <div className="flex gap-2">
        {statusFilters.map((f) => (
          <Link
            key={f.value}
            href={
              f.value === "all"
                ? "/admin/partnerships"
                : `/admin/partnerships?status=${f.value}`
            }
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              statusFilter === f.value
                ? "bg-green-600 text-Label-Fixed_black"
                : "bg-surface-secondary text-gray-500 hover:bg-surface-elevated hover:text-Label-Primary"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-900 bg-surface-secondary overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-900" />
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <svg className="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
            </svg>
            <p className="text-sm text-gray-600">제휴 신청 내역이 없습니다</p>
          </div>
        ) : (
          <>
            {/* Desktop header */}
            <div className="hidden border-b border-gray-900 px-6 py-3 md:grid md:grid-cols-12 md:gap-4">
              <span className="col-span-1 text-xs font-medium text-gray-600">#</span>
              <span className="col-span-3 text-xs font-medium text-gray-600">신청 내용</span>
              <span className="col-span-2 text-xs font-medium text-gray-600">신청자</span>
              <span className="col-span-3 text-xs font-medium text-gray-600">연락처</span>
              <span className="col-span-1 text-xs font-medium text-gray-600">상태</span>
              <span className="col-span-2 text-xs font-medium text-gray-600">신청일</span>
            </div>

            <div className="divide-y divide-gray-900">
              {inquiries.map((inq) => (
                <div key={inq.id} className="px-6 py-4 transition-colors hover:bg-surface-elevated md:grid md:grid-cols-12 md:items-center md:gap-4">
                  {/* Mobile layout */}
                  <div className="md:hidden space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-Label-Primary truncate">
                        {inq.title}
                      </span>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[0.625rem] font-semibold ${
                        inq.status === "pending" ? "bg-red-400/10 text-red-400"
                          : inq.status === "answered" ? "bg-green-600/10 text-green-600"
                          : "bg-gray-600/10 text-gray-600"
                      }`}>
                        {STATUS_LABELS[inq.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{inq.name}</span>
                      <PhoneLink phone={inq.phone} />
                    </div>
                    <p className="text-xs text-gray-600">
                      {new Date(inq.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>

                  {/* Desktop layout */}
                  <span className="hidden text-xs text-gray-500 md:block col-span-1">{inq.id}</span>
                  <Link href={`/admin/inquiries/${inq.id}`} className="hidden truncate text-sm font-medium text-Label-Primary md:block col-span-3 hover:text-green-400 transition-colors">
                    {inq.title}
                  </Link>
                  <span className="hidden text-xs text-gray-400 md:block col-span-2">{inq.name}</span>
                  <span className="hidden md:block col-span-3">
                    <PhoneLink phone={inq.phone} />
                  </span>
                  <span className="hidden md:block col-span-1">
                    <span className={`rounded-full px-2 py-0.5 text-[0.625rem] font-semibold ${
                      inq.status === "pending" ? "bg-red-400/10 text-red-400"
                        : inq.status === "answered" ? "bg-green-600/10 text-green-600"
                        : "bg-gray-600/10 text-gray-600"
                    }`}>
                      {STATUS_LABELS[inq.status]}
                    </span>
                  </span>
                  <span className="hidden text-xs text-gray-500 md:block col-span-2">
                    {new Date(inq.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
