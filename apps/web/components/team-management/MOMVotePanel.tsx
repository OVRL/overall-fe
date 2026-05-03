"use client";

import { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { Settings, Info, Zap, X, ChevronDown, ChevronUp, User } from "lucide-react";
import MOMVoteBoard from "./MOMVoteBoard";
import { cn } from "@/lib/utils";
import { useLazyLoadQuery } from "react-relay";
import { FindMatchQuery } from "@/lib/relay/queries/findMatchQuery";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { FindMatchMomQuery } from "@/lib/relay/queries/findMatchMomQuery";
import type { findMatchQuery } from "@/__generated__/findMatchQuery.graphql";
import type { findMatchMomQuery } from "@/__generated__/findMatchMomQuery.graphql";
import { useQueryLoader, usePreloadedQuery } from "react-relay";
import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";

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
  deadlineTs?: number;
  scheduledAt?: string;
  top3?: VotePlayer[];
  liveVotes?: { name: string; position: string; votes: number; maxVotes: number; backNumber?: number }[];
  matchId: number;
  teamId: number;
}

// MOCK_MATCHES 제거

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

          {/* 카카오 알림톡 미리보기 */}
          <div className="flex flex-col gap-[8px]">
            <p className="text-[12px] font-bold text-[#a6a5a5] px-1">카카오톡 알림 미리보기</p>
            <div className="bg-[#F9E000]/5 border border-[#F9E000]/20 rounded-[12px] p-[16px]">
              {/* 카카오 알림톡 메시지 UI */}
              <div className="bg-white rounded-[10px] overflow-hidden shadow-sm">
                {/* 헤더 */}
                <div className="bg-[#FEE500] px-[14px] py-[10px] flex items-center gap-2">
                  <svg width="16" height="15" viewBox="0 0 18 17" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9 0C4.029 0 0 3.134 0 7c0 2.493 1.607 4.677 4.023 5.946L3.1 16.5a.3.3 0 0 0 .453.316L7.9 13.88C8.26 13.927 8.627 13.95 9 13.95c4.971 0 9-3.134 9-7S13.971 0 9 0z" fill="#381E1F"/>
                  </svg>
                  <span className="text-[11px] font-bold text-[#381E1F]">카카오톡 알림톡</span>
                  <span className="ml-auto text-[10px] text-[#381E1F]/60">Overall</span>
                </div>
                {/* 메시지 본문 */}
                <div className="px-[14px] py-[12px] flex flex-col gap-[8px]">
                  <p className="text-[12px] font-bold text-[#111]">⚽ MOM 투표가 시작되었습니다!</p>
                  <div className="w-full h-px bg-[#eee]" />
                  <div className="text-[11px] text-[#333] leading-[1.7] whitespace-pre-line">{`[Overall] FC 오버롤 MOM 투표

경기: vs 상대팀  |  2026.04.24 (목)
투표 마감: 04.25 (금) 오후 11:59

이번 경기의 MVP를 선택해주세요!
팀원 모두의 참여가 결과를 만듭니다.`}</div>
                  <div className="w-full h-px bg-[#eee]" />
                  {/* CTA 버튼 */}
                  <button className="w-full h-[36px] bg-[#FEE500] rounded-[6px] flex items-center justify-center">
                    <span className="text-[12px] font-bold text-[#381E1F]">투표하러 가기 →</span>
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-[#a6a5a5] text-center mt-2">* 실제 발송될 카카오 알림톡 미리보기입니다</p>
            </div>
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

// 진행중 카드 헤더 우측: 총 투표수 + 마감시간
function OngoingVoteSummary({ queryRef, deadline }: { queryRef: any; deadline: string }) {
  const data = usePreloadedQuery<findMatchMomQuery>(FindMatchMomQuery, queryRef);
  const results = data.findMatchMom ?? [];
  const totalVotes = results.reduce((acc, r) => acc + r.voteCount, 0);

  return (
    <div className="flex flex-col items-end">
      <span className="text-[14px] font-semibold text-white">{totalVotes}표</span>
      <span className="text-[11px] text-[#a6a5a5]">{deadline}</span>
    </div>
  );
}

function OngoingCard({ match }: { match: MatchCard }) {
  const [expanded, setExpanded] = useState(false);
  const [queryRef, loadQuery] = useQueryLoader<findMatchMomQuery>(FindMatchMomQuery);

  // 마운트 시 즉시 로드 → 접힌 상태에서도 총 투표수 표시
  useEffect(() => {
    if (!queryRef) {
      loadQuery({ matchId: match.matchId, teamId: match.teamId });
    }
  }, [queryRef, loadQuery, match.matchId, match.teamId]);

  return (
    <div className="flex flex-col rounded-[12px] bg-[#1a1a1a] border border-[#3e3e3e] overflow-hidden">
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-6 min-h-[102px] flex flex-col md:flex-row justify-between items-center cursor-pointer transition-colors hover:bg-white/3"
      >
        <CardHeader
          match={match}
          rightContent={
            <div className="flex items-center gap-6 justify-end w-full md:w-auto mt-2 md:mt-0">
              {queryRef ? (
                <Suspense
                  fallback={
                    <div className="flex flex-col items-end gap-1">
                      <div className="h-4 w-10 bg-white/5 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
                    </div>
                  }
                >
                  <OngoingVoteSummary queryRef={queryRef} deadline={match.deadline ?? ""} />
                </Suspense>
              ) : (
                <div className="flex flex-col items-end">
                  <span className="text-[11px] text-[#a6a5a5]">{match.deadline}</span>
                </div>
              )}
              <div className="w-[24px] h-[24px] text-gray-400 shrink-0">
                {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
            </div>
          }
        />
      </div>

      {expanded && (
        <div className="px-6 py-6 border-t border-[#3e3e3e] bg-[#131312]">
          <p className="text-[14px] font-bold text-white mb-4">현재 투표 현황</p>
          {!queryRef ? (
            <div className="h-20 flex items-center justify-center">
              <span className="text-gray-500 animate-pulse">불러오는 중...</span>
            </div>
          ) : (
            <Suspense fallback={<div className="h-20 flex items-center justify-center"><span className="text-gray-500 animate-pulse">불러오는 중...</span></div>}>
              <OngoingVoteResults queryRef={queryRef} />
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
}

function OngoingVoteResults({ queryRef }: { queryRef: any }) {
  const data = usePreloadedQuery<findMatchMomQuery>(FindMatchMomQuery, queryRef);
  const results = data.findMatchMom ?? [];
  const totalVotes = results.reduce((acc, r) => acc + r.voteCount, 0);
  const maxVotes = Math.max(...results.map(r => r.voteCount), 1);

  return (
    <div className="space-y-4">
      {results.map((lv, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[14px] text-white font-medium">
                {lv.candidateUser?.name || lv.candidateMercenary?.name}
              </span>
              <span className="text-[11px] text-[#a6a5a5] bg-[#252525] px-1.5 py-0.5 rounded-sm">
                {lv.candidateUser?.mainPosition || "용병"}
              </span>
            </div>
            <span className="text-[14px] font-bold text-white">{lv.voteCount}표</span>
          </div>
          <div className="h-[6px] bg-[#252525] rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full",
                i === 0 ? "bg-[#b8ff12]" :
                i === 1 ? "bg-[#898989]" : "bg-white/50"
              )}
              style={{ width: `${Math.round((lv.voteCount / (totalVotes || maxVotes)) * 100)}%` }}
            />
          </div>
        </div>
      ))}
      {results.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">아직 투표 데이터가 없습니다.</p>
      )}
    </div>
  );
}

// TOP3 요약 (접힌 상태 헤더 우측)
function CompletedTop3Summary({ queryRef }: { queryRef: any }) {
  const data = usePreloadedQuery<findMatchMomQuery>(FindMatchMomQuery, queryRef);
  const results = (data.findMatchMom ?? []).slice(0, 3);

  if (results.length === 0) return null;

  return (
    <div className="flex items-center gap-3 lg:gap-5">
      {results.map((r, i) => {
        const name = r.candidateUser?.name || r.candidateMercenary?.name || "알 수 없음";
        const num = r.candidateUser?.preferredNumber;
        return (
          <div key={i} className="flex items-center gap-1.5">
            <User size={13} className="text-[#a6a5a5] shrink-0" />
            <span className="text-[13px] text-white font-medium whitespace-nowrap">
              {num != null ? `${num}. ${name}` : name}
            </span>
            <span className="text-[12px] text-[#a6a5a5] whitespace-nowrap">{r.voteCount}표</span>
          </div>
        );
      })}
    </div>
  );
}

function CompletedCard({ match, onReveal }: { match: MatchCard, onReveal: (results: any) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [queryRef, loadQuery] = useQueryLoader<findMatchMomQuery>(FindMatchMomQuery);

  // 마운트 시 즉시 로드 → 접힌 상태에서도 TOP3 표시
  useEffect(() => {
    if (!queryRef) {
      loadQuery({ matchId: match.matchId, teamId: match.teamId });
    }
  }, [queryRef, loadQuery, match.matchId, match.teamId]);

  return (
    <div className="flex flex-col rounded-[12px] bg-[#131312] border border-[#3e3e3e] overflow-hidden">
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-6 min-h-[102px] flex flex-col md:flex-row justify-between items-center cursor-pointer transition-colors hover:bg-white/[0.03]"
      >
        <CardHeader
          match={match}
          rightContent={
            <div className="flex items-center justify-between lg:justify-end gap-3 w-full md:w-auto mt-2 md:mt-0">
              {queryRef && (
                <Suspense fallback={<div className="h-5 w-48 bg-white/5 rounded animate-pulse" />}>
                  <CompletedTop3Summary queryRef={queryRef} />
                </Suspense>
              )}
              <div className="w-[24px] h-[24px] text-gray-400 shrink-0">
                {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </div>
            </div>
          }
        />
      </div>

      {expanded && (
        <div className="px-6 py-6 border-t border-[#3e3e3e] bg-[#1a1a1a]">
          {!queryRef ? (
            <div className="h-20 flex items-center justify-center">
              <span className="text-gray-500 animate-pulse">불러오는 중...</span>
            </div>
          ) : (
            <Suspense fallback={<div className="h-20 flex items-center justify-center"><span className="text-gray-500 animate-pulse">불러오는 중...</span></div>}>
              <CompletedVoteResults queryRef={queryRef} onReveal={onReveal} />
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
}

function CompletedVoteResults({ queryRef, onReveal }: { queryRef: any, onReveal: (results: any) => void }) {
  const data = usePreloadedQuery<findMatchMomQuery>(FindMatchMomQuery, queryRef);
  const results = data.findMatchMom ?? [];
  const maxVotes = Math.max(...results.map(r => r.voteCount), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-[14px] font-bold text-white">전체 투표 결과</p>
        <button
          onClick={() => onReveal(results)}
          className="flex items-center gap-2 text-[#b8ff12] text-[13px] font-semibold"
        >
          <Zap size={16} />
          시네마틱 결과 다시보기
        </button>
      </div>
      <div className="grid gap-4">
        {results.map((lv, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={cn("font-semibold text-[14px]", i < 3 ? "text-[#b8ff12]" : "text-white")}>
                  {lv.candidateUser?.name || lv.candidateMercenary?.name}
                </span>
                <span className="text-[11px] text-[#a6a5a5] bg-[#252525] px-1.5 py-0.5 rounded-sm">
                  {lv.candidateUser?.mainPosition || "용병"}
                </span>
              </div>
              <span className="text-[14px] font-bold text-white">{lv.voteCount}표</span>
            </div>
            <div className="h-[6px] bg-[#252525] rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full",
                  i === 0 ? "bg-[#b8ff12]" :
                  i === 1 ? "bg-[#898989]" : "bg-white/50"
                )}
                style={{ width: `${Math.round((lv.voteCount / maxVotes) * 100)}%` }}
              />
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">투표 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Panel
// ──────────────────────────────────────────────
export default function MOMVotePanel() {
  const { selectedTeamIdNum } = useSelectedTeamId();
  const data = useLazyLoadQuery<findMatchQuery>(
    FindMatchQuery,
    { createdTeamId: selectedTeamIdNum ?? 0 },
    { fetchPolicy: "store-or-network" }
  );

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [boardResults, setBoardResults] = useState<any[] | null>(null);

  const matches: MatchCard[] = (data.findMatch ?? []).filter((m: any): m is NonNullable<typeof m> => m != null).map((m: any) => {
    const now = Date.now();

    // 날짜 파싱 안정성 강화: matchDate가 ISO 전체 문자열일 경우 날짜만 추출
    const dateStr = typeof m.matchDate === 'string' && m.matchDate.includes('T')
      ? m.matchDate.split('T')[0] 
      : m.matchDate;
    
    const startTimeStr = m.startTime || "00:00";
    const startTs = new Date(`${dateStr}T${startTimeStr}`).getTime();
    
    // 유효하지 않은 날짜인 경우 현재 시간으로 대체 (정렬 밀림 방지)
    const validStartTs = isNaN(startTs) ? now : startTs;
    
    const deadlineTs = m.voteDeadline 
      ? new Date(m.voteDeadline).getTime() 
      : validStartTs + 24 * 60 * 60 * 1000;
    
    const validDeadlineTs = isNaN(deadlineTs) ? validStartTs + 24 * 60 * 60 * 1000 : deadlineTs;

    let status: VoteStatus = "scheduled";
    if (now >= validDeadlineTs) {
      status = "completed";
    } else if (now >= validStartTs) {
      status = "ongoing";
    }

    let score = "-";
    try {
      if (m.description) {
        const parsed = JSON.parse(m.description);
        if (parsed.score) score = `${parsed.score.home} - ${parsed.score.away}`;
      }
    } catch {}

    const matchDateFormatted = m.matchDate ? new Date(m.matchDate).toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    }) : "-";

    return {
      id: String(m.id),
      matchId: parseNumericIdFromRelayGlobalId(m.id) ?? 0,
      teamId: selectedTeamIdNum ?? 0,
      date: matchDateFormatted,
      opponent: m.opponentTeam?.name || m.teamName || "상대팀 미정",
      score,
      status,
      totalVotes: 0,
      deadline: m.voteDeadline
        ? new Date(m.voteDeadline).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }) + "까지"
        : "자동 마감 예정",
      deadlineTs: validDeadlineTs,
      scheduledAt: matchDateFormatted + " " + (m.startTime?.slice(0, 5) || "-"),
    };
  }).sort((a, b) => b.deadlineTs! - a.deadlineTs!);

  const hasOngoingVote = matches.some(m => m.status === "ongoing");

  const handleSaveSettings = (settings: any) => {
    console.log("Saving global settings:", settings);
    toast.info("환경설정 저장 API 연동 준비 중입니다.");
  };

  return (
    <>
    <div className="px-4 md:px-6 pt-6 pb-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-white">MOM 투표 설정</h1>
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
      {matches.length === 0 ? (
         <div className="py-20 text-center text-gray-500">
            등록된 경기 데이터가 없습니다.
         </div>
      ) : matches.map((match) => {
        if (match.status === "scheduled") return <ScheduledCard key={match.id} match={match} />;
        if (match.status === "ongoing") return <OngoingCard key={match.id} match={match} />;
        return <CompletedCard key={match.id} match={match} onReveal={(res) => setBoardResults(res)} />;
      })}

      {isSettingsOpen && (
        <GlobalSettingsModal
          hasOngoingVote={hasOngoingVote}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveSettings}
        />
      )}

      {isInfoOpen && <InfoModal onClose={() => setIsInfoOpen(false)} />}
      
      {boardResults && (
        <MOMVoteBoard 
          results={boardResults}
          onClose={() => setBoardResults(null)} 
        />
      )}
    </div>
    </>
  );
}
