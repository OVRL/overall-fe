"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

type JoinRequestStatus = "pending" | "approved" | "rejected";

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

export default function InvitationPanel() {
    const [filter, setFilter] = useState<"all" | JoinRequestStatus>("pending");
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
        <div className="p-4 md:p-8 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-2 mb-8">
                <h3 className="text-[20px] font-bold text-white">가입 신청 관리</h3>
                {pendingCount > 0 && (
                    <span className="w-5 h-5 bg-[#fb2c36] rounded-full flex items-center justify-center text-[11px] text-white font-bold">
                        {pendingCount}
                    </span>
                )}
            </div>

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
            </div>

            {/* 신청 리스트 */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {filteredRequests.map((req) => (
                    <div key={req.id} className={cn("bg-[#1a1a1a] border border-[#3e3e3e] rounded-[12px] px-[24px] py-[13px] h-[80px] flex flex-wrap md:flex-nowrap items-center justify-between", req.status === "rejected" && "opacity-80")}>
                        <div className="flex items-center gap-[16px] w-full">
                            <span className="text-[13px] text-[#a6a5a5] whitespace-nowrap">{req.requestedAt}</span>
                            <div className="flex flex-wrap md:flex-nowrap items-center gap-[12px] text-[14px]">
                                <span className="text-white font-bold">{req.name}</span>
                                <span className="text-[#d6d6d5] font-medium">{req.email}</span>
                                <span className="text-[#d6d6d5] font-medium">{req.phone}</span>
                            </div>
                        </div>

                        <div className="flex shrink-0 ml-4 mt-4 md:mt-0">
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
    );
}
