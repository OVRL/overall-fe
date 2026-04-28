"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "../layout";
import { toast } from "sonner";

interface TeamMembership {
  team: { id: number; name: string | null } | null;
  role: string;
}

interface User {
  id: number;
  email: string;
  name: string | null;
  provider: string | null;
  phone: string | null;
  profileImage: string | null;
  mainPosition: string | null;
  gender: string | null;
  birthDate: string | null;
  teamMembers?: TeamMembership[] | null;
}

interface AdminInfo {
  email: string;
  role: "superadmin" | "admin";
}

interface Suspension {
  email: string;
  suspendedBy: string;
  suspendedAt: string;
  expiresAt: string | null;
  reason?: string;
}

const SUSPEND_OPTIONS: { label: string; value: number | "permanent" }[] = [
  { label: "1일", value: 1 },
  { label: "3일", value: 3 },
  { label: "7일", value: 7 },
  { label: "14일", value: 14 },
  { label: "30일", value: 30 },
  { label: "90일", value: 90 },
  { label: "180일", value: 180 },
  { label: "365일", value: 365 },
  { label: "영구정지", value: "permanent" },
];

function UserAvatar({ src, name, size = 8 }: { src: string | null; name: string | null; size?: number }) {
  const [imgError, setImgError] = useState(false);
  const cls = `h-${size} w-${size}`;
  if (src && !imgError) return <img src={src} alt="" className={`${cls} rounded-full object-cover`} onError={() => setImgError(true)} />;
  return <div className={`flex ${cls} items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-gray-500`}>{name?.[0]?.toUpperCase() ?? "?"}</div>;
}

function getProviderLabel(provider: string | null): string {
  switch (provider?.toLowerCase()) {
    case "kakao": return "카카오";
    case "naver": return "네이버";
    case "google": return "구글";
    case "apple": return "애플";
    default: return provider ?? "-";
  }
}

function getProviderColor(provider: string | null): string {
  switch (provider?.toLowerCase()) {
    case "kakao": return "bg-yellow-500/10 text-yellow-500";
    case "naver": return "bg-green-600/10 text-green-600";
    case "google": return "bg-blue-400/10 text-blue-400";
    case "apple": return "bg-gray-400/10 text-gray-400";
    default: return "bg-gray-600/10 text-gray-500";
  }
}

function formatBirthday(birthday: string | null): string {
  if (!birthday) return "-";
  try {
    const d = new Date(birthday);
    return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
  } catch {
    return birthday;
  }
}

export default function AdminUsersPage() {
  const { email: currentEmail, role } = useAdminAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<AdminInfo[]>([]);
  const [suspensions, setSuspensions] = useState<Map<string, Suspension>>(new Map());
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");

  // Suspend modal state
  const [suspendTarget, setSuspendTarget] = useState<User | null>(null);
  const [suspendDays, setSuspendDays] = useState<number | "permanent">(7);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendLoading, setSuspendLoading] = useState(false);

  async function loadData() {
    try {
      const [usersRes, adminsRes, suspendRes] = await Promise.all([
        fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            query: `query AdminUsers {
              findManyUser(limit: 200, offset: 0) {
                totalCount
                items {
                  id email name provider phone profileImage mainPosition gender birthDate
                }
              }
            }`,
          }),
        }),
        fetch("/api/admin/admins", { headers: { "x-user-email": currentEmail ?? "" } }),
        fetch("/api/admin/suspend", { headers: { "x-user-email": currentEmail ?? "" } }),
      ]);

      const usersData = await usersRes.json();
      const adminsData = await adminsRes.json();
      const suspendData = await suspendRes.json().catch(() => ({ suspensions: [] }));

      setUsers(usersData?.data?.findManyUser?.items ?? []);
      setTotalCount(usersData?.data?.findManyUser?.totalCount ?? 0);
      setAdmins(adminsData?.admins ?? []);

      const suspMap = new Map<string, Suspension>();
      for (const s of (suspendData?.suspensions ?? [])) {
        if (!s.expiresAt || new Date(s.expiresAt) > new Date()) {
          suspMap.set(s.email, s);
        }
      }
      setSuspensions(suspMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = search.trim()
    ? users.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      )
    : users;

  const adminEmails = new Set(admins.map((a) => a.email));

  async function handleToggleAdmin(userEmail: string) {
    const isCurrentlyAdmin = adminEmails.has(userEmail);
    try {
      if (isCurrentlyAdmin) {
        const res = await fetch(`/api/admin/auth?email=${encodeURIComponent(userEmail)}`, {
          method: "DELETE",
          headers: { "x-user-email": currentEmail ?? "" },
        });
        if (!res.ok) throw new Error((await res.json()).error);
        toast.success(`${userEmail}의 어드민 권한이 회수되었습니다.`);
      } else {
        const res = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-user-email": currentEmail ?? "" },
          body: JSON.stringify({ targetEmail: userEmail }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        toast.success(`${userEmail}에게 어드민 권한이 부여되었습니다.`);
      }
      const adminsRes = await fetch("/api/admin/admins", { headers: { "x-user-email": currentEmail ?? "" } });
      setAdmins((await adminsRes.json())?.admins ?? []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "권한 변경에 실패했습니다.");
    }
  }

  async function handleSuspend() {
    if (!suspendTarget) return;
    setSuspendLoading(true);
    try {
      const res = await fetch("/api/admin/suspend", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-email": currentEmail ?? "" },
        body: JSON.stringify({ targetEmail: suspendTarget.email, days: suspendDays, reason: suspendReason }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const data = await res.json();
      setSuspensions((prev) => new Map(prev).set(suspendTarget.email, data.suspension));
      const label = suspendDays === "permanent" ? "영구정지" : `${suspendDays}일 정지`;
      toast.success(`${suspendTarget.name ?? suspendTarget.email}님이 ${label} 처리되었습니다.`);
      setSuspendTarget(null);
      setSuspendReason("");
      setSuspendDays(7);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "정지 처리에 실패했습니다.");
    } finally {
      setSuspendLoading(false);
    }
  }

  async function handleUnsuspend(userEmail: string) {
    try {
      await fetch(`/api/admin/suspend?email=${encodeURIComponent(userEmail)}`, {
        method: "DELETE",
        headers: { "x-user-email": currentEmail ?? "" },
      });
      setSuspensions((prev) => { const m = new Map(prev); m.delete(userEmail); return m; });
      toast.success("정지가 해제되었습니다.");
    } catch {
      toast.error("정지 해제에 실패했습니다.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-Label-Primary">사용자 관리</h1>
        <p className="mt-1 text-sm text-gray-500">전체 {totalCount}명의 사용자</p>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이름 또는 이메일로 검색..."
          className="w-full rounded-xl border border-gray-900 bg-surface-secondary py-3 pl-11 pr-4 text-sm text-Label-Primary placeholder:text-gray-700 focus:border-green-600 focus:outline-none transition-colors"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-900 bg-surface-secondary overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-900" />)}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <p className="text-sm text-gray-600">{search ? "검색 결과가 없습니다" : "등록된 사용자가 없습니다"}</p>
          </div>
        ) : (
          <>
            {/* Desktop header */}
            <div className="hidden border-b border-gray-900 px-6 py-3 md:grid md:grid-cols-12 md:gap-3">
              <span className="col-span-1 text-xs font-medium text-gray-600">ID</span>
              <span className="col-span-2 text-xs font-medium text-gray-600">이름</span>
              <span className="col-span-2 text-xs font-medium text-gray-600">이메일</span>
              <span className="col-span-1 text-xs font-medium text-gray-600">생년월일</span>
              <span className="col-span-1 text-xs font-medium text-gray-600">로그인</span>
              <span className="col-span-2 text-xs font-medium text-gray-600">소속 팀</span>
              <span className="col-span-1 text-xs font-medium text-gray-600">권한</span>
              <span className="col-span-2 text-xs font-medium text-gray-600">관리</span>
            </div>

            <div className="divide-y divide-gray-900">
              {filteredUsers.map((user) => {
                const isAdmin = adminEmails.has(user.email);
                const isSuperAdmin = admins.find((a) => a.email === user.email)?.role === "superadmin";
                const suspension = suspensions.get(user.email);
                const isSuspended = !!suspension;
                const teamNames = user.teamMembers?.map((m) => m.team?.name).filter(Boolean) ?? [];

                return (
                  <div key={user.id} className={`px-6 py-4 md:grid md:grid-cols-12 md:items-center md:gap-3 ${isSuspended ? "bg-red-500/3" : ""}`}>
                    {/* Mobile */}
                    <div className="md:hidden space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <UserAvatar src={user.profileImage} name={user.name} />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium text-Label-Primary">{user.name ?? "이름 없음"}</p>
                              {isAdmin && <span className="rounded px-1.5 py-0.5 text-[0.5625rem] font-semibold bg-green-600/10 text-green-600">{isSuperAdmin ? "SA" : "ADMIN"}</span>}
                              {isSuspended && <span className="rounded px-1.5 py-0.5 text-[0.5625rem] font-semibold bg-red-500/10 text-red-400">정지</span>}
                            </div>
                            <p className="text-xs text-gray-600">{user.email}</p>
                            {user.birthDate && <p className="text-xs text-gray-600">{formatBirthday(user.birthDate)}</p>}
                            {teamNames.length > 0 && <p className="text-xs text-gray-500">{teamNames.join(", ")}</p>}
                          </div>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[0.625rem] font-semibold ${getProviderColor(user.provider)}`}>
                          {getProviderLabel(user.provider)}
                        </span>
                      </div>
                      <div className="flex justify-end gap-2">
                        {role === "superadmin" && !isSuperAdmin && (
                          <button type="button" onClick={() => handleToggleAdmin(user.email)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${isAdmin ? "bg-red-400/10 text-red-400 hover:bg-red-400/20" : "bg-green-600/10 text-green-600 hover:bg-green-600/20"}`}>
                            {isAdmin ? "권한 회수" : "어드민 부여"}
                          </button>
                        )}
                        {!isAdmin && (
                          isSuspended ? (
                            <button type="button" onClick={() => handleUnsuspend(user.email)}
                              className="rounded-lg px-3 py-1.5 text-xs font-medium bg-gray-600/10 text-gray-400 hover:bg-gray-600/20 transition-colors">
                              정지 해제
                            </button>
                          ) : (
                            <button type="button" onClick={() => setSuspendTarget(user)}
                              className="rounded-lg px-3 py-1.5 text-xs font-medium bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors">
                              이용정지
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Desktop */}
                    <span className="hidden text-xs text-gray-500 md:block col-span-1">{user.id}</span>
                    <div className="hidden md:flex md:items-center md:gap-2 col-span-2 min-w-0">
                      <UserAvatar src={user.profileImage} name={user.name} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-Label-Primary">{user.name ?? "이름 없음"}</p>
                        {isSuspended && <span className="text-[9px] font-bold text-red-400">⚠ 정지됨</span>}
                      </div>
                    </div>
                    <span className="hidden truncate text-xs text-gray-400 md:block col-span-2">{user.email}</span>
                    <span className="hidden text-xs text-gray-400 md:block col-span-1">{formatBirthday(user.birthDate)}</span>
                    <span className="hidden md:block col-span-1">
                      <span className={`rounded-full px-2 py-0.5 text-[0.625rem] font-semibold ${getProviderColor(user.provider)}`}>
                        {getProviderLabel(user.provider)}
                      </span>
                    </span>
                    <div className="hidden md:block col-span-2 min-w-0">
                      {teamNames.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {teamNames.slice(0, 2).map((name) => (
                            <span key={name} className="rounded px-1.5 py-0.5 text-[0.5625rem] bg-gray-900 text-gray-400 truncate max-w-[80px]">{name}</span>
                          ))}
                          {teamNames.length > 2 && <span className="text-[0.5625rem] text-gray-600">+{teamNames.length - 2}</span>}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-600">-</span>
                      )}
                    </div>
                    <span className="hidden md:block col-span-1">
                      {isAdmin ? (
                        <span className="rounded px-1.5 py-0.5 text-[0.5625rem] font-semibold bg-green-600/10 text-green-600">{isSuperAdmin ? "SA" : "ADMIN"}</span>
                      ) : (
                        <span className="text-xs text-gray-600">-</span>
                      )}
                    </span>
                    <div className="hidden md:flex md:items-center md:gap-2 col-span-2 flex-wrap">
                      {role === "superadmin" && !isSuperAdmin && (
                        <button type="button" onClick={() => handleToggleAdmin(user.email)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${isAdmin ? "bg-red-400/10 text-red-400 hover:bg-red-400/20" : "bg-green-600/10 text-green-600 hover:bg-green-600/20"}`}>
                          {isAdmin ? "권한 회수" : "어드민 부여"}
                        </button>
                      )}
                      {!isAdmin && (
                        isSuspended ? (
                          <button type="button" onClick={() => handleUnsuspend(user.email)}
                            className="rounded-lg px-2.5 py-1 text-xs font-medium bg-gray-600/10 text-gray-400 hover:bg-gray-600/20 transition-colors">
                            정지 해제
                          </button>
                        ) : (
                          <button type="button" onClick={() => setSuspendTarget(user)}
                            className="rounded-lg px-2.5 py-1 text-xs font-medium bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors">
                            이용정지
                          </button>
                        )
                      )}
                      {!role && !isAdmin && <span className="text-xs text-gray-600">-</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Suspend Modal */}
      {suspendTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSuspendTarget(null)} />
          <div className="relative w-full max-w-sm bg-surface-secondary border border-gray-900 rounded-2xl shadow-2xl p-6 space-y-5">
            <div>
              <h3 className="text-lg font-bold text-Label-Primary">이용정지</h3>
              <p className="text-sm text-gray-500 mt-1">
                <span className="text-white font-medium">{suspendTarget.name ?? suspendTarget.email}</span>님을 정지합니다
              </p>
            </div>

            {/* Duration picker */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">정지 기간</label>
              <div className="grid grid-cols-3 gap-2">
                {SUSPEND_OPTIONS.map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setSuspendDays(opt.value)}
                    className={`rounded-xl py-2 text-xs font-semibold transition-colors border ${
                      suspendDays === opt.value
                        ? opt.value === "permanent"
                          ? "bg-red-500/20 border-red-500/40 text-red-400"
                          : "bg-orange-500/15 border-orange-500/30 text-orange-400"
                        : "bg-gray-900/50 border-gray-900 text-gray-500 hover:text-Label-Primary hover:border-gray-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">사유 (선택)</label>
              <input
                type="text"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="정지 사유를 입력하세요"
                className="w-full rounded-xl border border-gray-900 bg-gray-1300 py-2.5 px-3 text-sm text-Label-Primary placeholder:text-gray-700 focus:border-orange-500/50 focus:outline-none"
              />
            </div>

            {/* Duration preview */}
            <p className="text-xs text-gray-500 bg-gray-1300 rounded-xl px-3 py-2 border border-gray-900">
              {suspendDays === "permanent"
                ? "⚠ 영구정지 — 해제 전까지 서비스 이용 불가"
                : `${suspendDays}일 후 자동 해제됩니다 (${new Date(Date.now() + (suspendDays as number) * 86400000).toLocaleDateString("ko-KR")} 까지)`}
            </p>

            <div className="flex gap-3">
              <button type="button" onClick={() => setSuspendTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-gray-900 text-gray-400 text-sm font-semibold hover:bg-gray-800 transition-colors">
                취소
              </button>
              <button type="button" onClick={handleSuspend} disabled={suspendLoading}
                className="flex-1 py-2.5 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-semibold hover:bg-orange-500/30 transition-colors disabled:opacity-50">
                {suspendLoading ? "처리 중..." : "정지하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
