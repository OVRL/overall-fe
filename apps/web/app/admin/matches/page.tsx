"use client";

import { useEffect, useState } from "react";

interface MatchTeam {
  id: number;
  name: string | null;
  emblem: string | null;
}

interface Match {
  id: number;
  matchDate: string | null;
  description: string | null;
  venueAddress: string | null;
  createdTeamId: number | null;
  createdTeam?: MatchTeam | null;
  quarterCount?: number | null;
  quarterDuration?: number | null;
}

interface GroupedMatches {
  [date: string]: Match[];
}

function TeamEmblem({ src, name }: { src: string | null | undefined; name: string | null | undefined }) {
  const [err, setErr] = useState(false);
  if (src && !err) return <img src={src} alt="" className="h-7 w-7 rounded-lg object-cover" onError={() => setErr(true)} />;
  return <div className="h-7 w-7 rounded-lg bg-gray-900 flex items-center justify-center text-[10px] font-bold text-gray-500">{name?.[0] ?? "?"}</div>;
}

function parseScore(description: string | null): { home: number; away: number } | null {
  if (!description) return null;
  try {
    const parsed = JSON.parse(description);
    if (parsed.score) return parsed.score;
  } catch { /* skip */ }
  return null;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Map<number, MatchTeam>>(new Map());
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<"date" | "list">("date");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [matchRes, teamRes] = await Promise.all([
          fetch("/api/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              query: `query AdminMatches {
                findMatch(limit: 300, offset: 0) {
                  id matchDate description venueAddress createdTeamId quarterCount quarterDuration
                }
              }`,
            }),
          }),
          fetch("/api/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              query: `query AdminMatchTeams {
                findManyTeam(limit: 200, offset: 0) {
                  items { id name emblem }
                }
              }`,
            }),
          }),
        ]);

        const matchJson = await matchRes.json();
        const teamJson = await teamRes.json();

        const fetchedMatches: Match[] = matchJson.data?.findMatch ?? [];
        setMatches(fetchedMatches);
        setTotalCount(fetchedMatches.length);

        const teamMap = new Map<number, MatchTeam>();
        for (const t of (teamJson.data?.findManyTeam?.items ?? [])) {
          teamMap.set(t.id, t);
        }
        setTeams(teamMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Group by date
  const grouped: GroupedMatches = {};
  for (const match of matches) {
    const dateKey = match.matchDate
      ? new Date(match.matchDate).toISOString().split("T")[0]
      : "날짜 미정";
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(match);
  }

  const sortedDates = Object.keys(grouped).sort((a, b) => {
    if (a === "날짜 미정") return 1;
    if (b === "날짜 미정") return -1;
    return b.localeCompare(a); // 최신 순
  });

  // Stats
  const today = new Date().toISOString().split("T")[0];
  const upcomingCount = Object.entries(grouped).filter(([d]) => d >= today && d !== "날짜 미정").reduce((s, [, ms]) => s + ms.length, 0);
  const pastCount = Object.entries(grouped).filter(([d]) => d < today).reduce((s, [, ms]) => s + ms.length, 0);

  function MatchCard({ match }: { match: Match }) {
    const team = match.createdTeamId ? teams.get(match.createdTeamId) : null;
    const score = parseScore(match.description);
    const isUpcoming = match.matchDate ? new Date(match.matchDate) > new Date() : false;
    const duration = match.quarterCount && match.quarterDuration
      ? `${match.quarterCount}쿼터 × ${match.quarterDuration}분`
      : null;

    return (
      <div
        onClick={() => setSelectedMatch(match)}
        className="rounded-xl border border-gray-900 bg-gray-1300 px-4 py-3 cursor-pointer hover:border-gray-700 hover:bg-surface-secondary transition-all"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <TeamEmblem src={team?.emblem} name={team?.name} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-Label-Primary truncate">{team?.name ?? `팀 #${match.createdTeamId}`}</p>
              {match.matchDate && (
                <p className="text-[10px] text-gray-500">{formatTime(match.matchDate)}</p>
              )}
              {match.venueAddress && (
                <p className="text-[10px] text-gray-600 truncate max-w-[180px]">📍 {match.venueAddress}</p>
              )}
              {duration && <p className="text-[10px] text-gray-600">{duration}</p>}
            </div>
          </div>
          <div className="shrink-0 text-right">
            {score ? (
              <div>
                <p className="text-lg font-black text-Label-Primary">{score.home} : {score.away}</p>
                <p className="text-[10px] text-gray-500">최종 스코어</p>
              </div>
            ) : (
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${isUpcoming ? "bg-blue-500/10 text-blue-400" : "bg-gray-600/10 text-gray-500"}`}>
                {isUpcoming ? "예정" : "기록 없음"}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-Label-Primary">경기 일정</h1>
          <p className="mt-1 text-sm text-gray-500">전체 {totalCount}경기</p>
        </div>
        <div className="flex gap-2">
          {(["date", "list"] as const).map((mode) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${viewMode === mode ? "bg-green-600 text-black" : "bg-surface-secondary text-gray-500 hover:bg-surface-elevated border border-gray-900"}`}>
              {mode === "date" ? "날짜별" : "목록"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "전체 경기", value: totalCount, color: "text-Label-Primary" },
          { label: "예정 경기", value: upcomingCount, color: "text-blue-400" },
          { label: "완료 경기", value: pastCount, color: "text-gray-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-900 bg-surface-secondary p-4">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color}`}>{loading ? "-" : s.value}</p>
          </div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-900" />)}
        </div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 rounded-2xl border border-gray-900 bg-surface-secondary">
          <svg className="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <p className="text-sm text-gray-600">등록된 경기가 없습니다</p>
        </div>
      ) : viewMode === "date" ? (
        <div className="space-y-8">
          {sortedDates.map((date) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-Label-Primary">
                  {date === "날짜 미정" ? "날짜 미정" : formatDate(date + "T00:00:00")}
                </h3>
                <div className="flex-1 h-px bg-gray-900" />
                <span className="text-xs text-gray-600">{grouped[date].length}경기</span>
              </div>
              <div className="space-y-2">
                {grouped[date].map((match) => <MatchCard key={match.id} match={match} />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-900 bg-surface-secondary overflow-hidden">
          <div className="hidden border-b border-gray-900 px-6 py-3 md:grid md:grid-cols-12 md:gap-4">
            <span className="col-span-1 text-xs font-medium text-gray-600">ID</span>
            <span className="col-span-3 text-xs font-medium text-gray-600">팀</span>
            <span className="col-span-3 text-xs font-medium text-gray-600">경기 일시</span>
            <span className="col-span-3 text-xs font-medium text-gray-600">장소</span>
            <span className="col-span-2 text-xs font-medium text-gray-600">스코어</span>
          </div>
          <div className="divide-y divide-gray-900">
            {matches.map((match) => {
              const team = match.createdTeamId ? teams.get(match.createdTeamId) : null;
              const score = parseScore(match.description);
              return (
                <div key={match.id} onClick={() => setSelectedMatch(match)}
                  className="px-6 py-4 md:grid md:grid-cols-12 md:items-center md:gap-4 cursor-pointer hover:bg-gray-900/50 transition-colors">
                  <span className="hidden text-xs text-gray-500 md:block col-span-1">{match.id}</span>
                  <div className="hidden md:flex md:items-center md:gap-2 col-span-3">
                    <TeamEmblem src={team?.emblem} name={team?.name} />
                    <span className="text-sm font-medium text-Label-Primary truncate">{team?.name ?? `#${match.createdTeamId}`}</span>
                  </div>
                  <span className="hidden text-xs text-gray-400 md:block col-span-3">
                    {match.matchDate ? new Date(match.matchDate).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}
                  </span>
                  <span className="hidden truncate text-xs text-gray-500 md:block col-span-3">{match.venueAddress ?? "-"}</span>
                  <span className="hidden text-xs text-Label-Primary font-bold md:block col-span-2">
                    {score ? `${score.home} : ${score.away}` : <span className="text-gray-600 font-normal">-</span>}
                  </span>

                  {/* Mobile */}
                  <div className="md:hidden flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TeamEmblem src={team?.emblem} name={team?.name} />
                      <div>
                        <p className="text-sm font-medium text-Label-Primary">{team?.name ?? `#${match.createdTeamId}`}</p>
                        <p className="text-xs text-gray-600">
                          {match.matchDate ? new Date(match.matchDate).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "-"}
                        </p>
                      </div>
                    </div>
                    {score && <span className="text-sm font-black text-Label-Primary">{score.home}:{score.away}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Match Detail Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedMatch(null)} />
          <div className="relative w-full max-w-md bg-surface-secondary border border-gray-900 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-Label-Primary">경기 상세</h3>
                <p className="text-xs text-gray-500">ID: {selectedMatch.id}</p>
              </div>
              <button onClick={() => setSelectedMatch(null)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-900 transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {(() => {
              const team = selectedMatch.createdTeamId ? teams.get(selectedMatch.createdTeamId) : null;
              const score = parseScore(selectedMatch.description);
              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-gray-1300 border border-gray-900 rounded-xl px-4 py-3">
                    <TeamEmblem src={team?.emblem} name={team?.name} />
                    <div>
                      <p className="text-sm font-bold text-Label-Primary">{team?.name ?? `팀 #${selectedMatch.createdTeamId}`}</p>
                      <p className="text-[10px] text-gray-600">주최 팀</p>
                    </div>
                  </div>

                  {score && (
                    <div className="bg-gray-1300 border border-gray-900 rounded-xl px-4 py-4 text-center">
                      <p className="text-3xl font-black text-Label-Primary">{score.home} : {score.away}</p>
                      <p className="text-xs text-gray-600 mt-1">최종 스코어</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    {[
                      { label: "경기 일시", value: selectedMatch.matchDate ? new Date(selectedMatch.matchDate).toLocaleString("ko-KR") : "-" },
                      { label: "장소", value: selectedMatch.venueAddress ?? "-" },
                      { label: "쿼터 구성", value: selectedMatch.quarterCount && selectedMatch.quarterDuration ? `${selectedMatch.quarterCount}쿼터 × ${selectedMatch.quarterDuration}분` : "-" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-start gap-3 text-sm">
                        <span className="w-20 shrink-0 text-[10px] font-bold text-gray-600 uppercase tracking-wide pt-0.5">{row.label}</span>
                        <span className="text-gray-300 leading-relaxed">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
