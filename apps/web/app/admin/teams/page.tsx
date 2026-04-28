"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: number;
  role: string;
  user: { name: string | null; profileImage: string | null; email?: string | null; mainPosition?: string | null } | null;
}

interface Team {
  id: number;
  name: string | null;
  activityArea: string | null;
  region: { sidoName: string | null; siggName: string | null } | null;
  description: string | null;
  emblem: string | null;
  members: TeamMember[] | null;
}

interface JoinRequest {
  id: number;
  userId: number;
  status: string;
  createdAt: string;
  message?: string | null;
  rejectedReason?: string | null;
}

type DetailTab = "info" | "members" | "joins";

function EmblemAvatar({ src, name, size = "8", rounded = "lg" }: { src: string | null; name: string | null; size?: string; rounded?: string }) {
  const [err, setErr] = useState(false);
  const cls = `h-${size} w-${size}`;
  if (src && !err) return <img src={src} alt="" className={`${cls} rounded-${rounded} object-cover`} onError={() => setErr(true)} />;
  return <div className={`flex ${cls} items-center justify-center rounded-${rounded} bg-gray-900 text-xs font-bold text-gray-500`}>{name?.[0] ?? "?"}</div>;
}

function MemberAvatar({ src, name }: { src: string | null; name: string | null }) {
  const [err, setErr] = useState(false);
  if (src && !err) return <img src={src} alt="" className="h-full w-full object-cover" onError={() => setErr(true)} />;
  return <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-500">{name?.[0] ?? "?"}</div>;
}

function roleLabel(role: string) {
  switch (role) {
    case "MANAGER": return "감독";
    case "CAPTAIN": return "주장";
    case "MEMBER": return "멤버";
    default: return role;
  }
}

function statusBadge(status: string) {
  switch (status) {
    case "PENDING":
      return <span className="rounded-full px-2 py-0.5 text-[0.625rem] font-semibold bg-yellow-500/10 text-yellow-400">대기중</span>;
    case "APPROVED":
      return <span className="rounded-full px-2 py-0.5 text-[0.625rem] font-semibold bg-green-600/10 text-green-500">승인완료</span>;
    case "REJECTED":
      return <span className="rounded-full px-2 py-0.5 text-[0.625rem] font-semibold bg-red-500/10 text-red-400">거절됨</span>;
    default:
      return <span className="rounded-full px-2 py-0.5 text-[0.625rem] font-semibold bg-gray-600/10 text-gray-500">{status}</span>;
  }
}

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<DetailTab>("info");
  const [matches, setMatches] = useState<any[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

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
                  id name activityArea description emblem
                  region { sidoName siggName }
                  members {
                    id role
                    user { name profileImage mainPosition }
                  }
                }
              }
            }`,
          }),
        });
        const json = await res.json();
        setTeams(json.data?.findManyTeam?.items ?? []);
        setTotalCount(json.data?.findManyTeam?.totalCount ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!selectedTeam) {
      setMatches([]);
      setJoinRequests([]);
      return;
    }
    setDetailLoading(true);
    Promise.all([
      fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          query: `query TeamMatches($teamId: Int!) {
            findMatch(createdTeamId: $teamId) {
              id matchDate description venueAddress
            }
          }`,
          variables: { teamId: selectedTeam.id },
        }),
      }).then((r) => r.json()),
      fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          query: `query TeamJoinRequests($teamId: Int!) {
            findTeamJoinRequest(teamId: $teamId) {
              id userId status createdAt message rejectedReason
            }
          }`,
          variables: { teamId: selectedTeam.id },
        }),
      }).then((r) => r.json()),
    ])
      .then(([matchJson, joinJson]) => {
        setMatches(matchJson.data?.findMatch ?? []);
        setJoinRequests(joinJson.data?.findTeamJoinRequest ?? []);
      })
      .catch(console.error)
      .finally(() => setDetailLoading(false));
  }, [selectedTeam]);

  const filteredTeams = search.trim()
    ? teams.filter(
        (t) =>
          t.name?.toLowerCase().includes(search.toLowerCase()) ||
          t.activityArea?.toLowerCase().includes(search.toLowerCase()) ||
          t.region?.sidoName?.toLowerCase().includes(search.toLowerCase()),
      )
    : teams;

  const pendingCount = joinRequests.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-Label-Primary">팀 관리</h1>
        <p className="mt-1 text-sm text-gray-500">전체 {totalCount}개 팀 · 클릭하면 상세 정보를 볼 수 있습니다</p>
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
          placeholder="팀 이름 또는 활동 지역 검색..."
          className="w-full rounded-xl border border-gray-900 bg-surface-secondary py-3 pl-11 pr-4 text-sm text-Label-Primary placeholder:text-gray-700 focus:border-green-600 focus:outline-none transition-colors"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-900 bg-surface-secondary overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-900" />)}
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <p className="text-sm text-gray-600">{search ? "검색 결과가 없습니다" : "등록된 팀이 없습니다"}</p>
          </div>
        ) : (
          <>
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
                  onClick={() => { setSelectedTeam(team); setActiveTab("info"); }}
                  className="px-6 py-4 md:grid md:grid-cols-12 md:items-center md:gap-4 cursor-pointer hover:bg-gray-900/50 transition-colors"
                >
                  <div className="md:hidden">
                    <div className="flex items-center gap-3">
                      <EmblemAvatar src={team.emblem} name={team.name} />
                      <div>
                        <p className="text-sm font-medium text-Label-Primary">{team.name ?? "이름 없음"}</p>
                        <p className="text-xs text-gray-600">
                          {team.region ? `${team.region.sidoName} ${team.region.siggName}` : (team.activityArea ?? "-")} · 멤버 {team.members?.length ?? 0}명
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className="hidden text-xs text-gray-500 md:block col-span-1">{team.id}</span>
                  <div className="hidden md:flex md:items-center md:gap-3 col-span-4">
                    <EmblemAvatar src={team.emblem} name={team.name} />
                    <span className="text-sm font-medium text-Label-Primary">{team.name ?? "이름 없음"}</span>
                  </div>
                  <span className="hidden text-xs text-gray-400 md:block col-span-3">
                    {team.region ? `${team.region.sidoName} ${team.region.siggName}` : (team.activityArea ?? "-")}
                  </span>
                  <span className="hidden text-xs text-gray-400 md:block col-span-2">{team.members?.length ?? 0}명</span>
                  <span className="hidden truncate text-xs text-gray-500 md:block col-span-2">{team.description ?? "-"}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Full-screen Detail Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedTeam(null)} />
          <div className="relative w-full max-w-5xl h-full max-h-[90vh] bg-surface-secondary border border-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center gap-4 border-b border-gray-900 bg-surface-secondary/90 backdrop-blur px-6 py-4 shrink-0">
              <EmblemAvatar src={selectedTeam.emblem} name={selectedTeam.name} size="10" rounded="xl" />
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-Label-Primary truncate">{selectedTeam.name}</h2>
                <p className="text-xs text-gray-500">
                  {selectedTeam.region ? `${selectedTeam.region.sidoName} ${selectedTeam.region.siggName}` : selectedTeam.activityArea}
                  {" · "}ID: {selectedTeam.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedTeam(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-900 hover:text-Label-Primary transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-900 px-6 shrink-0">
              {([
                { key: "info", label: "기본 정보" },
                { key: "members", label: `멤버 명단 (${selectedTeam.members?.length ?? 0})` },
                { key: "joins", label: `가입 현황 ${pendingCount > 0 ? `· 대기 ${pendingCount}` : ""}` },
              ] as { key: DetailTab; label: string }[]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                    activeTab === tab.key
                      ? "border-green-600 text-green-500"
                      : "border-transparent text-gray-500 hover:text-Label-Primary",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {detailLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-700 border-t-green-600" />
                </div>
              )}

              {!detailLoading && activeTab === "info" && (
                <div className="p-6 space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "멤버 수", value: `${selectedTeam.members?.length ?? 0}명` },
                      { label: "총 경기 수", value: `${matches.length}경기` },
                      { label: "가입 신청", value: `${joinRequests.length}건` },
                      { label: "대기중", value: `${pendingCount}건`, accent: pendingCount > 0 },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-gray-900 bg-gray-1300 p-4">
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">{s.label}</p>
                        <p className={cn("text-xl font-black", s.accent ? "text-yellow-400" : "text-Label-Primary")}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  {selectedTeam.description && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-Label-Primary">팀 소개</h4>
                      <div className="rounded-xl bg-gray-1300 border border-gray-900 p-4 text-sm text-Label-Secondary whitespace-pre-wrap leading-relaxed">
                        {selectedTeam.description}
                      </div>
                    </div>
                  )}

                  {/* Match records */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-Label-Primary">경기 기록 ({matches.length})</h4>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {matches.map((match: any) => {
                        let scoreInfo = null;
                        try { if (match.description) scoreInfo = JSON.parse(match.description).score; } catch { /* skip */ }
                        const isWin = scoreInfo ? scoreInfo.home > scoreInfo.away : false;
                        const isDraw = scoreInfo ? scoreInfo.home === scoreInfo.away : false;
                        return (
                          <div key={match.id} className="flex items-center justify-between rounded-xl border border-gray-900 bg-gray-1300 px-4 py-3">
                            <div>
                              <p className="text-xs font-bold text-Label-Primary">
                                {match.matchDate ? new Date(match.matchDate).toLocaleDateString("ko-KR") : "-"}
                              </p>
                              {match.venueAddress && <p className="text-[10px] text-gray-600 mt-0.5">{match.venueAddress}</p>}
                            </div>
                            {scoreInfo ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-Label-Primary">{scoreInfo.home} : {scoreInfo.away}</span>
                                <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-black", isWin ? "bg-blue-500/20 text-blue-400" : isDraw ? "bg-gray-500/20 text-gray-400" : "bg-red-500/20 text-red-400")}>
                                  {isWin ? "W" : isDraw ? "D" : "L"}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-600">기록 없음</span>
                            )}
                          </div>
                        );
                      })}
                      {matches.length === 0 && (
                        <div className="py-8 text-center text-xs text-gray-600 bg-gray-1300 rounded-xl border border-dashed border-gray-900">경기 기록이 없습니다</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {!detailLoading && activeTab === "members" && (
                <div className="p-6 space-y-3">
                  <p className="text-xs text-gray-500">총 {selectedTeam.members?.length ?? 0}명</p>
                  <div className="rounded-xl border border-gray-900 bg-gray-1300 divide-y divide-gray-900 overflow-hidden">
                    {selectedTeam.members?.map((member) => (
                      <div key={member.id} className="flex items-center gap-4 px-4 py-3">
                        <div className="h-9 w-9 rounded-full bg-gray-900 overflow-hidden border border-white/5 shrink-0">
                          <MemberAvatar src={member.user?.profileImage ?? null} name={member.user?.name ?? null} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-Label-Primary truncate">{member.user?.name ?? "이름 없음"}</p>
                            <span className={cn(
                              "shrink-0 rounded px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase",
                              member.role === "MANAGER" ? "bg-purple-500/15 text-purple-400"
                                : member.role === "CAPTAIN" ? "bg-blue-500/15 text-blue-400"
                                : "bg-gray-600/10 text-gray-500",
                            )}>
                              {roleLabel(member.role)}
                            </span>
                          </div>
                          {member.user?.mainPosition && (
                            <p className="text-[10px] text-gray-600">{member.user.mainPosition}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {(!selectedTeam.members || selectedTeam.members.length === 0) && (
                      <div className="py-8 text-center text-xs text-gray-600">멤버가 없습니다</div>
                    )}
                  </div>
                </div>
              )}

              {!detailLoading && activeTab === "joins" && (
                <div className="p-6 space-y-4">
                  {/* Status summary */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "대기중", count: joinRequests.filter(r => r.status === "PENDING").length, color: "text-yellow-400 bg-yellow-500/10" },
                      { label: "승인완료", count: joinRequests.filter(r => r.status === "APPROVED").length, color: "text-green-500 bg-green-600/10" },
                      { label: "거절됨", count: joinRequests.filter(r => r.status === "REJECTED").length, color: "text-red-400 bg-red-500/10" },
                    ].map((s) => (
                      <div key={s.label} className={cn("rounded-xl border border-gray-900 p-3 text-center", s.color.split(" ")[1])}>
                        <p className={cn("text-xl font-black", s.color.split(" ")[0])}>{s.count}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {joinRequests.map((req) => (
                      <div key={req.id} className="rounded-xl border border-gray-900 bg-gray-1300 px-4 py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {statusBadge(req.status)}
                            <span className="text-xs text-gray-400">유저 ID: {req.userId}</span>
                            <span className="text-[10px] text-gray-600">
                              {new Date(req.createdAt).toLocaleDateString("ko-KR")}
                            </span>
                          </div>
                          {req.message && (
                            <p className="text-xs text-gray-400 italic mt-1 truncate">"{req.message}"</p>
                          )}
                          {req.rejectedReason && (
                            <p className="text-[10px] text-red-400 mt-0.5">거절 사유: {req.rejectedReason}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {joinRequests.length === 0 && (
                      <div className="py-12 text-center text-sm text-gray-600 bg-gray-1300 rounded-xl border border-dashed border-gray-900">
                        가입 신청 내역이 없습니다
                      </div>
                    )}
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
