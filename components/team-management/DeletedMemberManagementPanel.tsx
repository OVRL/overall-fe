"use client";

import React, { Suspense, useState } from "react";
import { Loader2, Search, Info } from "lucide-react";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { parseUserId } from "@/hooks/useUserId";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface DeletedMember {
  id: string;
  name: string;
  profileImage: string;
  fallbackImage?: string;
  type: "SELF" | "KICK"; // 본인이적 vs 팀방출
  reason: string;
  isBlacklist: boolean;
  deletedAt: string;
  position: string;
}

// ──────────────────────────────────────────────
// 상세 기록 모달 (돋보기 클릭 시)
// ──────────────────────────────────────────────
function PlayerHistoryModal({ 
  player, 
  onClose 
}: { 
  player: DeletedMember; 
  onClose: () => void 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-linear-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-4">
            <ProfileAvatar src={player.profileImage} size={48} alt={player.name} />
            <div>
              <h2 className="text-xl font-bold text-white">{player.name}</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest">{player.position} | 팀 기록 통계</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors text-2xl">&times;</button>
        </div>

        {/* 컨텐츠 (스크롤 가능) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
          {/* 시즌별 기록 (Mock) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              시즌별 통합 기록
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { season: "2026 시즌", apps: 12, goals: 8, assists: 4, mom: 2 },
                { season: "2025 시즌", apps: 24, goals: 15, assists: 10, mom: 5 },
              ].map((s, i) => (
                <div key={i} className="bg-white/3 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{s.season}</span>
                  <div className="flex gap-4 md:gap-8 text-center text-xs">
                    <div><p className="text-gray-500 mb-1">출전</p><p className="text-white font-mono">{s.apps}</p></div>
                    <div><p className="text-gray-500 mb-1">득점</p><p className="text-primary font-mono font-bold">{s.goals}</p></div>
                    <div><p className="text-gray-500 mb-1">도움</p><p className="text-white font-mono">{s.assists}</p></div>
                    <div><p className="text-gray-500 mb-1">MOM</p><p className="text-yellow-500 font-mono italic">{s.mom}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 방출 정보 */}
          <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-bold text-red-400/80 flex items-center gap-2 uppercase tracking-tight">
              <Info size={14} /> 방출 이력 정보
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div><p className="text-gray-500 mb-1">방출 유형</p><p className="text-white">{player.type === "SELF" ? "본인 이적" : "팀에서 방출"}</p></div>
              <div><p className="text-gray-500 mb-1">방출 일자</p><p className="text-white">{player.deletedAt}</p></div>
              <div className="col-span-2"><p className="text-gray-500 mb-1">사유</p><p className="text-white leading-relaxed">{player.reason}</p></div>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 border-t border-white/5 bg-[#141414]">
          <button onClick={onClose} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm font-bold hover:bg-white/10 transition-colors">닫기</button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Panel
// ──────────────────────────────────────────────
export default function DeletedMemberManagementPanel() {
  const { selectedTeamIdNum } = useSelectedTeamId();

  if (!selectedTeamIdNum) return <div className="p-6 text-white text-sm">팀을 선택해주세요.</div>;

  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>}>
      <DeletedMemberManagementPanelInner teamId={selectedTeamIdNum} />
    </Suspense>
  );
}

function DeletedMemberManagementPanelInner({ teamId }: { teamId: number }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<DeletedMember | null>(null);

  // Mock 데이터 (추후 API 연동)
  const mockDeleted: DeletedMember[] = [
    {
      id: "101",
      name: "홍길동",
      profileImage: "",
      type: "KICK",
      reason: "이사로 인한 활동 불가",
      isBlacklist: false,
      deletedAt: "2026-03-20",
      position: "ST"
    },
    {
      id: "102",
      name: "김철수",
      profileImage: "",
      type: "SELF",
      reason: "개인적인 사유 (타 팀 이적)",
      isBlacklist: true,
      deletedAt: "2026-03-15",
      position: "GK"
    }
  ];

  const filtered = mockDeleted.filter(p => p.name.includes(searchTerm));

  return (
    <div className="flex flex-col h-full bg-surface-primary">
      {/* 헤더 */}
      <div className="px-4 md:px-6 pt-6 pb-5 border-b border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">방출 명단 관리</h1>
            <p className="text-xs text-gray-500 mt-1">팀을 떠난 멤버들의 사유와 기록을 관리합니다.</p>
          </div>
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="멤버 이름 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/3 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* 목록 영역 */}
      <div className="flex-1 overflow-auto p-4 md:p-6 scrollbar-thin">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((player) => (
            <div key={player.id} className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group relative overflow-hidden">
               {/* 블랙리스트 뱃지 */}
               {player.isBlacklist && (
                 <div className="absolute top-0 right-0 bg-red-600 text-[9px] font-bold text-white px-3 py-1 rounded-bl-xl uppercase tracking-tighter">Blacklist</div>
               )}
              
              <div className="flex items-center gap-4 mb-4">
                <ProfileAvatar src={player.profileImage} size={48} alt={player.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white truncate">{player.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5 uppercase">{player.position}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{player.deletedAt} 방출</p>
                </div>
                <button 
                  onClick={() => setSelectedPlayer(player)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all"
                  title="기록 보기"
                >
                  <Search size={16} />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-500 font-medium">방출 사유</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded font-bold",
                    player.type === "SELF" ? "bg-blue-500/10 text-blue-400" : "bg-red-500/10 text-red-400"
                  )}>
                    {player.type === "SELF" ? "본인 이적" : "팀에서 방출"}
                  </span>
                </div>
                <div className="bg-black/20 rounded-lg p-3">
                  <p className="text-[11px] text-gray-400 leading-relaxed italic truncate">
                    &quot;{player.reason}&quot;
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {filtered.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center gap-3 text-gray-600">
               <div className="w-16 h-16 rounded-full bg-white/3 flex items-center justify-center">
                 <Loader2 size={24} />
               </div>
               <p className="text-sm font-medium">검색 결과가 없거나 명단이 비어있습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 상세 기록 모달 */}
      {selectedPlayer && (
        <PlayerHistoryModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      )}
    </div>
  );
}
