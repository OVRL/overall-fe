"use client";

import { useState } from "react";
import { Settings, Check, Clock, Bell, Info, ShieldCheck, Zap, Plus, Minus, Hourglass, Layout, Trophy, Star, Medal, X, ChevronDown, ChevronUp } from "lucide-react";
import MOMVoteBoard from "./MOMVoteBoard";
import { INITIAL_PLAYERS } from "@/data/players";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

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
  liveVotes?: { name: string; position: string; votes: number; maxVotes: number; backNumber?: number }[];
}

const MOCK_MATCHES: MatchCard[] = [
  {
    id: "1",
    date: "2026. 2. 25.",
    opponent: "레알 마드리드",
    score: "0 - 0",
    status: "scheduled",
    scheduledAt: "2026. 3. 17. 19:00",
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
      { name: "정수현", position: "MF", votes: 12, maxVotes: 25, backNumber: 7 },
      { name: "호날두", position: "FW", votes: 8, maxVotes: 25, backNumber: 10 },
      { name: "손흥민", position: "FW", votes: 5, maxVotes: 25, backNumber: 7 },
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
      { name: "김정수", position: "FW", votes: 24, maxVotes: 24, backNumber: 20 },
      { name: "호날두", position: "MF", votes: 14, maxVotes: 24, backNumber: 10 },
      { name: "제라드", position: "DF", votes: 7, maxVotes: 24, backNumber: 8 },
    ]
  },
];

const StatusBadge = ({ status }: { status: VoteStatus }) => {
  if (status === "scheduled")
    return (
      <span className="inline-flex items-center justify-center px-[12px] h-[30px] rounded-[10px] bg-[rgba(255,185,45,0.2)] text-[12px] font-medium text-[#ffb92d]">
        투표 예정
      </span>
    );
  if (status === "ongoing")
    return (
      <span className="inline-flex items-center justify-center px-[12px] h-[30px] rounded-[10px] bg-[rgba(184,255,18,0.2)] text-[12px] font-medium text-[#b8ff12]">
        투표 진행중
      </span>
    );
  if (status === "completed")
    return (
      <span className="inline-flex items-center justify-center px-[12px] h-[30px] rounded-[10px] bg-[rgba(85,85,85,0.7)] text-[12px] font-medium text-[#898989]">
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
  const [autoStart, setAutoStart] = useState(true);
  const [startTimeOffset, setStartTimeOffset] = useState(2);
  const [duration, setDuration] = useState(24);
  const [reminders, setReminders] = useState({
    start: true,
    hourBefore: true,
    halfHourBefore: true,
    kakao: true
  });

  const handleSave = () => {
    if (hasOngoingVote) {
      alert("현재 투표가 진행 중인 경기가 있습니다.\n변경된 설정은 다음 경기부터 적용됩니다.");
    }
    onSave({ autoStart, startTimeOffset, duration, reminders });
    onClose();
  };

  const toggleReminder = (key: keyof typeof reminders) => {
    setReminders(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[403px] max-h-[85vh] bg-[#1a1a1a] rounded-[12px] p-[17px] flex flex-col border border-[#3e3e3e]">
        
        {/* Title Area */}
        <div className="h-[29px] w-full flex shrink-0 items-center justify-center relative mb-6 mt-1">
          <p className="text-[18px] font-semibold text-[#f7f8f8]">MOM 투표 설정</p>
          <button 
            onClick={onClose} 
            className="absolute right-[-8px] top-[-8px] w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-[8px] pb-2">
          {/* MOM 투표 자동 시작 & 세부 설정 */}
          <div className="w-full flex flex-col">
            <div className={cn("flex items-center justify-between h-[80px] bg-[#252525] px-[16px]", !autoStart ? "rounded-t-[8px]" : "rounded-[8px]")}>
              <div className="flex flex-col gap-[4px]">
                <p className="text-[14px] font-semibold text-white">MOM 투표 자동 시작</p>
                <p className="text-[12px] text-[#c0c0c0]">경기종료 후 자동으로 투표가 시작</p>
              </div>
              <div 
                onClick={() => setAutoStart(!autoStart)}
                className={cn("w-[37px] h-[20px] rounded-full p-[2px] transition-all cursor-pointer", autoStart ? "bg-[#b8ff12]" : "bg-[#555555]")}
              >
                <div className={cn("w-[16px] h-[16px] rounded-full transition-transform", autoStart ? "translate-x-[17px] bg-[#131312]" : "translate-x-0 bg-[#A6A5A5]")} />
              </div>
            </div>

            {!autoStart && (
              <div className="bg-[#1a1a1a] border-b border-l border-r border-[#252525] rounded-b-[12px] p-[24px] flex flex-col gap-[24px]">
                {/* 투표 시작 시점 */}
                <div className="flex flex-col gap-[16px]">
                  <p className="text-[12px] font-bold text-white">투표 시작 시점</p>
                  <div className="flex gap-[8px]">
                    {[2, 4, 6, 12].map(hours => (
                      <button
                        key={`start-${hours}`}
                        onClick={() => setStartTimeOffset(hours)}
                        className={cn(
                          "flex shrink-0 items-center justify-center px-0 py-[12px] rounded-[10px] transition-all flex-1 whitespace-nowrap",
                          startTimeOffset === hours
                            ? "bg-[#b8ff12] text-black font-medium text-[12px]"
                            : "border border-[#3e3e3e] text-[#a6a5a5] font-medium text-[12px]"
                        )}
                      >
                        {hours}시간 후
                      </button>
                    ))}
                  </div>
                </div>

                {/* 투표 유지 기간 */}
                <div className="flex flex-col gap-[16px]">
                  <p className="text-[12px] font-bold text-white">투표 유지 기간</p>
                  <div className="flex gap-[8px]">
                    {[12, 24, 36, 48].map(hours => (
                      <button
                        key={`duration-${hours}`}
                        onClick={() => setDuration(hours)}
                        className={cn(
                          "flex shrink-0 items-center justify-center px-0 py-[12px] rounded-[10px] transition-all flex-1 whitespace-nowrap",
                          duration === hours
                            ? "bg-[#b8ff12] text-black font-medium text-[12px]"
                            : "border border-[#3e3e3e] text-[#a6a5a5] font-medium text-[12px]"
                        )}
                      >
                        {hours} 시간
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 리마인드 설정 리스트 */}
          {[
            { key: "start", label: "투표 시작 알림", desc: "경기 시작 시점 즉시 카톡 발송" },
            { key: "hourBefore", label: "투표 종료 1시간 전", desc: "미참여 인원 대상 독려 알림" },
            { key: "halfHourBefore", label: "투표 종료 30분 전", desc: "최종 마감 안내 알림" },
            { key: "kakao", label: "카카오톡 발송", desc: "그룹원에게 투표 알림 발송" }
          ].map((item) => (
            <div key={item.key} className="flex shrink-0 items-center justify-between w-full h-[80px] bg-[#252525] px-[16px] rounded-[8px]">
              <div className="flex flex-col gap-[4px]">
                <p className="text-[14px] font-semibold text-white">{item.label}</p>
                <p className="text-[12px] text-[#c0c0c0] leading-[18px]">{item.desc}</p>
              </div>
              <div 
                onClick={() => toggleReminder(item.key as keyof typeof reminders)}
                className={cn("relative shrink-0 w-[37px] h-[20px] rounded-full p-[2px] transition-all cursor-pointer", reminders[item.key as keyof typeof reminders] ? "bg-[#b8ff12]" : "bg-[#555555]")}
              >
                <div className={cn("w-[16px] h-[16px] rounded-full transition-transform", reminders[item.key as keyof typeof reminders] ? "translate-x-[17px] bg-[#131312]" : "translate-x-0 bg-[#A6A5A5]")} />
              </div>
            </div>
          ))}
        </div>

        {/* 하단 액션 버튼 (고정) */}
        <div className="flex shrink-0 gap-[12px] w-full pt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-[#252525] h-[56px] flex items-center justify-center rounded-[4px] text-[18px] font-bold text-[#a6a5a5]"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[#b8ff12] h-[56px] flex items-center justify-center rounded-[4px] text-[18px] font-bold text-black"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}


// ──────────────────────────────────────────────
// 운영정책 정보 모달
// ──────────────────────────────────────────────
function InfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-[#121212] rounded-[32px] border border-[#3e3e3e] p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-white">MOM 투표 운영 정책</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-[#b8ff12] text-[14px] font-bold">1. 자동 진행 시스템</h3>
            <p className="text-[14px] text-gray-400 leading-relaxed">
              경기 종료 1시간 후 투표 카톡이 자동 발송되며, 별도의 설정 없이도 24시간 동안 투표가 유지됩니다.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-[#b8ff12] text-[14px] font-bold">2. 결과 집계</h3>
            <p className="text-[14px] text-gray-400 leading-relaxed">
              투표 마감 즉시 시스템이 득표수를 자동 집계하여 TOP 3 순위와 득표 현황을 공지합니디.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-[#b8ff12] text-[14px] font-bold">3. 기간 및 시간 수정</h3>
            <p className="text-[14px] text-gray-400 leading-relaxed">
              상단 설정 버튼을 통해 우리 팀의 특성에 맞는 시작 시점과 유지 기간을 언제든지 수정할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// 카드 공통 헤더
// ──────────────────────────────────────────────
function CardHeader({ match, rightContent }: { match: MatchCard, rightContent?: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full relative gap-4 md:gap-0">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full">
        <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2 md:gap-4">
               <span className="text-[13px] text-[#a6a5a5] whitespace-nowrap">{match.date}</span>
               <span className="text-[16px] font-bold text-white truncate max-w-[120px] md:max-w-none">vs {match.opponent}</span>
            </div>
            {/* 모바일/태블릿에서 노출하는 상태 배지 (PC(lg)에선 우측 스코어 옆에 노출) */}
            <div className="flex items-center lg:hidden shrink-0">
                <StatusBadge status={match.status} />
            </div>
        </div>
        <div className="items-center gap-3 hidden lg:flex">
          <StatusBadge status={match.status} />
        </div>
      </div>
      {rightContent}
    </div>
  );
}

// ──────────────────────────────────────────────
// 경기 카드들
// ──────────────────────────────────────────────
function ScheduledCard({ match }: { match: MatchCard }) {
  return (
    <div className="bg-[#1a1a1a] rounded-[12px] border border-[#3e3e3e] p-6 min-h-[102px] flex items-center">
       <CardHeader match={match} />
    </div>
  );
}

function OngoingCard({ match }: { match: MatchCard }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col rounded-[12px] bg-[#1a1a1a] border border-[#3e3e3e] overflow-hidden">
      <div 
        onClick={() => setExpanded(!expanded)} 
        className="p-6 min-h-[102px] flex flex-col md:flex-row justify-between items-center cursor-pointer transition-colors hover:bg-white/[0.03]"
      >
        <CardHeader 
          match={match} 
          rightContent={
            <div className="flex items-center justify-between w-full md:w-auto mt-2 md:mt-0 gap-6">
              <div className="flex items-center gap-6 justify-end w-full md:w-auto">
                  <div className="flex flex-col items-end">
                    <span className="text-[14px] font-semibold text-white">{match.totalVotes}표</span>
                    <span className="text-[11px] text-[#a6a5a5] font-regular">{match.deadline}</span>
                  </div>
                  <div className="w-[24px] h-[24px] text-gray-400">
                    {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
              </div>
            </div>
          }
        />
      </div>

      {expanded && (
        <div className="px-6 py-6 border-t border-[#3e3e3e] bg-[#131312]">
          <p className="text-[14px] font-bold text-white mb-4">현재 투표 현황</p>
          <div className="space-y-4">
            {match.liveVotes?.map((lv, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] text-white font-medium">{lv.backNumber}. {lv.name}</span>
                    <span className="text-[11px] text-[#a6a5a5] bg-[#252525] px-1.5 py-0.5 rounded-sm">{lv.position}</span>
                  </div>
                  <span className="text-[14px] font-bold text-white">{lv.votes}표</span>
                </div>
                <div className="h-[6px] bg-[#252525] rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full",
                      i === 0 ? "bg-[#b8ff12]" : 
                      i === 1 ? "bg-[#898989]" : "bg-white/50"
                    )}
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
    <div className="flex flex-col rounded-[12px] bg-[#131312] border border-[#3e3e3e] overflow-hidden">
      <div 
        onClick={() => setExpanded(!expanded)} 
        className="p-6 min-h-[102px] flex flex-col md:flex-row justify-between items-center cursor-pointer transition-colors hover:bg-white/[0.03]"
      >
        <CardHeader 
          match={match} 
          rightContent={
            <div className="flex items-center justify-between lg:justify-end gap-2 md:gap-4 w-full md:w-auto mt-2 md:mt-0 overflow-x-auto lg:overflow-x-visible scrollbar-hide">
              <div className="flex items-center gap-[6px] md:gap-[10px] py-1">
                {match.top3?.map((p, i) => (
                  <div key={i} className="flex items-center shrink-0 gap-[6px] md:gap-[8px] px-2 md:px-[12px] py-1 md:py-[8px] rounded-[8px] border border-[#252525] bg-[#1a1a1a]">
                      <Trophy size={14} className="text-white md:w-4 md:h-4 shrink-0" />
                      <div className="flex flex-col gap-0.5 md:gap-[2px] items-start leading-none">
                        <div className="flex items-start gap-[4px] font-semibold text-[11px] md:text-[14px] text-white whitespace-nowrap">
                          <span>{p.backNumber}.</span>
                          <span>{p.name}</span>
                        </div>
                        <span className="text-[9px] md:text-[11px] text-[#a6a5a5] whitespace-nowrap">{p.votes}표</span>
                      </div>
                  </div>
                ))}
              </div>
              <div className="w-[24px] h-[24px] ml-1 md:ml-2 text-gray-400 shrink-0">
                {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
            </div>
          }
        />
      </div>

      {expanded && (
        <div className="px-6 py-6 border-t border-[#3e3e3e] bg-[#1a1a1a]">
          {/* 모바일 뷰 전용 최종 스코어 */}
          {/* 모바일 뷰 전용 최종 결과 (스코어 제외) */}
          <div className="md:hidden flex items-center justify-between mb-4 border-b border-[#3e3e3e] pb-4">
             <span className="text-[13px] text-gray-400">경기 결과</span>
             <span className="text-[16px] font-bold text-white whitespace-nowrap">투표 마감</span>
          </div>
          <p className="text-[14px] font-bold text-white mb-4">전체 투표 결과</p>
          <div className="grid gap-4">
            {match.liveVotes?.sort((a,b)=>b.votes-a.votes).map((lv, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={cn("font-semibold text-[14px]", i < 3 ? "text-[#b8ff12]" : "text-white")}>{lv.backNumber}. {lv.name}</span>
                    <span className="text-[11px] text-[#a6a5a5] bg-[#252525] px-1.5 py-0.5 rounded-sm">{lv.position}</span>
                  </div>
                  <span className="text-[14px] font-bold text-white">{lv.votes}표</span>
                </div>
                <div className="h-[6px] bg-[#252525] rounded-full overflow-hidden">
                    <div 
                        className={cn("h-full rounded-full",
                          i === 0 ? "bg-[#b8ff12]" : 
                          i === 1 ? "bg-[#898989]" : "bg-white/50"
                        )}
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
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const hasOngoingVote = matches.some(m => m.status === "ongoing");

  const handleSaveSettings = (data: any) => {
    console.log("Saving global settings:", data);
  };

  return (
    <>
    <div className="px-4 md:px-6 pt-6 pb-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-[24px] font-bold text-white">MOM 투표 설정</h1>
          <button onClick={() => setIsInfoOpen(true)} className="ml-1 text-gray-400 hover:text-white transition-colors">
            <Info size={24} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-[8px] transition-all"
          >
            <Settings size={22} className="text-white" />
          </button>
        </div>
      </header>
    </div>

    <div className="px-4 md:px-6 pb-24 w-full flex flex-col gap-4">
      {matches.map((match) => {
        if (match.status === "scheduled") return <ScheduledCard key={match.id} match={match} />;
        if (match.status === "ongoing") return <OngoingCard key={match.id} match={match} />;
        return <CompletedCard key={match.id} match={match} />;
      })}

      {isSettingsOpen && (
        <GlobalSettingsModal
          hasOngoingVote={hasOngoingVote}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveSettings}
        />
      )}

      {isInfoOpen && <InfoModal onClose={() => setIsInfoOpen(false)} />}
    </div>
    </>
  );
}
