"use client";

import { useState } from "react";
import { Settings, Check, Clock, Bell, Info, ShieldCheck, Zap, Plus, Minus, Hourglass, Layout, Trophy, Star, Medal, X } from "lucide-react";
import MOMVoteBoard from "./MOMVoteBoard";
import { INITIAL_PLAYERS } from "@/data/players";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────
function TimeStepper({
  label,
  value,
  unit,
  onIncrease,
  onDecrease,
  presets,
  onPresetSelect
}: {
  label: string;
  value: number;
  unit: string;
  onIncrease: () => void;
  onDecrease: () => void;
  presets: number[];
  onPresetSelect: (val: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-black text-gray-500 uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
          <Zap size={10} className="text-primary" />
          <span className="text-[9px] font-black text-primary">CUSTOM</span>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-3xl border border-white/5 p-6 flex flex-col items-center gap-6 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-8">
          <button
            onClick={onDecrease}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all shadow-lg"
          >
            <Minus size={20} />
          </button>
          <div className="flex flex-col items-center min-w-[80px]">
            <span className="text-4xl font-black text-white tabular-nums tracking-tighter">{value}</span>
            <span className="text-[10px] text-gray-600 font-black uppercase mt-1">{unit}</span>
          </div>
          <button
            onClick={onIncrease}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all shadow-lg"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => onPresetSelect(p)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-[10px] font-black transition-all border",
                value === p
                  ? "bg-primary border-primary text-black scale-105 shadow-lg shadow-primary/20"
                  : "bg-white/5 border-white/5 text-gray-500 hover:border-white/20 hover:text-white"
              )}
            >
              {p}{unit}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
type VoteStatus = "scheduled" | "ongoing" | "completed";

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
  scheduledAt?: string;
  top3?: VotePlayer[];
  liveVotes?: { name: string; position: string; votes: number; maxVotes: number }[];
}

const MOCK_MATCHES: MatchCard[] = [
  {
    id: "1",
    date: "2026. 2. 25.",
    opponent: "레알 마드리드",
    score: "1 - 1",
    status: "scheduled",
    scheduledAt: "2026. 3. 17. 19:00 (종료 1시간 후 자동시작)",
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
      { name: "정수현", position: "MF", votes: 12, maxVotes: 12 },
      { name: "정수현", position: "MF", votes: 12, maxVotes: 12 },
    ],
  },
  {
    id: "3",
    date: "2026. 2. 25.",
    opponent: "레알 마드리드",
    score: "3 - 1",
    status: "completed",
    totalVotes: 48,
    top3: [
      { backNumber: 20, name: "김정수", votes: 24 },
      { backNumber: 10, name: "호날두", votes: 14 },
      { backNumber: 8, name: "제라드", votes: 7 },
    ],
    liveVotes: [
      { name: "김정수", position: "FW", votes: 24, maxVotes: 24 },
      { name: "호날두", position: "MF", votes: 14, maxVotes: 24 },
      { name: "제라드", position: "DF", votes: 7, maxVotes: 24 },
    ]
  },
];

const StatusBadge = ({ status }: { status: VoteStatus }) => {
  if (status === "scheduled")
    return (
      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/10">
        투표 예정
      </span>
    );
  if (status === "ongoing")
    return (
      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
        투표 진행중
      </span>
    );
  if (status === "completed")
    return (
      <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/10 text-gray-400 border border-white/5">
        투표 완료
      </span>
    );
  return null;
};

// ──────────────────────────────────────────────
// 통합 설정 모달 (Global Settings)
// ──────────────────────────────────────────────
function GlobalSettingsModal({
  hasOngoingVote,
  onClose,
  onSave,
}: {
  hasOngoingVote: boolean;
  onClose: () => void;
  onSave: (settings: any) => void;
}) {
  const [startTimeOffset, setStartTimeOffset] = useState(1);
  const [duration, setDuration] = useState(24);
  const [reminders, setReminders] = useState({
    start: true,
    hourBefore: true,
    halfHourBefore: true
  });

  const handleSave = () => {
    if (hasOngoingVote) {
      alert("현재 투표가 진행 중인 경기가 있습니다.\n변경된 설정은 다음 경기부터 적용됩니다.");
    }
    onSave({ startTimeOffset, duration, reminders });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onClose()}
      />
      <div className="relative w-full max-w-lg bg-[#121212] rounded-[48px] border border-white/10 shadow-3xl overflow-hidden flex flex-col">
        <div className="relative flex items-center justify-between px-10 py-10 border-b border-white/5 bg-linear-to-b from-white/2 to-transparent">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black text-white tracking-tighter">MOM 투표 정책 설정</h2>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-primary" />
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Global Automation Policy</span>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="px-10 py-10 space-y-12 overflow-y-auto max-h-[70vh] scrollbar-hide">
          <section className="grid md:grid-cols-2 gap-8">
            <TimeStepper
              label="투표 시작 시점"
              value={startTimeOffset}
              unit="H"
              onIncrease={() => setStartTimeOffset(prev => prev + 1)}
              onDecrease={() => setStartTimeOffset(prev => Math.max(0, prev - 1))}
              presets={[1, 2, 3, 6]}
              onPresetSelect={setStartTimeOffset}
            />
            <TimeStepper
              label="투표 유지 기간"
              value={duration}
              unit="H"
              onIncrease={() => setDuration(prev => prev + 1)}
              onDecrease={() => setDuration(prev => Math.max(1, prev - 1))}
              presets={[12, 24, 36, 48]}
              onPresetSelect={setDuration}
            />
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Bell size={14} className="text-gray-500" />
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">리마인드 알림 (총 3회)</h3>
            </div>
            <div className="space-y-3">
              {[
                { key: "start", label: "투표 시작 알림", desc: "경기 시작 시점 즉시 카톡 발송" },
                { key: "hourBefore", label: "투표 종료 1시간 전", desc: "미참여 인원 대상 독려 알림" },
                { key: "halfHourBefore", label: "투표 종료 30분 전", desc: "최종 마감 안내 알림" }
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => setReminders(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className={cn(
                    "flex items-center justify-between bg-[#1a1a1a] rounded-[24px] px-8 py-5 border border-white/5 cursor-pointer transition-all",
                    reminders[item.key as keyof typeof reminders] ? "border-primary/20 bg-primary/2" : "hover:bg-[#222]"
                  )}
                >
                  <div className="flex flex-col">
                    <p className="text-sm text-white font-bold">{item.label}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{item.desc}</p>
                  </div>
                  <div className={cn("w-12 h-7 rounded-full p-1 transition-all", reminders[item.key as keyof typeof reminders] ? "bg-primary" : "bg-white/10")}>
                    <div className={cn("w-5 h-5 bg-white rounded-full transition-transform shadow-sm", reminders[item.key as keyof typeof reminders] ? "translate-x-5" : "translate-x-0")} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-white/5 rounded-[32px] p-8 border border-white/5 space-y-4">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-primary" />
              <span className="text-xs font-black text-white uppercase tracking-wider">안내 및 유의사항</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              • 처음에는 <span className="text-white font-bold italic">'오버롤 표준 가이드'</span>에 따라 자동 진행됩니다.<br />
              • 설정 변경 후 [저장하기]를 누르면 다음 경기부터 즉시 적용됩니다.<br />
              • 모든 시간 설정은 경기 종료 시점을 기준으로 계산됩니다.
            </p>
          </div>
        </div>

        <div className="p-10 flex gap-4 bg-black/40 border-t border-white/5">
          <button
            onClick={onClose}
            className="flex-1 py-5 text-sm font-bold text-gray-500 hover:text-white transition-all bg-white/5 rounded-[22px] border border-white/5"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-2 py-5 text-sm font-black text-black bg-primary hover:opacity-90 transition-all rounded-[22px] shadow-2xl shadow-primary/20"
          >
            설정 저장하기
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// [중요] 일반 직사각형 경기 카드 (투표 리스트용)
// ──────────────────────────────────────────────
function RectMatchCard({ match, children, expanded, onClick }: { match: MatchCard; children?: React.ReactNode; expanded?: boolean; onClick?: () => void }) {
  return (
    <div 
        className={cn(
            "relative bg-[#1a1a1a] overflow-hidden transition-all duration-500 border border-white/5 hover:border-primary/20 hover:bg-white/3 group",
            expanded ? "rounded-[32px] ring-2 ring-primary/20" : "rounded-[24px]"
        )}
        onClick={onClick}
    >
        {children}
    </div>
  );
}

function ScheduledCard({ match }: { match: MatchCard }) {
  return (
    <RectMatchCard match={match}>
      <div className="px-10 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-gray-500 font-bold">{match.date}</span>
            <StatusBadge status="scheduled" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-white tracking-tight">vs {match.opponent}</span>
            <span className="text-xl text-primary font-black italic">{match.score}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold italic">
          <Hourglass size={12} className="animate-spin-slow" />
          <span>{match.scheduledAt}</span>
        </div>
      </div>
    </RectMatchCard>
  );
}

function OngoingCard({ match }: { match: MatchCard }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <RectMatchCard match={match} expanded={expanded} onClick={() => setExpanded(!expanded)}>
        <div className="px-10 py-8 flex flex-row items-center justify-between gap-4 cursor-pointer">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-gray-500 font-bold">{match.date}</span>
              <StatusBadge status="ongoing" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-white tracking-tight">vs {match.opponent}</span>
              <span className="text-xl text-white/50 font-black italic">{match.score}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-lg font-black text-primary animate-pulse">{match.totalVotes}명 참여 중</span>
              <span className="text-[10px] text-gray-500 font-bold">{match.deadline}</span>
            </div>
            <div className={cn(
                "w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-all duration-500",
                expanded ? "bg-primary text-black rotate-180" : "text-gray-500"
            )}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </div>
          </div>
        </div>
      </RectMatchCard>

      {expanded && (
        <div className="mx-6 px-10 py-10 bg-black/40 rounded-b-[40px] border-x border-b border-white/5 animate-in slide-in-from-top-4 duration-500">
          <p className="text-xs font-black text-white mb-8 uppercase tracking-widest flex items-center gap-2">
            <Layout size={14} className="text-primary" />
            <span>투표 실시간 현황</span>
          </p>
          <div className="space-y-6">
            {match.liveVotes?.map((lv, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white font-bold">{lv.name}</span>
                    <span className="text-[10px] text-gray-600 font-black tracking-widest px-2 py-0.5 bg-white/5 rounded-md">{lv.position}</span>
                  </div>
                  <span className="text-sm text-white font-black">{lv.votes}표</span>
                </div>
                <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_15px_rgba(195,255,33,0.3)] rounded-full transition-all duration-1000 ease-in-out"
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

function CompletedCard({ match }: { match: MatchCard }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <RectMatchCard match={match} expanded={expanded} onClick={() => setExpanded(!expanded)}>
        <div className="px-10 py-8 flex flex-row items-center justify-between gap-4 cursor-pointer">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-gray-500 font-bold">{match.date}</span>
              <StatusBadge status="completed" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-white tracking-tight">vs {match.opponent}</span>
              <span className="text-xl text-gray-500 font-black italic">{match.score}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              {match.top3?.map((p, i) => (
                <div key={i} className="flex items-center gap-2 bg-black/40 border border-white/5 px-4 py-2 rounded-2xl">
                    <Trophy size={14} className={cn(i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : "text-amber-600")} />
                    <span className="text-xs font-black text-white">{p.name}</span>
                </div>
              ))}
            </div>
            <div className={cn(
                "w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-all duration-500",
                expanded ? "bg-white/10 text-white rotate-180" : "text-gray-500"
            )}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </div>
          </div>
        </div>
      </RectMatchCard>

      {expanded && (
        <div className="mx-6 px-10 py-10 bg-black/40 rounded-b-[40px] border-x border-b border-white/5 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-10">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Trophy size={16} className="text-yellow-400" />
                <span>최종 투표 결과</span>
              </p>
              <p className="text-[10px] text-gray-600 font-bold italic">전체 참여: {match.totalVotes}명 참여</p>
            </div>
          </div>

          <div className="grid gap-6">
            {match.liveVotes?.sort((a,b)=>b.votes-a.votes).map((lv, i) => (
              <div key={i} className="group flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={cn("text-[10px] font-black w-6", i < 3 ? "text-primary" : "text-gray-700")}>0{i+1}</span>
                    <span className={cn("text-sm font-bold", i === 0 ? "text-primary scale-110" : "text-white")}>{lv.name}</span>
                    <span className="text-[9px] text-gray-700 font-black tracking-widest px-1.5 py-0.5 bg-white/5 rounded-md">{lv.position}</span>
                    {i === 0 && <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] text-primary font-black animate-pulse">MVP</span>}
                  </div>
                  <span className="text-sm font-black text-white">{lv.votes}표</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <div 
                        className={cn("h-full rounded-full transition-all duration-1000", i === 0 ? "bg-primary" : "bg-gray-600")}
                        style={{ width: `${Math.round((lv.votes/lv.maxVotes)*100)}%` }}
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
// Main Panel
// ──────────────────────────────────────────────
export default function MOMVotePanel() {
  const [matches] = useState<MatchCard[]>(MOCK_MATCHES);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBoardOpen, setIsBoardOpen] = useState(false);

  const hasOngoingVote = matches.some(m => m.status === "ongoing");

  const handleSaveSettings = (data: any) => {
    console.log("Saving global settings:", data);
  };

  return (
    <div className="px-4 md:px-8 pt-8 md:pt-14 pb-24 max-w-5xl mx-auto w-full flex flex-col">
      <header className="flex items-center justify-between mb-12">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[20px] font-bold text-white tracking-tighter leading-none">MOM 투표 리스트</h1>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-[11px] text-gray-600 font-black uppercase tracking-[0.2em]">Automated Intelligence System</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBoardOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-[11px] font-black rounded-xl transition-all active:scale-95 shadow-2xl shadow-blue-900/30 group"
          >
            <Layout size={16} className="group-hover:rotate-12 transition-transform" />
            <span>MOM 보드 보기</span>
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-12 h-12 flex items-center justify-center hover:bg-white/5 rounded-2xl transition-all group border border-white/5"
          >
            <Settings size={22} className="text-gray-400 group-hover:text-white group-hover:rotate-90 transition-all duration-500" />
          </button>
        </div>
      </header>

      {isBoardOpen && <MOMVoteBoard onClose={() => setIsBoardOpen(false)} />}

      <div className="space-y-6">
        {matches.map((match) => {
          if (match.status === "scheduled") return <ScheduledCard key={match.id} match={match} />;
          if (match.status === "ongoing") return <OngoingCard key={match.id} match={match} />;
          return <CompletedCard key={match.id} match={match} />;
        })}
      </div>

      {/* 정책 요약 카드 */}
      <div className="mt-14 p-10 bg-linear-to-br from-[#1a1a1a] to-[#121212] rounded-[48px] border border-white/5 shadow-3xl">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-2xl shadow-primary/20">
            <Info size={32} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">MOM 투표 운영 정책</h3>
            <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mt-1 underline decoration-primary/30">Standard Operation Procedure</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/5">
          <div className="space-y-8">
            <div className="flex flex-col gap-3">
              <p className="text-xs text-primary font-black uppercase tracking-widest flex items-center gap-2">
                <Check size={14} /> 01. Automation
              </p>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                경기 종료 <span className="text-white font-bold underline decoration-white/20">1시간 후</span> 투표 카톡이 자동 발송되며, 별도의 설정 없이도 <span className="text-white font-bold underline decoration-white/20">24시간 동안</span> 투표가 공정하게 유지됩니다.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs text-primary font-black uppercase tracking-widest flex items-center gap-2">
                <Check size={14} /> 02. Analytics
              </p>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                투표 마감 즉시 시스템이 득표수를 자동 집계하여 <span className="text-white font-bold underline decoration-white/20">TOP 3 순위</span>와 득표 현황을 그룹에 즉시 발표합니다.
              </p>
            </div>
          </div>
          <div className="md:pl-12 space-y-8 pt-8 md:pt-0">
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-500 font-black uppercase tracking-widest flex items-center gap-2">
                <Check size={14} /> 03. Customization
              </p>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                상단 <span className="text-white font-bold italic">설정 아이콘</span>을 클릭하여 우리 팀의 특성에 맞는 시작 시점과 유지 기간을 언제든지 커스텀할 수 있습니다.
              </p>
            </div>
            <div className="bg-white/5 rounded-3xl p-6 border border-white/5 border-dashed">
              <p className="text-xs text-gray-600 font-bold italic leading-relaxed">
                * 모든 알림과 카톡 발송은 '오버롤 표준 가이드'에 따라 최적의 도달률을 보장하도록 설계되었습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {isSettingsOpen && (
        <GlobalSettingsModal
          hasOngoingVote={hasOngoingVote}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveSettings}
        />
      )}
    </div>
  );
}
