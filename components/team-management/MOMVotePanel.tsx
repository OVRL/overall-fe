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
    const [sendKakao, setSendKakao] = useState(true); // 카카오 발송 여부 (Default: true)
    const [voteSearchQuery, setVoteSearchQuery] = useState(""); // 선수 검색

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

    // Feature 3: Vote List View
    const [showVoteList, setShowVoteList] = useState(false);
    const [selectedVoteId, setSelectedVoteId] = useState<string | null>(null); // For specific match view

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
                <div className="flex gap-2">
                    <Button variant="line" onClick={() => {
                        setShowVoteList(!showVoteList);
                        setSelectedVoteId(null); // Reset filter when toggling
                    }} className="text-xs px-3 py-1.5">
                        {showVoteList ? "카드 보기" : "전체 목록"}
                    </Button>
                    <Button variant="primary" onClick={initModal} className="text-xs px-3 py-1.5">
                        + 새 투표
                    </Button>
                </div>
            </div>

            {/* 투표 목록 (리스트 뷰 vs 카드 뷰) */}
            {showVoteList ? (
                <div className="space-y-4">
                    {/* 검색 필터 */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="선수 이름 검색..."
                            value={voteSearchQuery}
                            onChange={(e) => setVoteSearchQuery(e.target.value)}
                            className="w-full bg-[#252526] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary pl-10"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    </div>

                    {/* PC View: Table */}
                    <div className="hidden md:block bg-surface-tertiary rounded-lg overflow-hidden border border-gray-800">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-800 text-gray-400 font-medium">
                                <tr>
                                    <th className="px-4 py-3">날짜</th>
                                    <th className="px-4 py-3">선수</th>
                                    <th className="px-4 py-3 text-center">포지션</th>
                                    <th className="px-4 py-3 text-center">골</th>
                                    <th className="px-4 py-3 text-center">어시</th>
                                    <th className="px-4 py-3 text-center">CS</th>
                                    <th className="px-4 py-3 text-right">득표수</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {votes
                                    .filter(v => selectedVoteId ? v.id === selectedVoteId : true)
                                    .flatMap(vote =>
                                        vote.candidates
                                            .filter(c => c.playerName.includes(voteSearchQuery))
                                            .map(candidate => (
                                                <tr key={`${vote.id}-${candidate.playerId}`} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 text-gray-300">{vote.matchDate}</td>
                                                    <td className="px-4 py-3 flex items-center gap-2">
                                                        <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-700">
                                                            <Image src={candidate.playerImage} alt={candidate.playerName} fill className="object-cover" />
                                                        </div>
                                                        <span className="text-white font-bold">{candidate.playerName}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center text-gray-400">FW</td>
                                                    <td className="px-4 py-3 text-center text-white font-bold">{Math.floor(Math.random() * 3)}</td>
                                                    <td className="px-4 py-3 text-center text-gray-300">{Math.floor(Math.random() * 2)}</td>
                                                    <td className="px-4 py-3 text-center text-gray-300">{Math.random() > 0.8 ? 1 : 0}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className="inline-block px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                                                            {candidate.votes}표
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                    )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View: Cards */}
                    <div className="md:hidden space-y-3">
                        {votes
                            .filter(v => selectedVoteId ? v.id === selectedVoteId : true)
                            .flatMap(vote =>
                                vote.candidates
                                    .filter(c => c.playerName.includes(voteSearchQuery))
                                    .map(candidate => (
                                        <div key={`${vote.id}-${candidate.playerId}`} className="bg-surface-tertiary p-4 rounded-xl border border-gray-800 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                                                    <Image src={candidate.playerImage} alt={candidate.playerName} fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-bold">{candidate.playerName}</span>
                                                        <span className="text-[10px] text-gray-500">{vote.matchDate}</span>
                                                    </div>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className="text-[10px] text-gray-400">⚽ {Math.floor(Math.random() * 3)}</span>
                                                        <span className="text-[10px] text-gray-400">🅰️ {Math.floor(Math.random() * 2)}</span>
                                                        <span className="text-[10px] text-gray-400">🛡️ {Math.random() > 0.8 ? 1 : 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-primary font-bold text-sm">{candidate.votes}표</span>
                                                <span className="text-[10px] text-gray-500">MOM 후보</span>
                                            </div>
                                        </div>
                                    ))
                            )}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {votes.map((vote) => (
                        <div key={vote.id} className="bg-surface-tertiary rounded-lg overflow-hidden border border-gray-800/50">
                            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-white/5">
                                <div>
                                    <h4 className="text-white font-bold text-sm">{vote.matchTitle}</h4>
                                    <p className="text-xs text-gray-400 mt-0.5">{vote.matchDate} · 총 {vote.totalVotes}표</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${statusLabels[vote.status].className}`}>
                                        {statusLabels[vote.status].label}
                                    </span>
                                    {vote.status === "active" && (
                                        <Button variant="line" onClick={() => handleCloseVote(vote.id)} className="text-xs px-2 py-1">마감</Button>
                                    )}
                                    {vote.status === "closed" && (
                                        <Button variant="primary" onClick={() => handleConfirmVote(vote.id)} className="text-xs px-2 py-1">확정</Button>
                                    )}
                                    <Button
                                        variant="line"
                                        onClick={() => {
                                            setSelectedVoteId(vote.id);
                                            setShowVoteList(true);
                                        }}
                                        className="text-xs px-2 py-1 ml-1"
                                    >
                                        목록
                                    </Button>
                                </div>
                            </div>

                            {/* TOP 3 */}
                            {vote.candidates.length > 0 && (
                                <div className="p-4 bg-gradient-to-b from-transparent to-black/20">
                                    <div className="flex gap-3">
                                        {vote.candidates
                                            .sort((a, b) => b.votes - a.votes)
                                            .slice(0, 3)
                                            .map((candidate, index) => (
                                                <div
                                                    key={candidate.playerId}
                                                    className={`flex-1 flex flex-col items-center p-3 rounded-2xl transition-all border ${index === 0
                                                        ? "bg-primary/10 border-primary/30 shadow-[0_0_20px_rgba(202,255,0,0.1)] scale-105"
                                                        : "bg-surface-secondary border-white/5"
                                                        }`}
                                                >
                                                    <div className={`text-[11px] font-bold mb-2 flex items-center gap-1 ${index === 0 ? "text-primary" : "text-gray-400"}`}>
                                                        {index === 0 ? "👑" : index === 1 ? "🥈" : "🥉"} {index + 1}위
                                                    </div>
                                                    <div className={`relative w-12 h-12 rounded-full overflow-hidden mb-2 border-2 ${index === 0 ? "border-primary" : "border-gray-700"}`}>
                                                        <Image src={candidate.playerImage} alt={candidate.playerName} fill className="object-cover" />
                                                    </div>
                                                    <span className="text-white font-bold text-xs">{candidate.playerName}</span>
                                                    <span className={`text-[11px] mt-1 font-bold ${index === 0 ? "text-primary" : "text-gray-500"}`}>{candidate.votes}표</span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* 새 투표 생성 모달 (Toss 스타일 적용) */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#1c1c1e] rounded-3xl w-full max-w-sm mx-4 overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.5)] border border-white/10 animate-scale-up">
                        {/* 헤더 */}
                        <div className="px-6 pt-6 pb-2 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white tracking-tight">투표 만들기</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="px-6 pb-6 space-y-6">
                            {/* 경기 선택 */}
                            <div className="mt-4">
                                <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">투표할 경기</label>
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                    {mockMatches.map(match => (
                                        <div
                                            key={match.id}
                                            onClick={() => setSelectedMatch(match.id)}
                                            className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${selectedMatch === match.id
                                                ? "bg-primary/10 border-primary"
                                                : "bg-white/5 border-transparent hover:bg-white/10"
                                                }`}
                                        >
                                            <div>
                                                <p className={`text-sm font-bold mb-0.5 ${selectedMatch === match.id ? "text-primary" : "text-white"}`}>{match.title}</p>
                                                <p className="text-[10px] text-gray-500">{match.date}</p>
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
                                <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">마감 시간 설정</label>
                                <div className="flex flex-col gap-2">
                                    {/* 날짜/시간 컴팩트 뷰 */}
                                    <div className="flex gap-2">
                                        <div
                                            onClick={() => setPickerType("date")}
                                            className="flex-1 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors h-14 flex items-center px-4 border border-white/5 cursor-pointer"
                                        >
                                            <span className="text-lg mr-2">📅</span>
                                            <span className="text-white font-bold text-sm truncate">
                                                {getFormattedDate(endDate)}
                                            </span>
                                        </div>
                                        <div
                                            onClick={() => setPickerType("time")}
                                            className="w-28 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors h-14 flex items-center justify-center border border-white/5 cursor-pointer"
                                        >
                                            <span className="text-white font-bold text-sm">
                                                {endTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 알림 및 카카오톡 설정 */}
                            <div className="space-y-2 pt-2">
                                <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">마감 알림</span>
                                        <span className="text-[10px] text-gray-500">종료 30분 전 알림</span>
                                    </div>
                                    <button
                                        onClick={() => setIsNotifyOn(!isNotifyOn)}
                                        className={`w-11 h-6 rounded-full transition-colors relative ${isNotifyOn ? "bg-primary" : "bg-gray-600"}`}
                                    >
                                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isNotifyOn ? "translate-x-5" : "translate-x-0"}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between bg-[#FAE100]/10 p-4 rounded-2xl border border-[#FAE100]/20">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#FAE100] text-lg">💬</span>
                                            <span className="text-sm font-bold text-white">카카오톡 발송</span>
                                        </div>
                                        <span className="text-[10px] text-gray-400">그룹원에게 투표 알림 발송</span>
                                    </div>
                                    <button
                                        onClick={() => setSendKakao(!sendKakao)}
                                        className={`w-11 h-6 rounded-full transition-colors relative ${sendKakao ? "bg-[#FAE100]" : "bg-gray-600"}`}
                                    >
                                        <div className={`absolute top-1 left-1 bg-black w-4 h-4 rounded-full transition-transform ${sendKakao ? "translate-x-5" : "translate-x-0"}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 하단 버튼 */}
                        <div className="p-4 bg-white/5">
                            <button
                                onClick={handleCreateVote}
                                className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${selectedMatch
                                    ? "bg-primary text-black hover:bg-primary/90 shadow-[0_8px_20px_rgba(202,255,0,0.2)]"
                                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
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
