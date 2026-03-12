"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { DatePicker } from "@/components/ui/date/DatePicker";
import { TimePicker, formatTimeToKorean } from "@/components/ui/date/TimePicker";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
type VoteStatus = "no-vote" | "ongoing" | "completed";

interface VotePlayer {
  backNumber: number;
  name: string;
  votes: number;
}

interface MatchCard {
  id: string;
  date: string;
  opponent: string;
  score: string;
  status: VoteStatus;
  totalVotes?: number;
  deadline?: string;
  top3?: VotePlayer[];
  liveVotes?: { name: string; position: string; votes: number; maxVotes: number }[];
}

// ──────────────────────────────────────────────
// Mock 데이터
// ──────────────────────────────────────────────
const MOCK_MATCHES: MatchCard[] = [
  {
    id: "1",
    date: "2026. 2. 25.",
    opponent: "레알 마드리드",
    score: "1 - 1",
    status: "no-vote",
  },
  {
    id: "2",
    date: "2026. 2. 25.",
    opponent: "레알 마드리드",
    score: "1 - 1",
    status: "ongoing",
    totalVotes: 25,
    deadline: "2026. 2. 21. 18:00까지",
    liveVotes: [
      { name: "정수현", position: "MF", votes: 12, maxVotes: 12 },
      { name: "정수현", position: "MF", votes: 12, maxVotes: 12 },
      { name: "정수현", position: "MF", votes: 10, maxVotes: 12 },
      { name: "정수현", position: "MF", votes: 8, maxVotes: 12 },
    ],
  },
  {
    id: "3",
    date: "2026. 2. 25.",
    opponent: "레알 마드리드",
    score: "3 - 1",
    status: "completed",
    top3: [
      { backNumber: 20, name: "김정수", votes: 24 },
      { backNumber: 10, name: "호날두", votes: 14 },
      { backNumber: 8, name: "제라두", votes: 7 },
    ],
  },
  {
    id: "4",
    date: "2026. 2. 25.",
    opponent: "레알 마드리드",
    score: "3 - 1",
    status: "completed",
    top3: [
      { backNumber: 20, name: "김정수", votes: 24 },
      { backNumber: 10, name: "호날두", votes: 14 },
      { backNumber: 8, name: "제라두", votes: 7 },
    ],
  },
  {
    id: "5",
    date: "2026. 2. 25.",
    opponent: "레알 마드리드",
    score: "3 - 1",
    status: "completed",
    top3: [
      { backNumber: 20, name: "김정수", votes: 24 },
      { backNumber: 10, name: "호날두", votes: 14 },
      { backNumber: 8, name: "제라두", votes: 7 },
    ],
  },
  {
    id: "6",
    date: "2026. 2. 25.",
    opponent: "레알 마드리드",
    score: "3 - 1",
    status: "completed",
    top3: [
      { backNumber: 20, name: "김정수", votes: 24 },
      { backNumber: 10, name: "호날두", votes: 14 },
      { backNumber: 8, name: "제라두", votes: 7 },
    ],
  },
  {
    id: "7",
    date: "2026. 2. 25.",
    opponent: "레알 마드리드",
    score: "3 - 1",
    status: "completed",
    top3: [
      { backNumber: 20, name: "김정수", votes: 24 },
      { backNumber: 10, name: "호날두", votes: 14 },
      { backNumber: 8, name: "제라두", votes: 7 },
    ],
  },
];

// ──────────────────────────────────────────────
// 아이콘
// ──────────────────────────────────────────────
const TrophyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-500">
    <path d="M7 9.5C4.79 9.5 3 7.71 3 5.5V2h8v3.5c0 2.21-1.79 4-4 4Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M3 3.5H1.5A1.5 1.5 0 0 0 3 5M11 3.5h1.5A1.5 1.5 0 0 1 11 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M7 9.5V12M4.5 12h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// ──────────────────────────────────────────────
// 상태 뱃지
// ──────────────────────────────────────────────
const StatusBadge = ({ status }: { status: VoteStatus }) => {
  if (status === "ongoing")
    return (
      <span className="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-md bg-primary/20 text-primary border border-primary/40">
        투표 진행중
      </span>
    );
  if (status === "completed")
    return (
      <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#333] text-gray-500 border border-white/8">
        투표 완료
      </span>
    );
  return null;
};



// ──────────────────────────────────────────────
// MOM 투표 만들기 모달
// ──────────────────────────────────────────────
function CreateVoteModal({
  noVoteMatches,
  onClose,
  onCreate,
}: {
  noVoteMatches: MatchCard[];
  onClose: () => void;
  onCreate: (matchId: string) => void;
}) {
  const [selectedMatch, setSelectedMatch] = useState<MatchCard | null>(
    noVoteMatches[0] ?? null
  );
  const [showMatchList, setShowMatchList] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [deadlineTime, setDeadlineTime] = useState("12:00");
  const [alertOn, setAlertOn] = useState(false);
  const [kakaoOn, setKakaoOn] = useState(true);

  // 마감시간 표시 텍스트
  const formattedDeadline = deadlineDate
    ? `${format(deadlineDate, "yyyy. MM. dd. eee", { locale: ko })}  ${formatTimeToKorean(deadlineTime)}`
    : `마감 날짜를 선택해주세요`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-2xl">
        {/* 헤더 */}
        <div className="relative flex items-center justify-center px-6 py-5 border-b border-white/10">
          <h2 className="text-sm font-bold text-white">MOM 투표 만들기</h2>
          <button
            onClick={onClose}
            className="absolute right-5 text-gray-500 hover:text-white transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* 경기 선택 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMatchList((p) => !p)}
              className="w-full bg-[#2a2a2a] rounded-xl px-4 py-3 flex items-center justify-between hover:bg-[#333] transition-colors"
            >
              {selectedMatch ? (
                <span className="text-sm text-white">
                  <span className="text-xs text-gray-500 mr-3">{selectedMatch.date}</span>
                  <span className="font-semibold">vs {selectedMatch.opponent}</span>
                  <span className="text-gray-300 ml-3 font-mono">{selectedMatch.score}</span>
                </span>
              ) : (
                <span className="text-sm text-gray-500">경기를 선택해주세요</span>
              )}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                className={`text-gray-500 transition-transform shrink-0 ml-2 ${showMatchList ? "rotate-180" : ""}`}>
                <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* 경기 목록 드롭다운 */}
            {showMatchList && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMatchList(false)} />
                <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  {noVoteMatches.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-gray-500 text-center">
                      투표 가능한 경기가 없습니다.
                    </div>
                  ) : (
                    noVoteMatches.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => { setSelectedMatch(m); setShowMatchList(false); }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-white/8 transition-colors border-b border-white/5 last:border-none ${selectedMatch?.id === m.id ? "bg-primary/10" : ""
                          }`}
                      >
                        <span className="text-xs text-gray-500 mr-3">{m.date}</span>
                        <span className={`font-semibold ${selectedMatch?.id === m.id ? "text-primary" : "text-white"}`}>
                          vs {m.opponent}
                        </span>
                        <span className="text-gray-400 ml-3 font-mono">{m.score}</span>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* 마감 시간 설정 */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400">마감 시간 설정</p>
            <div className="bg-[#2a2a2a] rounded-xl overflow-hidden">
              {/* 날짜 */}
              <div className="px-4 py-2 border-b border-white/8">
                <DatePicker
                  value={deadlineDate}
                  onChange={setDeadlineDate}
                  placeholder="날짜 선택"
                  className="text-sm text-white bg-transparent"
                />
              </div>
              {/* 시간 */}
              <div className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">🕐</span>
                  <TimePicker
                    value={deadlineTime}
                    onChange={setDeadlineTime}
                    className="flex-1 text-sm text-white"
                  />
                </div>
              </div>
            </div>
            {deadlineDate && (
              <p className="text-[10px] text-gray-500 px-1">{formattedDeadline}</p>
            )}
          </div>

          {/* 마감 알림 */}
          <div className="flex items-center justify-between bg-[#2a2a2a] rounded-xl px-4 py-3.5">
            <div>
              <p className="text-sm text-white font-medium">마감 알림</p>
              <p className="text-xs text-gray-500 mt-0.5">종료 30분 전 알림</p>
            </div>
            {/* 토글 — 기존 디자인 방식 */}
            <button
              type="button"
              role="switch"
              aria-checked={alertOn}
              onClick={() => setAlertOn((p) => !p)}
              style={{ width: 44, height: 24, borderRadius: 12, padding: 2, flexShrink: 0 }}
              className={`relative transition-colors ${alertOn ? "bg-primary" : "bg-[#3a3a3a]"}`}
            >
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: alertOn ? 22 : 2,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  transition: "left 0.2s",
                }}
              />
            </button>
          </div>

          {/* 카카오톡 발송 */}
          <div className="flex items-center justify-between bg-[#2a2a2a] rounded-xl px-4 py-3.5">
            <div>
              <p className="text-sm text-white font-medium">카카오톡 발송</p>
              <p className="text-xs text-gray-500 mt-0.5">그룹원에게 투표 알림 발송</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={kakaoOn}
              onClick={() => setKakaoOn((p) => !p)}
              style={{ width: 44, height: 24, borderRadius: 12, padding: 2, flexShrink: 0 }}
              className={`relative transition-colors ${kakaoOn ? "bg-primary" : "bg-[#3a3a3a]"}`}
            >
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: kakaoOn ? 22 : 2,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  transition: "left 0.2s",
                }}
              />
            </button>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-r border-white/10"
          >
            취소
          </button>
          <button
            onClick={() => selectedMatch && onCreate(selectedMatch.id)}
            disabled={!selectedMatch}
            className="flex-1 py-4 text-sm font-bold text-black bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            투표 만들기
          </button>
        </div>
      </div>
    </div>
  );
}


// ──────────────────────────────────────────────
// 경기 카드 (no-vote)
// ──────────────────────────────────────────────
function NoVoteCard({
  match,
  onCreateClick,
}: {
  match: MatchCard;
  onCreateClick: () => void;
}) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/8 px-4 md:px-5 py-3 md:py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <span className="text-xs text-gray-500 shrink-0">{match.date}</span>
        <span className="text-sm font-semibold text-white">
          vs {match.opponent}
        </span>
        <span className="text-sm text-gray-300 font-mono">{match.score}</span>
      </div>
      <button
        onClick={onCreateClick}
        className="w-full md:w-auto bg-primary text-black text-xs font-bold px-4 py-2 flex items-center justify-center rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
      >
        MOM 투표 만들기
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────
// 경기 카드 (ongoing) — 접기/펼치기
// ──────────────────────────────────────────────
function OngoingCard({ match }: { match: MatchCard }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/8 overflow-hidden">
      {/* 카드 헤더 */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full px-4 md:px-5 py-3 md:py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 hover:bg-white/3 transition-colors text-left md:text-center"
      >
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <span className="text-xs text-gray-500 shrink-0">{match.date}</span>
          <span className="text-sm font-semibold text-white">
            vs {match.opponent}
          </span>
          <span className="text-sm text-gray-300 font-mono">{match.score}</span>
          <StatusBadge status="ongoing" />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-white">{match.totalVotes}표</p>
            <p className="text-[10px] text-gray-500">{match.deadline}</p>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={`text-gray-500 transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* 확장 - 투표 현황 */}
      {expanded && (
        <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-white/8">
          <p className="text-xs font-semibold text-white mt-4 mb-3">투표 현황</p>
          <div className="space-y-3">
            {match.liveVotes?.map((lv, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white font-medium">{lv.name}</span>
                    <span className="text-[10px] text-gray-500">{lv.position}</span>
                  </div>
                  <span className="text-xs text-white font-mono">{lv.votes}표</span>
                </div>
                <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.round((lv.votes / lv.maxVotes) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// 경기 카드 (completed) — Top 3 표시
// ──────────────────────────────────────────────
function CompletedCard({ match, onClick }: { match: MatchCard; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full bg-[#1a1a1a] rounded-2xl border border-white/8 px-4 md:px-5 py-3 md:py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:bg-white/5 transition-colors cursor-pointer">
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <span className="text-xs text-gray-500 shrink-0">{match.date}</span>
        <span className="text-sm font-semibold text-white">
          vs {match.opponent}
        </span>
        <span className="text-sm text-gray-300 font-mono">{match.score}</span>
        <StatusBadge status="completed" />
      </div>

      {/* Top 3 */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
        {match.top3?.map((player, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 bg-[#242424] border border-white/8 rounded-xl px-3 py-2"
          >
            <TrophyIcon />
            <div className="text-left">
              <p className="text-[11px] font-semibold text-white leading-none">
                {player.backNumber}. {player.name}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">{player.votes}표</p>
            </div>
          </div>
        ))}
      </div>
    </button>
  );
}

// ──────────────────────────────────────────────
// 전체 투표 결과 모달
// ──────────────────────────────────────────────
function CompletedVoteModal({ match, onClose }: { match: MatchCard; onClose: () => void }) {
  // 모의 데이터에서 전체가 없을 경우 top3를 활용
  const votes = match.liveVotes && match.liveVotes.length > 0 
    ? match.liveVotes 
    : match.top3?.map(t => ({ name: t.name, position: "MF", votes: t.votes, maxVotes: match.top3![0].votes })) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[#1e1e1e] rounded-2xl border border-white/10 shadow-2xl">
        <div className="relative flex items-center justify-center px-6 py-5 border-b border-white/10">
          <h2 className="text-sm font-bold text-white">투표 결과</h2>
          <button onClick={onClose} className="absolute right-5 text-gray-500 hover:text-white transition-colors text-xl leading-none">
            ×
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <div className="bg-[#2a2a2a] rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-xs text-gray-500">{match.date}</span>
            <span className="text-sm font-semibold text-white">vs {match.opponent}</span>
            <span className="text-sm text-gray-300 font-mono">{match.score}</span>
          </div>

          <p className="text-xs font-semibold text-white">전체 투표 현황</p>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {votes.map((lv, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white font-medium">{lv.name}</span>
                    <span className="text-[10px] text-gray-500">{lv.position}</span>
                  </div>
                  <span className="text-xs text-secondary font-mono text-primary">{lv.votes}표</span>
                </div>
                <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.round((lv.votes / (lv.maxVotes || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 border-t border-white/10">
          <button onClick={onClose} className="w-full py-3 text-sm font-bold text-black bg-primary rounded-xl hover:bg-primary/90 transition-colors">
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Panel
// ──────────────────────────────────────────────
export default function MOMVotePanel() {
  const [matches, setMatches] = useState<MatchCard[]>(MOCK_MATCHES);
  const [createTarget, setCreateTarget] = useState<MatchCard | null>(null);
  const [selectedCompletedMatch, setSelectedCompletedMatch] = useState<MatchCard | null>(null);

  const handleCreate = (matchId: string) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
            ...m,
            status: "ongoing" as VoteStatus,
            totalVotes: 0,
            deadline: "2026. 2. 21. 18:00까지",
            liveVotes: [],
          }
          : m
      )
    );
    setCreateTarget(null);
  };

  return (
    <div className="px-4 md:px-6 pt-4 md:pt-6 pb-10 max-w-4xl mx-auto w-full space-y-3">
      <h1 className="text-lg font-bold text-white mb-4 md:mb-5">MOM 투표 설정</h1>

      {matches.map((match) => {
        if (match.status === "no-vote") {
          return (
            <NoVoteCard
              key={match.id}
              match={match}
              onCreateClick={() => setCreateTarget(match)}
            />
          );
        }
        if (match.status === "ongoing") {
          return <OngoingCard key={match.id} match={match} />;
        }
        return <CompletedCard key={match.id} match={match} onClick={() => setSelectedCompletedMatch(match)} />;
      })}

      {/* MOM 투표 만들기 모달 */}
      {createTarget && (
        <CreateVoteModal
          noVoteMatches={matches.filter((m) => m.status === "no-vote")}
          onClose={() => setCreateTarget(null)}
          onCreate={handleCreate}
        />
      )}

      {/* 전체 투표 결과 모달 */}
      {selectedCompletedMatch && (
        <CompletedVoteModal
          match={selectedCompletedMatch}
          onClose={() => setSelectedCompletedMatch(null)}
        />
      )}
    </div>
  );
}
