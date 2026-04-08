"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Search, Loader2, Info } from "lucide-react";
import ProfileAvatar from "@/components/ui/ProfileAvatar";

type JoinRequestStatus = "pending" | "approved" | "rejected";
type FilterType = "all" | JoinRequestStatus | "transfer";

interface JoinRequest {
    id: string;
    name: string;
    email: string;
    phone: string;
    requestedAt: string;
    status: JoinRequestStatus;
}

const mockRequests: JoinRequest[] = [
    { id: "1", name: "아자르", email: "abcdefg@gmail.com", phone: "010-7777-7777", requestedAt: "2026. 2. 25.", status: "pending" },
    { id: "2", name: "아자르", email: "abcdefg@gmail.com", phone: "010-7777-7777", requestedAt: "2026. 2. 25.", status: "pending" },
    { id: "3", name: "아자르", email: "abcdefg@gmail.com", phone: "010-7777-7777", requestedAt: "2026. 2. 25.", status: "approved" },
    { id: "4", name: "아자르", email: "abcdefg@gmail.com", phone: "010-7777-7777", requestedAt: "2026. 2. 25.", status: "approved" },
    { id: "5", name: "아자르", email: "abcdefg@gmail.com", phone: "010-7777-7777", requestedAt: "2026. 2. 25.", status: "rejected" },
    { id: "6", name: "아자르", email: "abcdefg@gmail.com", phone: "010-7777-7777", requestedAt: "2026. 2. 25.", status: "approved" },
    { id: "7", name: "아자르", email: "abcdefg@gmail.com", phone: "010-7777-7777", requestedAt: "2026. 2. 25.", status: "rejected" },
];

interface DeletedMember {
  id: string;
  name: string;
  profileImage: string;
  type: "SELF" | "KICK";
  reason: string;
  isBlacklist: boolean;
  deletedAt: string;
  position: string;
}

const mockDeleted: DeletedMember[] = [
  { id: "101", name: "홍길동", profileImage: "", type: "KICK", reason: "이사로 인한 활동 불가", isBlacklist: false, deletedAt: "2026-03-20", position: "ST" },
  { id: "102", name: "김철수", profileImage: "", type: "SELF", reason: "개인적인 사유 (타 팀 이적)", isBlacklist: true, deletedAt: "2026-03-15", position: "GK" }
];

function PlayerHistoryModal({ player, onClose }: { player: DeletedMember; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-[#1a1a1a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-linear-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-4">
            <ProfileAvatar src={player.profileImage} size={48} alt={player.name} />
            <div>
              <h2 className="text-xl font-bold text-white">{player.name}</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest">{player.position} | 방출 상세 기록</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors text-2xl">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
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
        <div className="px-6 py-4 border-t border-white/5 bg-[#141414]">
          <button onClick={onClose} className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm font-bold hover:bg-white/10 transition-colors">닫기</button>
        </div>
      </div>
    </div>
  );
}

export default function InvitationPanel() {
    const [filter, setFilter] = useState<FilterType>("pending");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPlayer, setSelectedPlayer] = useState<DeletedMember | null>(null);

    const [requests, setRequests] = useState<JoinRequest[]>(mockRequests);
    const [modal, setModal] = useState<{ type: "approve" | "reject"; request: JoinRequest | null }>({
        type: "approve",
        request: null,
    });

    const filteredRequests = requests.filter(req => filter === "all" || req.status === filter);
    const pendingCount = requests.filter(req => req.status === "pending").length;

    const handleAction = (id: string, status: JoinRequestStatus) => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
        setModal({ type: "approve", request: null });
    };

    return (
        <>
        <div className="px-4 md:px-6 pt-6 pb-4">
            <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">선수 입단 관리</h1>
                {pendingCount > 0 && (
                    <span className="w-5 h-5 bg-[#fb2c36] rounded-full flex items-center justify-center text-[11px] text-white font-bold">
                        {pendingCount}
                    </span>
                )}
            </div>
        </div>
        <div className="px-4 md:px-6 pb-8 flex flex-col h-full overflow-hidden">

            {/* 필터 탭 */}
            <div className="flex gap-[8px] mb-6">
                <button 
                    onClick={() => setFilter("all")}
                    className={cn(
                        "px-[12px] h-[41px] rounded-[10px] text-[14px] font-semibold flex items-center justify-center",
                        filter === "all" ? "bg-[rgba(184,255,18,0.1)] text-[#b8ff12]" : "bg-[#131312] text-[#d6d6d5]"
                    )}
                >
                    전체
                </button>
                <button 
                    onClick={() => setFilter("pending")}
                    className={cn(
                        "px-[12px] h-[41px] rounded-[10px] text-[14px] font-semibold flex items-center justify-center",
                        filter === "pending" ? "bg-[rgba(184,255,18,0.1)] text-[#b8ff12]" : "bg-[#131312] text-[#d6d6d5]"
                    )}
                >
                    대기중
                </button>
                <button 
                    onClick={() => setFilter("approved")}
                    className={cn(
                        "px-[12px] h-[41px] rounded-[10px] text-[14px] font-semibold flex items-center justify-center",
                        filter === "approved" ? "bg-[rgba(184,255,18,0.1)] text-[#b8ff12]" : "bg-[#131312] text-[#d6d6d5]"
                    )}
                >
                    승인 완료
                </button>
                <button 
                    onClick={() => setFilter("rejected")}
                    className={cn(
                        "px-[12px] h-[41px] rounded-[10px] text-[14px] font-semibold flex items-center justify-center",
                        filter === "rejected" ? "bg-[rgba(184,255,18,0.1)] text-[#b8ff12]" : "bg-[#131312] text-[#d6d6d5]"
                    )}
                >
                    거절
                </button>
                <button 
                    onClick={() => setFilter("transfer")}
                    className={cn(
                        "px-[12px] h-[41px] rounded-[10px] text-[14px] font-semibold flex items-center justify-center",
                        filter === "transfer" ? "bg-[rgba(184,255,18,0.1)] text-[#b8ff12]" : "bg-[#131312] text-[#d6d6d5]"
                    )}
                >
                    이적
                </button>
            </div>

            {/* 메인 렌더링 영역 (이적 탭 vs 신청 리스트) */}
            {filter === "transfer" ? (
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="relative w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="방출된 멤버 이름 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/3 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none focus:border-primary/50 transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                            {mockDeleted.filter(p => p.name.includes(searchTerm)).map((player) => (
                                <div key={player.id} className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group relative overflow-hidden">
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
                                    </div>
                                </div>
                            ))}
                            {mockDeleted.filter(p => p.name.includes(searchTerm)).length === 0 && (
                                <div className="col-span-full py-20 flex flex-col items-center justify-center gap-3 text-gray-600">
                                    <Loader2 size={24} className="animate-spin text-gray-600" />
                                    <p className="text-sm font-medium">검색 결과가 없거나 명단이 비어있습니다.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {filteredRequests.map((req) => (
                    <div key={req.id} className={cn("bg-[#1a1a1a] border border-[#3e3e3e] rounded-[12px] p-4 md:px-[24px] md:py-[13px] min-h-[80px] flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0", req.status === "rejected" && "opacity-80")}>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-[16px] w-full">
                            <div className="flex items-center justify-between w-full md:w-auto">
                                <span className="text-[13px] text-[#a6a5a5] whitespace-nowrap">{req.requestedAt}</span>
                                {req.status === "pending" && (
                                   <div className="md:hidden">
                                     <span className="text-[11px] text-[#b8ff12] font-bold">확인 대기</span>
                                   </div>
                                )}
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-[12px] text-[14px]">
                                <span className="text-white font-bold">{req.name}</span>
                                <span className="text-[#a6a5a5] font-medium text-xs md:text-[14px] md:text-[#d6d6d5] hidden md:inline">{req.email}</span>
                                <span className="text-[#a6a5a5] font-medium text-xs md:text-[14px] md:text-[#d6d6d5]">{req.phone}</span>
                            </div>
                        </div>

                        <div className="flex shrink-0 w-full md:w-auto justify-end md:ml-4 border-t border-white/5 pt-3 md:border-0 md:pt-0 mt-2 md:mt-0">
                            {req.status === "pending" ? (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setModal({ type: "approve", request: req })}
                                        className="w-[77px] h-[41px] flex items-center justify-center bg-[#b8ff12] rounded-[10px] text-black text-[14px] font-semibold hover:opacity-90 transition-opacity"
                                    >
                                        수락
                                    </button>
                                    <button 
                                        onClick={() => setModal({ type: "reject", request: req })}
                                        className="w-[77px] h-[41px] flex items-center justify-center bg-[#252525] rounded-[10px] text-[#a6a5a5] text-[14px] font-semibold hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        거절
                                    </button>
                                </div>
                            ) : req.status === "approved" ? (
                                <div className="px-3 h-[30px] flex items-center justify-center bg-[rgba(184,255,18,0.2)] rounded-[10px] text-[#b8ff12] text-[12px] font-medium">
                                    승인완료
                                </div>
                            ) : (
                                <div className="px-3 h-[30px] flex items-center justify-center bg-[rgba(245,67,70,0.2)] rounded-[10px] text-[#f54346] text-[12px] font-medium">
                                    거절됨
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {filteredRequests.length === 0 && (
                    <div className="h-40 flex items-center justify-center text-gray-500 text-sm italic">
                        신청 내역이 없습니다.
                    </div>
                )}
            </div>
            )}

            {/* 이적 모달 */}
            {selectedPlayer && <PlayerHistoryModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />}

            {/* 처리 모달 */}
            {modal.request && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 w-full max-w-sm mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-8">
                            <h4 className="text-xl font-bold text-white mb-4">
                                {modal.type === "approve" ? "팀 가입 수락" : "팀 가입 거절"}
                            </h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                <span className="text-white font-bold">{modal.request.name}</span>님의<br />
                                팀 가입을 {modal.type === "approve" ? "수락하시겠습니까?" : "거절하시겠습니까?"}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setModal({ type: "approve", request: null })}
                                className="flex-1 py-3 bg-white/5 border border-white/5 rounded-xl text-gray-400 text-sm font-bold hover:bg-white/10 transition-colors"
                            >
                                취소
                            </button>
                            {modal.type === "approve" ? (
                                <button 
                                    onClick={() => handleAction(modal.request!.id, "approved")}
                                    className="flex-1 py-3 bg-primary rounded-xl text-black text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
                                >
                                    수락하기
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleAction(modal.request!.id, "rejected")}
                                    className="flex-1 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-500 text-sm font-bold hover:bg-red-500/30 transition-colors"
                                >
                                    거절하기
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>
    );
}
