"use client";

import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// ─── Admin Auth Context ───
interface AdminAuthState {
  isAdmin: boolean;
  role: "superadmin" | "admin" | null;
  email: string | null;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthState>({
  isAdmin: false,
  role: null,
  email: null,
  loading: true,
});

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

// ─── Sidebar Nav Items ───
const navItems = [
  {
    label: "대시보드",
    href: "/admin",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: "문의 관리",
    href: "/admin/inquiries",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    label: "제휴 신청",
    href: "/admin/partnerships",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
  },
  {
    label: "팀 관리",
    href: "/admin/teams",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    label: "사용자 관리",
    href: "/admin/users",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    label: "경기 일정",
    href: "/admin/matches",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    label: "공지사항 관리",
    href: "/admin/notices",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
      </svg>
    ),
  },
  {
    label: "신고 관리",
    href: "/admin/reports",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l8.735 8.735m0 0a.374.374 0 11.53.53m-.53-.53l.53.53m0 0L21 21M14.652 9.348a3.75 3.75 0 010 5.304m2.121-7.425a6.75 6.75 0 010 9.546m2.121-11.667c3.808 3.807 3.808 9.98 0 13.788m-9.546-4.242a3.733 3.733 0 01-1.06-2.122m-1.061 4.243a6.75 6.75 0 01-1.974-4.243m-2.121 6.364a9.75 9.75 0 01-2.853-6.364m2.853 9.217a12.75 12.75 0 01-3.712-8.217" />
      </svg>
    ),
  },
  {
    label: "초대코드 조회",
    href: "/admin/invite-codes",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
  },
  {
    label: "서비스 통계",
    href: "/admin/stats",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [auth, setAuth] = useState<AdminAuthState>({
    isAdmin: false,
    role: null,
    email: null,
    loading: true,
  });

  useEffect(() => {
    // 쿠키에서 userId를 읽고 백엔드에서 이메일을 확인하는 대신,
    // localStorage에 저장된 사용자 정보를 활용
    async function checkAdmin() {
      try {
        // 쿠키에서 직접 이메일 가져오기는 어려우므로
        // /api/me 를 통해 현재 사용자 정보를 가져옴
        const meRes = await fetch("/api/me", { credentials: "include" });
        if (!meRes.ok) {
          setAuth({ isAdmin: false, role: null, email: null, loading: false });
          return;
        }
        const meData = await meRes.json();
        const userEmail = meData.user?.email || meData.email; // /api/me는 { user: { email } } 형태 또는 { email } 둘 다 대비

        if (!userEmail) {
          setAuth({ isAdmin: false, role: null, email: null, loading: false });
          return;
        }

        const res = await fetch("/api/admin/auth", {
          headers: { "x-user-email": userEmail },
        });
        const data = await res.json();

        setAuth({
          isAdmin: data.isAdmin ?? false,
          role: data.role ?? null,
          email: userEmail,
          loading: false,
        });
      } catch {
        setAuth({ isAdmin: false, role: null, email: null, loading: false });
      }
    }
    checkAdmin();
  }, []);

  // 로딩 중
  if (auth.loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gray-1300">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-green-600" />
          <p className="text-sm text-gray-500">권한을 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  // 비인가
  if (!auth.isAdmin) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gray-1300">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-900 bg-surface-secondary p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="mb-2 text-xl font-bold text-Label-Primary">
            접근 권한이 없습니다
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            어드민 페이지에 접근하려면 관리자 권한이 필요합니다.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-Label-Primary transition-colors hover:bg-gray-800"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={auth}>
      <div className="flex min-h-dvh bg-gray-1300">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-900 bg-surface-secondary transition-transform duration-300 lg:static lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 border-b border-gray-900 px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
              <span className="text-sm font-bold text-black">O</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-Label-Primary">OVR Admin</h1>
              <p className="text-[0.625rem] text-gray-600">관리자 콘솔</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-green-600/10 text-green-600"
                      : "text-gray-500 hover:bg-surface-elevated hover:text-Label-Primary",
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-gray-900 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600/20 text-xs font-bold text-green-600">
                {auth.role === "superadmin" ? "SA" : "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-Label-Primary">
                  {auth.email}
                </p>
                <p className="text-[0.625rem] text-gray-600">
                  {auth.role === "superadmin" ? "슈퍼어드민" : "어드민"}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex flex-1 flex-col">
          {/* Top bar */}
          <header className="flex h-16 items-center gap-4 border-b border-gray-900 bg-surface-secondary px-4 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-500 hover:bg-surface-elevated hover:text-Label-Primary lg:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div className="flex-1" />
            <Link
              href="/"
              className="text-xs text-gray-500 transition-colors hover:text-Label-Primary"
            >
              서비스로 돌아가기 →
            </Link>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthContext.Provider>
  );
}
