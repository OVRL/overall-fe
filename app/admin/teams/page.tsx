"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "../layout";
import { cn } from "@/lib/utils";

interface Team {
  id: number;
  name: string | null;
  activityArea: string | null;
  region: {
    sidoName: string | null;
    siggName: string | null;
  } | null;
  description: string | null;
  emblem: string | null;
  members: { 
    id: number;
    role: string;
    user: {
      name: string;
      profileImage: string | null;
    } | null;
  }[] | null;
}

export default function AdminTeamsPage() {
  const { email } = useAdminAuth();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const teamIdFromUrl = searchParams?.get("teamId");
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");

  // URL 파라미터에 따른 초기 선택 팀 설정
  useEffect(() => {
    if (teams.length > 0 && teamIdFromUrl) {
      const team = teams.find(t => String(t.id) === teamIdFromUrl);
      if (team) {
        setSelectedTeam(team);
      }
    }
  }, [teams, teamIdFromUrl]);

  // 선택 팀 변경 시 URL 업데이트
  const handleSelectTeam = (team: Team | null) => {
    setSelectedTeam(team);
    const url = new URL(window.location.href);
    if (team) {
      url.searchParams.set("teamId", String(team.id));
    } else {
      url.searchParams.delete("teamId");
    }
    window.history.pushState({}, "", url.toString());
  };

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
                  region {
                    sidoName
                    siggName
                  }
                  description
                  emblem
                  members { 
                    id 
                    role
                    user {
                      name
                      profileImage
                    }
                  }
                }
              }
            }`,
          }),
        });
        const json = await res.json();
        const data = json.data;
        const fetchedTeams = data?.findManyTeam?.items ?? [];
        setTeams(fetchedTeams);
        setTotalCount(data?.findManyTeam?.totalCount ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 선택된 팀의 매치 기록을 별도로 가져오는 Effect
  const [selectedTeamMatches, setSelectedTeamMatches] = useState<any[]>([]);
  useEffect(() => {
    if (!selectedTeam) {
      setSelectedTeamMatches([]);
      return;
    }
    async function loadMatches() {
      try {
        const res = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            query: `query TeamMatches($teamId: Int!) {
              findMatch(createdTeamId: $teamId) {
                id
                matchDate
                description
              }
            }`,
            variables: { teamId: selectedTeam?.id }
          }),
        });
        const json = await res.json();
        setSelectedTeamMatches(json.data?.findMatch ?? []);
      } catch (err) {
        console.error(err);
      }
    }
    loadMatches();
  }, [selectedTeam]);

  const filteredTeams = search.trim()
    ? teams.filter(
        (t) =>
          t.name?.toLowerCase().includes(search.toLowerCase()) ||
          t.activityArea?.toLowerCase().includes(search.toLowerCase()) ||
          t.region?.sidoName?.toLowerCase().includes(search.toLowerCase()) ||
          t.region?.siggName?.toLowerCase().includes(search.toLowerCase()),
      )
    : teams;

  return (
    <div className="relative space-y-6">
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
                  onClick={() => handleSelectTeam(team)}
                  className="px-6 py-4 md:grid md:grid-cols-12 md:items-center md:gap-4 cursor-pointer hover:bg-gray-900/50 transition-colors"
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
                          {team.region ? `${team.region.sidoName} ${team.region.siggName}` : (team.activityArea ?? "-")} · 멤버 {team.members?.length ?? 0}명
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
                    {team.region ? `${team.region.sidoName} ${team.region.siggName}` : (team.activityArea ?? "-")}
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

      {/* Team Detail Slide-over */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => handleSelectTeam(null)}
          />
          <div className="relative h-full w-full max-w-xl animate-slide-in-right bg-surface-secondary border-l border-gray-900 shadow-2xl overflow-y-auto">
            {/* Detail Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-900 bg-surface-secondary/80 backdrop-blur px-6 py-4">
              <h2 className="text-lg font-bold text-Label-Primary">팀 상세 정보</h2>
              <button 
                onClick={() => handleSelectTeam(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-900 hover:text-Label-Primary transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Profile Card */}
              <div className="flex flex-col items-center text-center gap-4">
                {selectedTeam.emblem ? (
                  <img src={selectedTeam.emblem} alt="" className="h-24 w-24 rounded-2xl object-cover ring-4 ring-gray-900/50" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gray-900 text-3xl font-bold text-gray-700">
                    {selectedTeam.name?.[0] ?? "?"}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-Label-Primary">{selectedTeam.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedTeam.region ? `${selectedTeam.region.sidoName} ${selectedTeam.region.siggName}` : selectedTeam.activityArea}
                  </p>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-900 bg-gray-1300 p-4 font-pretendard">
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">멤버</p>
                  <p className="text-xl font-black text-Label-Primary">{selectedTeam.members?.length ?? 0}<span className="text-xs font-normal ml-0.5 opacity-50">명</span></p>
                </div>
                <div className="rounded-xl border border-gray-900 bg-gray-1300 p-4 font-pretendard">
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">총 경기수</p>
                  <p className="text-xl font-black text-Label-Primary">{selectedTeamMatches.length}<span className="text-xs font-normal ml-0.5 opacity-50">회</span></p>
                </div>
              </div>

              {/* Match Records List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-Label-Primary flex items-center justify-between">
                  최근 경기 기록
                  <span className="text-xs font-normal text-gray-500">{selectedTeamMatches.length}</span>
                </h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {selectedTeamMatches.map((match: any) => {
                    let scoreInfo = null;
                    try {
                      if (match.description) scoreInfo = JSON.parse(match.description).score;
                    } catch (e) {}

                    const isWin = scoreInfo ? scoreInfo.home > scoreInfo.away : false;
                    const isDraw = scoreInfo ? scoreInfo.home === scoreInfo.away : false;

                    return (
                      <div key={match.id} className="flex items-center justify-between rounded-xl border border-gray-900 bg-gray-1300 px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-Label-Primary">
                            {new Date(match.matchDate).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-gray-600">ID: {match.id}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {scoreInfo && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-Label-Primary">{scoreInfo.home} : {scoreInfo.away}</span>
                              <span className={cn(
                                "px-1.5 py-0.5 rounded text-[10px] font-black uppercase",
                                isWin ? "bg-blue-500/20 text-blue-500" : isDraw ? "bg-gray-500/20 text-gray-500" : "bg-red-500/20 text-red-500"
                              )}>
                                {isWin ? "W" : isDraw ? "D" : "L"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {selectedTeamMatches.length === 0 && (
                    <div className="py-8 text-center text-xs text-gray-600 bg-gray-1300 rounded-2xl border border-dashed border-gray-900">
                      경기 기록이 없습니다.
                    </div>
                  )}
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-Label-Primary flex items-center justify-between">
                  멤버 명단
                  <span className="text-xs font-normal text-gray-500">{selectedTeam.members?.length ?? 0}</span>
                </h4>
                <div className="divide-y divide-gray-900 rounded-2xl border border-gray-900 bg-gray-1300 overflow-hidden">
                  {selectedTeam.members?.map((member: any) => (
                    <div key={member.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="h-8 w-8 rounded-full bg-gray-900 overflow-hidden border border-white/5">
                        <img src={member.user?.profileImage || "/images/player/img_player_1.webp"} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-Label-Primary truncate">{member.user?.name}</p>
                        <p className="text-[10px] text-gray-600 uppercase font-bold tracking-tight">{member.role}</p>
                      </div>
                    </div>
                  ))}
                  {(!selectedTeam.members || selectedTeam.members.length === 0) && (
                    <div className="py-8 text-center text-xs text-gray-600">멤버가 없습니다.</div>
                  )}
                </div>
              </div>

              {/* Description */}
              {selectedTeam.description && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-Label-Primary">팀 설명</h4>
                  <div className="rounded-2xl bg-gray-1300 border border-gray-900 p-4 text-sm text-Label-Secondary whitespace-pre-wrap leading-relaxed italic">
                    "{selectedTeam.description}"
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
