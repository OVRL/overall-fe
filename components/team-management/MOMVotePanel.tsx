"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import DateTimePicker from "@/components/ui/DateTimePicker";

type VoteStatus = "active" | "closed" | "confirmed";

interface MOMVote {
    id: string;
    matchTitle: string;
    matchDate: string;
    status: VoteStatus;
    totalVotes: number;
    endDateTime: string;
    notifyMinutes: number;
    candidates: VoteCandidate[];
}

interface VoteCandidate {
    playerId: string;
    playerName: string;
    playerImage: string;
    votes: number;
}

// Mock 경기 데이터
const mockMatches = [
    { id: "m1", title: "바르셀로나 FC vs 첼시", date: "2026-02-01", score: "2:1 Win" },
    { id: "m2", title: "바르셀로나 FC vs 레알 마드리드", date: "2026-01-28", score: "1:1 Draw" },
    { id: "m3", title: "바르셀로나 FC vs 맨유", date: "2026-01-25", score: "3:0 Win" },
];

const mockVotes: MOMVote[] = [
    {
        id: "1",
        matchTitle: "바르셀로나 FC vs 리버풀",
        matchDate: "2026-01-25",
        status: "confirmed",
        totalVotes: 15,
        endDateTime: "2026-01-26T20:00",
        notifyMinutes: 30,
        candidates: [
            { playerId: "8", playerName: "알베스", playerImage: "/images/player/img_player-8.png", votes: 8 },
            { playerId: "9", playerName: "수원알베스", playerImage: "/images/player/img_player-9.png", votes: 5 },
            { playerId: "6", playerName: "렌디", playerImage: "/images/player/img_player-6.png", votes: 2 },
        ],
    },
    {
        id: "2",
        matchTitle: "바르셀로나 FC vs 맨시티",
        matchDate: "2026-01-18",
        status: "active",
        totalVotes: 8,
        endDateTime: "2026-01-19T22:00",
        notifyMinutes: 60,
        candidates: [
            { playerId: "9", playerName: "수원알베스", playerImage: "/images/player/img_player-9.png", votes: 4 },
            { playerId: "1", playerName: "박무트", playerImage: "/images/player/img_player-1.png", votes: 3 },
            { playerId: "3", playerName: "가깝밤베스", playerImage: "/images/player/img_player-3.png", votes: 1 },
        ],
    },
];

const statusLabels: Record<VoteStatus, { label: string; className: string }> = {
    active: { label: "투표중", className: "bg-green-500/20 text-green-400" },
    closed: { label: "마감", className: "bg-yellow-500/20 text-yellow-400" },
    confirmed: { label: "확정", className: "bg-primary/20 text-primary" },
};

export default function MOMVotePanel() {
    const [votes, setVotes] = useState<MOMVote[]>(mockVotes);
    const [showModal, setShowModal] = useState(false);

    // 새 투표 생성 폼 상태
    const [selectedMatch, setSelectedMatch] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("20:00");
    const [isNotifyOn, setIsNotifyOn] = useState(false); // 토글 상태

    // Custom Picker States
    const [pickerType, setPickerType] = useState<"date" | "time" | null>(null);

    const handleCloseVote = (voteId: string) => {
        setVotes(prev =>
            prev.map(v => v.id === voteId ? { ...v, status: "closed" as VoteStatus } : v)
        );
    };

    const handleConfirmVote = (voteId: string) => {
        setVotes(prev =>
            prev.map(v => v.id === voteId ? { ...v, status: "confirmed" as VoteStatus } : v)
        );
    };

    const handleCreateVote = () => {
        if (!selectedMatch || !endDate) {
            alert("경기와 마감 일시를 선택해주세요.");
            return;
        }

        const match = mockMatches.find(m => m.id === selectedMatch);
        if (!match) return;

        const newVote: MOMVote = {
            id: String(Date.now()),
            matchTitle: match.title,
            matchDate: match.date,
            status: "active",
            totalVotes: 0,
            endDateTime: `${endDate}T${endTime}`,
            notifyMinutes: isNotifyOn ? 30 : 0, // 30분 전 or 없음
            candidates: [],
        };

        setVotes(prev => [newVote, ...prev]);
        setShowModal(false);
        setSelectedMatch("");
        setEndDate("");
        setEndTime("20:00");
        setIsNotifyOn(false);
    };

    // 현재 시간 +1일로 기본값 설정
    const initModal = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setEndDate(tomorrow.toISOString().split('T')[0]);
        setShowModal(true);
    };

    // 날짜 포맷팅 함수 (YYYY년 MM월 DD일 (요일))
    const getFormattedDate = (dateStr: string) => {
        if (!dateStr) return "날짜 선택";
        const date = new Date(dateStr);
        const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
        const dayName = dayNames[date.getDay()];
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${dayName})`;
    };

    // 시간 포맷팅 함수 (오전/오후 HH시 MM분)
    const getFormattedTime = (timeStr: string) => {
        if (!timeStr) return "시간 선택";
        const [h, m] = timeStr.split(":").map(Number);
        const ampm = h < 12 ? "오전" : "오후";
        const hour = h % 12 || 12;
        return `${ampm} ${hour}시 ${String(m).padStart(2, "0")}분`;
    };

    const handleDateConfirm = (value: string) => {
        setEndDate(value);
        setPickerType(null);
    };

    const handleTimeConfirm = (value: string) => {
        setEndTime(value);
        setPickerType(null);
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">MOM 투표</h3>
                <Button variant="primary" onClick={initModal} className="text-xs px-3 py-1.5">
                    + 새 투표
                </Button>
            </div>

            {/* 투표 목록 */}
            <div className="space-y-4">
                {votes.map((vote) => (
                    <div key={vote.id} className="bg-surface-tertiary rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between p-3 border-b border-gray-800">
                            <div>
                                <h4 className="text-white font-bold text-sm">{vote.matchTitle}</h4>
                                <p className="text-xs text-gray-400">{vote.matchDate} · {vote.totalVotes}표</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusLabels[vote.status].className}`}>
                                    {statusLabels[vote.status].label}
                                </span>
                                {vote.status === "active" && (
                                    <Button variant="line" onClick={() => handleCloseVote(vote.id)} className="text-xs px-2 py-0.5">마감</Button>
                                )}
                                {vote.status === "closed" && (
                                    <Button variant="primary" onClick={() => handleConfirmVote(vote.id)} className="text-xs px-2 py-0.5">확정</Button>
                                )}
                            </div>
                        </div>

                        {/* TOP 3 */}
                        {vote.candidates.length > 0 && (
                            <div className="p-3">
                                <div className="flex gap-3">
                                    {vote.candidates
                                        .sort((a, b) => b.votes - a.votes)
                                        .slice(0, 3)
                                        .map((candidate, index) => (
                                            <div
                                                key={candidate.playerId}
                                                className={`flex-1 flex flex-col items-center p-3 rounded-lg ${index === 0 ? "bg-primary/10 border border-primary/30" : "bg-white/5"
                                                    }`}
                                            >
                                                <div className={`text-sm font-bold mb-1 ${index === 0 ? "text-primary" : "text-gray-400"}`}>
                                                    {index === 0 ? "🏆" : index === 1 ? "🥈" : "🥉"} {index + 1}위
                                                </div>
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700 mb-1">
                                                    <Image src={candidate.playerImage} alt={candidate.playerName} fill className="object-cover" />
                                                </div>
                                                <span className="text-white text-xs">{candidate.playerName}</span>
                                                <span className="text-[10px] text-gray-400">{candidate.votes}표</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 새 투표 생성 모달 (Toss 스타일 적용) */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-[#242424] rounded-2xl w-full max-w-sm mx-4 overflow-hidden shadow-2xl animate-fade-in-up">
                        {/* 헤더 */}
                        <div className="px-6 py-5 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white tracking-tight">투표 만들기</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="px-6 pb-6 space-y-8">

                            {/* 경기 선택 */}
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-3">어떤 경기를 투표할까요?</label>
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                    {mockMatches.map(match => (
                                        <div
                                            key={match.id}
                                            onClick={() => setSelectedMatch(match.id)}
                                            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${selectedMatch === match.id
                                                    ? "bg-primary/10 border-primary"
                                                    : "bg-[#333] border-transparent hover:bg-[#3d3d3d]"
                                                }`}
                                        >
                                            <div>
                                                <p className={`text-sm font-bold mb-0.5 ${selectedMatch === match.id ? "text-primary" : "text-white"}`}>{match.title}</p>
                                                <p className="text-xs text-gray-400">{match.date}</p>
                                            </div>
                                            {selectedMatch === match.id && (
                                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 마감 시간 설정 */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">⏰</span>
                                    <label className="text-sm font-bold text-gray-400">언제 마감할까요?</label>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {/* 날짜 입력 (커스텀 Picker 연결) */}
                                    <div
                                        onClick={() => setPickerType("date")}
                                        className="w-full bg-[#333] rounded-xl hover:bg-[#3d3d3d] transition-colors h-14 flex items-center justify-center border border-transparent cursor-pointer active:scale-[0.98]"
                                    >
                                        <span className="text-white font-bold text-lg">
                                            {getFormattedDate(endDate)}
                                        </span>
                                    </div>

                                    {/* 시간 입력 (커스텀 Picker 연결) */}
                                    <div
                                        onClick={() => setPickerType("time")}
                                        className="w-full bg-[#333] rounded-xl hover:bg-[#3d3d3d] transition-colors h-14 flex items-center justify-center border border-transparent cursor-pointer active:scale-[0.98]"
                                    >
                                        <span className="text-white font-bold text-lg">
                                            {getFormattedTime(endTime)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 알림 설정 (토글) */}
                            <div className="flex items-center justify-between bg-[#333] p-4 rounded-xl">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white">마감 알림</span>
                                    <span className="text-xs text-gray-400">종료 30분 전에 알려드릴게요</span>
                                </div>

                                {/* 커스텀 토글 스위치 */}
                                <button
                                    onClick={() => setIsNotifyOn(!isNotifyOn)}
                                    className={`w-12 h-7 rounded-full transition-colors duration-200 ease-in-out relative ${isNotifyOn ? "bg-primary" : "bg-gray-600"
                                        }`}
                                >
                                    <div
                                        className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${isNotifyOn ? "translate-x-5" : "translate-x-0"
                                            }`}
                                    />
                                </button>
                            </div>

                        </div>

                        {/* 하단 버튼 */}
                        <div className="p-4 border-t border-gray-700 bg-[#2C2C2C]">
                            <button
                                onClick={handleCreateVote}
                                className={`w-full py-4 rounded-xl font-bold text-base transition-all ${selectedMatch
                                        ? "bg-primary text-black hover:bg-primary-dark shadow-[0_4px_14px_rgba(202,255,0,0.3)]"
                                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                    }`}
                                disabled={!selectedMatch}
                            >
                                투표 만들기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 커스텀 날짜/시간 선택 모달 */}
            {pickerType && (
                <DateTimePicker
                    type={pickerType}
                    initialValue={pickerType === "date" ? endDate : endTime}
                    onClose={() => setPickerType(null)}
                    onConfirm={pickerType === "date" ? handleDateConfirm : handleTimeConfirm}
                />
            )}
        </div>
    );
}
