"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "../layout";
import { toast } from "sonner";

interface User {
  id: number;
  email: string;
  name: string | null;
  provider: string | null;
  phone: string | null;
  profileImage: string | null;
  mainPosition: string | null;
  gender: string | null;
}

interface AdminInfo {
  email: string;
  role: "superadmin" | "admin";
}

export default function AdminUsersPage() {
  const { email: currentEmail, role } = useAdminAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<AdminInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");

  async function loadData() {
    try {
      const [usersRes, adminsRes] = await Promise.all([
        fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            query: `query AdminUsers {
              findManyUser(limit: 200, offset: 0) {
                totalCount
                items {
                  id
                  email
                  name
                  provider
                  phone
                  profileImage
                  mainPosition
                  gender
                }
              }
            }`,
          }),
        }),
        fetch("/api/admin/admins", {
          headers: { "x-user-email": currentEmail ?? "" },
        }),
      ]);

      const usersData = await usersRes.json();
      const adminsData = await adminsRes.json();

      setUsers(usersData?.data?.findManyUser?.items ?? []);
      setTotalCount(usersData?.data?.findManyUser?.totalCount ?? 0);
      setAdmins(adminsData?.admins ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredUsers = search.trim()
    ? users.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      )
    : users;

  const adminEmails = new Set(admins.map((a) => a.email));

  function getProviderLabel(provider: string | null): string {
    if (!provider) return "-";
    switch (provider.toLowerCase()) {
      case "kakao":
        return "카카오";
      case "naver":
        return "네이버";
      case "google":
        return "구글";
      case "apple":
        return "애플";
      default:
        return provider;
    }
  }

  // 이미지 오류 처리: src를 null로 만들어 이니셜 아바타로 fallback
  function UserAvatar({ src, name, size = 8 }: { src: string | null; name: string | null; size?: number }) {
    const [imgError, setImgError] = useState(false);
    const cls = `h-${size} w-${size}`;
    if (src && !imgError) {
      return (
        <img
          src={src}
          alt=""
          className={`${cls} rounded-full object-cover`}
          onError={() => setImgError(true)}
        />
      );
    }
    return (
      <div className={`flex ${cls} items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-gray-500`}>
        {name?.[0]?.toUpperCase() ?? "?"}
      </div>
    );
  }

  function getProviderColor(provider: string | null): string {
    if (!provider) return "bg-gray-600/10 text-gray-500";
    switch (provider.toLowerCase()) {
      case "kakao":
        return "bg-yellow-500/10 text-yellow-500";
      case "naver":
        return "bg-green-600/10 text-green-600";
      case "google":
        return "bg-blue-400/10 text-blue-400";
      case "apple":
        return "bg-gray-400/10 text-gray-400";
      default:
        return "bg-gray-600/10 text-gray-500";
    }
  }

  async function handleToggleAdmin(userEmail: string) {
    const isCurrentlyAdmin = adminEmails.has(userEmail);

    try {
      if (isCurrentlyAdmin) {
        // 권한 회수
        const res = await fetch(
          `/api/admin/auth?email=${encodeURIComponent(userEmail)}`,
          {
            method: "DELETE",
            headers: { "x-user-email": currentEmail ?? "" },
          },
        );
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error);
        }
        toast.success(`${userEmail}의 어드민 권한이 회수되었습니다.`);
      } else {
        // 권한 부여
        const res = await fetch("/api/admin/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-email": currentEmail ?? "",
          },
          body: JSON.stringify({ targetEmail: userEmail }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error);
        }
        toast.success(`${userEmail}에게 어드민 권한이 부여되었습니다.`);
      }
      // 새로고침
      const adminsRes = await fetch("/api/admin/admins", {
        headers: { "x-user-email": currentEmail ?? "" },
      });
      const adminsData = await adminsRes.json();
      setAdmins(adminsData?.admins ?? []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "권한 변경에 실패했습니다.";
      toast.error(message);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-Label-Primary">사용자 관리</h1>
        <p className="mt-1 text-sm text-gray-500">
          전체 {totalCount}명의 사용자
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이름 또는 이메일로 검색..."
          className="w-full rounded-xl border border-gray-900 bg-surface-secondary py-3 pl-11 pr-4 text-sm text-Label-Primary placeholder:text-gray-700 transition-colors focus:border-green-600 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-900 bg-surface-secondary overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-900" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <svg className="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p className="text-sm text-gray-600">
              {search ? "검색 결과가 없습니다" : "등록된 사용자가 없습니다"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop header */}
            <div className="hidden border-b border-gray-900 px-6 py-3 md:grid md:grid-cols-12 md:gap-4">
              <span className="col-span-1 text-xs font-medium text-gray-600">ID</span>
              <span className="col-span-3 text-xs font-medium text-gray-600">이름</span>
              <span className="col-span-3 text-xs font-medium text-gray-600">이메일</span>
              <span className="col-span-1 text-xs font-medium text-gray-600">로그인</span>
              <span className="col-span-1 text-xs font-medium text-gray-600">포지션</span>
              <span className="col-span-1 text-xs font-medium text-gray-600">권한</span>
              <span className="col-span-2 text-xs font-medium text-gray-600">관리</span>
            </div>

            <div className="divide-y divide-gray-900">
              {filteredUsers.map((user) => {
                const isAdmin = adminEmails.has(user.email);
                const isSuperAdmin = admins.find(
                  (a) => a.email === user.email,
                )?.role === "superadmin";

                return (
                  <div
                    key={user.id}
                    className="px-6 py-4 md:grid md:grid-cols-12 md:items-center md:gap-4"
                  >
                    {/* Mobile */}
                    <div className="md:hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <UserAvatar src={user.profileImage} name={user.name} />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-Label-Primary">
                                {user.name ?? "이름 없음"}
                              </p>
                              {isAdmin && (
                                <span className="rounded px-1.5 py-0.5 text-[0.5625rem] font-semibold bg-green-600/10 text-green-600">
                                  {isSuperAdmin ? "SA" : "ADMIN"}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[0.625rem] font-semibold ${getProviderColor(user.provider)}`}
                        >
                          {getProviderLabel(user.provider)}
                        </span>
                      </div>
                      {role === "superadmin" && !isSuperAdmin && (
                        <div className="mt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleToggleAdmin(user.email)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                              isAdmin
                                ? "bg-red-400/10 text-red-400 hover:bg-red-400/20"
                                : "bg-green-600/10 text-green-600 hover:bg-green-600/20"
                            }`}
                          >
                            {isAdmin ? "권한 회수" : "어드민 부여"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Desktop */}
                    <span className="hidden text-xs text-gray-500 md:block col-span-1">
                      {user.id}
                    </span>
                    <div className="hidden md:flex md:items-center md:gap-3 col-span-3">
                      <UserAvatar src={user.profileImage} name={user.name} />
                      <span className="truncate text-sm font-medium text-Label-Primary">
                        {user.name ?? "이름 없음"}
                      </span>
                    </div>
                    <span className="hidden truncate text-xs text-gray-400 md:block col-span-3">
                      {user.email}
                    </span>
                    <span className="hidden md:block col-span-1">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[0.625rem] font-semibold ${getProviderColor(user.provider)}`}
                      >
                        {getProviderLabel(user.provider)}
                      </span>
                    </span>
                    <span className="hidden text-xs text-gray-400 md:block col-span-1">
                      {user.mainPosition ?? "-"}
                    </span>
                    <span className="hidden md:block col-span-1">
                      {isAdmin ? (
                        <span className="rounded px-1.5 py-0.5 text-[0.5625rem] font-semibold bg-green-600/10 text-green-600">
                          {isSuperAdmin ? "SA" : "ADMIN"}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600">-</span>
                      )}
                    </span>
                    <span className="hidden md:block col-span-2">
                      {role === "superadmin" && !isSuperAdmin ? (
                        <button
                          type="button"
                          onClick={() => handleToggleAdmin(user.email)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            isAdmin
                              ? "bg-red-400/10 text-red-400 hover:bg-red-400/20"
                              : "bg-green-600/10 text-green-600 hover:bg-green-600/20"
                          }`}
                        >
                          {isAdmin ? "권한 회수" : "어드민 부여"}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-600">-</span>
                      )}
                    </span>
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
