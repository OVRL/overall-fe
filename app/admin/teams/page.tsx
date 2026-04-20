"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "../layout";

interface Team {
  id: number;
  name: string | null;
  activityArea: string | null;
  description: string | null;
  emblem: string | null;
  members: { id: number }[] | null;
}

export default function AdminTeamsPage() {
  const { email } = useAdminAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            query: `query AdminTeams {
              findManyTeam(limit: 200, offset: 0) {
                totalCount
                items {
                  id
                  name
                  activityArea
                  description
                  emblem
                  members { id }
                }
              }
            }`,
          }),
        });
        const data = await res.json();
        setTeams(data?.data?.findManyTeam?.items ?? []);
        setTotalCount(data?.data?.findManyTeam?.totalCount ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredTeams = search.trim()
    ? teams.filter(
        (t) =>
          t.name?.toLowerCase().includes(search.toLowerCase()) ||
          t.activityArea?.toLowerCase().includes(search.toLowerCase()),
      )
    : teams;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-Label-Primary">팀 관리</h1>
        <p className="mt-1 text-sm text-gray-500">
          전체 {totalCount}개 팀
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
          placeholder="팀 이름 또는 활동 지역 검색..."
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
        ) : filteredTeams.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <svg className="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <p className="text-sm text-gray-600">
              {search ? "검색 결과가 없습니다" : "등록된 팀이 없습니다"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop header */}
            <div className="hidden border-b border-gray-900 px-6 py-3 md:grid md:grid-cols-12 md:gap-4">
              <span className="col-span-1 text-xs font-medium text-gray-600">ID</span>
              <span className="col-span-4 text-xs font-medium text-gray-600">팀 이름</span>
              <span className="col-span-3 text-xs font-medium text-gray-600">활동 지역</span>
              <span className="col-span-2 text-xs font-medium text-gray-600">멤버 수</span>
              <span className="col-span-2 text-xs font-medium text-gray-600">설명</span>
            </div>

            <div className="divide-y divide-gray-900">
              {filteredTeams.map((team) => (
                <div
                  key={team.id}
                  className="px-6 py-4 md:grid md:grid-cols-12 md:items-center md:gap-4"
                >
                  {/* Mobile */}
                  <div className="md:hidden">
                    <div className="flex items-center gap-3">
                      {team.emblem ? (
                        <img
                          src={team.emblem}
                          alt=""
                          className="h-8 w-8 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-xs font-bold text-gray-500">
                          {team.name?.[0] ?? "?"}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-Label-Primary">
                          {team.name ?? "이름 없음"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {team.activityArea ?? "-"} · 멤버 {team.members?.length ?? 0}명
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop */}
                  <span className="hidden text-xs text-gray-500 md:block col-span-1">{team.id}</span>
                  <div className="hidden md:flex md:items-center md:gap-3 col-span-4">
                    {team.emblem ? (
                      <img src={team.emblem} alt="" className="h-8 w-8 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-xs font-bold text-gray-500">
                        {team.name?.[0] ?? "?"}
                      </div>
                    )}
                    <span className="text-sm font-medium text-Label-Primary">
                      {team.name ?? "이름 없음"}
                    </span>
                  </div>
                  <span className="hidden text-xs text-gray-400 md:block col-span-3">
                    {team.activityArea ?? "-"}
                  </span>
                  <span className="hidden text-xs text-gray-400 md:block col-span-2">
                    {team.members?.length ?? 0}명
                  </span>
                  <span className="hidden truncate text-xs text-gray-500 md:block col-span-2">
                    {team.description ?? "-"}
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
