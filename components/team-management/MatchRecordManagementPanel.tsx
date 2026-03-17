"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Edit2, Trash2, ChevronDown, Plus, X, Swords } from "lucide-react";
import InHouseMatchPanel from "./InHouseMatchPanel";

interface Player {
    id: string;
    name: string;
    profileImage: string;
}

const MOCK_PLAYERS: Player[] = [
    { id: "1", name: "다리알베스", profileImage: "/images/player/img_player_1.webp" },
    { id: "2", name: "권대근(용병)", profileImage: "/images/player/img_player_2.webp" },
    { id: "3", name: "랜디", profileImage: "/images/player/img_player_3.webp" },
    { id: "4", name: "정수", profileImage: "/images/player/img_player_4.webp" },
];

interface ScoreLog {
    id: string;
    type: "goal" | "conceded";
    player?: Player;
    assist?: Player;
    preAssist?: Player;
}

interface MatchRecord {
    id: string;
    date: string;
    opponent: string;
    score?: {
        home: number;
        away: number;
    };
    result?: "win" | "draw" | "loss";
    expanded?: boolean;
}

const INITIAL_MATCHES: MatchRecord[] = [
    {
        id: "1",
        date: "2026. 2. 25.",
        opponent: "레알 마드리드",
        score: { home: 5, away: 3 },
        expanded: true,
    },
    {
        id: "2",
        date: "2026. 3. 5.",
        opponent: "바르셀로나",
        score: { home: 1, away: 2 },
        result: "loss",
    },
    {
        id: "3",
        date: "2026. 3. 10.",
        opponent: "AC 밀란",
        score: { home: 4, away: 0 },
        result: "win",
    },
];

const ResultBadge = ({ result }: { result: "win" | "draw" | "loss" }) => {
    const config = {
        win: { label: "승", bg: "bg-[#4ade80]/20", text: "text-[#4ade80]" },
        draw: { label: "무", bg: "bg-gray-500/20", text: "text-gray-400" },
        loss: { label: "패", bg: "bg-[#f87171]/20", text: "text-[#f87171]" },
    };

    return (
        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", config[result].bg, config[result].text)}>
            {config[result].label}
        </span>
    );
};

// --- 모달 컴포넌트 ---
interface PlayerSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

const PlayerSelectModal = ({ isOpen, onClose, onSave }: PlayerSelectModalProps) => {
    const [selectedGoal, setSelectedGoal] = useState<string>("3"); // 랜디 기본 선택
    const [selectedAssist, setSelectedAssist] = useState<string>("1"); // 다리알베스 기본 선택
    const [selectedPreAssist, setSelectedPreAssist] = useState<string>("none");

    const handleGoalChange = (id: string) => {
        setSelectedGoal(id);
        if (id === "own-goal") {
            setSelectedAssist("none");
            setSelectedPreAssist("none");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[#1e1e1e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                    <div className="w-6" /> 
                    <h2 className="text-base font-bold text-white">득점 선수 입력</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* 득점 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm font-medium text-gray-400">득점</span>
                            <span className="text-sm font-bold text-primary">
                                {selectedGoal === "own-goal" ? "자책골" : MOCK_PLAYERS.find(p => p.id === selectedGoal)?.name}
                            </span>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {/* 자책골 옵션 */}
                            <button 
                                onClick={() => handleGoalChange("own-goal")}
                                className="flex flex-col items-center gap-2 shrink-0 group"
                            >
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl bg-[#2a2a2a] border-2 flex items-center justify-center transition-all",
                                    selectedGoal === "own-goal" ? "border-red-500 scale-105" : "border-transparent opacity-60 group-hover:opacity-100"
                                )}>
                                    <span className={cn("text-xs font-bold", selectedGoal === "own-goal" ? "text-red-500" : "text-gray-500")}>자책골</span>
                                </div>
                                <span className={cn("text-[10px] font-medium transition-colors", selectedGoal === "own-goal" ? "text-white" : "text-gray-500")}>
                                    자책골
                                </span>
                            </button>

                            {/* 선수 리스트 */}
                            {MOCK_PLAYERS.map(player => (
                                <button 
                                    key={player.id} 
                                    onClick={() => handleGoalChange(player.id)}
                                    className="flex flex-col items-center gap-2 shrink-0 group"
                                >
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all",
                                        selectedGoal === player.id ? "border-primary scale-105" : "border-transparent opacity-60 group-hover:opacity-100"
                                    )}>
                                        <Image src={player.profileImage} alt={player.name} width={56} height={56} className="object-cover" />
                                    </div>
                                    <span className={cn("text-[10px] font-medium transition-colors", selectedGoal === player.id ? "text-white" : "text-gray-500")}>
                                        {player.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 도움 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm font-medium text-gray-400">도움</span>
                            <span className="text-sm font-bold text-primary">
                                {selectedAssist === "none" ? "없음" : MOCK_PLAYERS.find(p => p.id === selectedAssist)?.name}
                            </span>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            <button 
                                onClick={() => setSelectedAssist("none")}
                                className="flex flex-col items-center gap-2 shrink-0"
                            >
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl bg-[#2a2a2a] border-2 flex items-center justify-center text-[10px] font-bold text-gray-500 transition-all",
                                    selectedAssist === "none" ? "border-primary scale-105" : "border-transparent opacity-60"
                                )}>
                                    없음
                                </div>
                                <span className={cn("text-[10px] font-medium", selectedAssist === "none" ? "text-white" : "text-gray-500")}>
                                    없음
                                </span>
                            </button>
                            {MOCK_PLAYERS.map(player => (
                                <button 
                                    key={player.id} 
                                    onClick={() => setSelectedAssist(player.id)}
                                    className="flex flex-col items-center gap-2 shrink-0 group"
                                >
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all",
                                        selectedAssist === player.id ? "border-primary scale-105" : "border-transparent opacity-60 group-hover:opacity-100"
                                    )}>
                                        <Image src={player.profileImage} alt={player.name} width={56} height={56} className="object-cover" />
                                    </div>
                                    <span className={cn("text-[10px] font-medium transition-colors", selectedAssist === player.id ? "text-white" : "text-gray-500")}>
                                        {player.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 기점 */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm font-medium text-gray-400">기점</span>
                            <span className="text-sm font-bold text-primary">
                                {selectedPreAssist === "none" ? "없음" : MOCK_PLAYERS.find(p => p.id === selectedPreAssist)?.name}
                            </span>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            <button 
                                onClick={() => setSelectedPreAssist("none")}
                                className="flex flex-col items-center gap-2 shrink-0"
                            >
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl bg-[#2a2a2a] border-2 flex items-center justify-center text-[10px] font-bold text-gray-500 transition-all",
                                    selectedPreAssist === "none" ? "border-primary scale-105" : "border-transparent opacity-60"
                                )}>
                                    없음
                                </div>
                                <span className={cn("text-[10px] font-medium", selectedPreAssist === "none" ? "text-white" : "text-gray-500")}>
                                    없음
                                </span>
                            </button>
                            {MOCK_PLAYERS.map(player => (
                                <button 
                                    key={player.id} 
                                    onClick={() => setSelectedPreAssist(player.id)}
                                    className="flex flex-col items-center gap-2 shrink-0 group"
                                >
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all",
                                        selectedPreAssist === player.id ? "border-primary scale-105" : "border-transparent opacity-60 group-hover:opacity-100"
                                    )}>
                                        <Image src={player.profileImage} alt={player.name} width={56} height={56} className="object-cover" />
                                    </div>
                                    <span className={cn("text-[10px] font-medium transition-colors", selectedPreAssist === player.id ? "text-white" : "text-gray-500")}>
                                        {player.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="p-6 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-4 rounded-xl bg-[#2a2a2a] text-gray-400 text-sm font-bold hover:bg-[#333] transition-colors">
                        취소
                    </button>
                    <button onClick={() => { onSave({}); onClose(); }} className="flex-1 py-4 rounded-xl bg-primary text-black text-sm font-bold hover:opacity-90 transition-opacity">
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function MatchRecordManagementPanel() {
    const [matches, setMatches] = useState<MatchRecord[]>(INITIAL_MATCHES);
    const [selectedQuarter, setSelectedQuarter] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"RECORD" | "IN_HOUSE">("RECORD");

    if (viewMode === "IN_HOUSE") {
        return <InHouseMatchPanel onBack={() => setViewMode("RECORD")} />;
    }

    const toggleExpand = (id: string) => {
        setMatches(matches.map(m => m.id === id ? { ...m, expanded: !m.expanded } : m));
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">경기 기록 관리</h1>
                <Button 
                    variant="primary" 
                    size="xs" 
                    className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 flex items-center gap-1 px-2 py-1.5"
                    onClick={() => setViewMode("IN_HOUSE")}
                >
                    <Swords size={14} />
                    내전 확인
                </Button>
            </div>

            <div className="flex flex-col gap-3">
                {matches.map((match) => (
                    <div key={match.id} className="flex flex-col">
                        {/* 헤더 카드 */}
                        <div 
                            onClick={() => toggleExpand(match.id)}
                            className={cn(
                                "bg-[#1a1a1a] border border-white/5 p-4 md:p-6 flex items-center justify-between hover:bg-white/3 transition-all cursor-pointer",
                                match.expanded ? "rounded-t-2xl border-b-transparent" : "rounded-2xl"
                            )}
                        >
                            <div className="flex items-center gap-4 md:gap-8">
                                <span className="text-xs text-gray-500 font-mono">{match.date}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm md:text-base font-bold text-white">vs {match.opponent}</span>
                                    {match.score && (
                                        <span className="text-sm md:text-base font-bold text-white">
                                            {match.score.home} - {match.score.away}
                                        </span>
                                    )}
                                    {match.result && <ResultBadge result={match.result} />}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                    <Edit2 size={18} />
                                </button>
                                <button className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                                <button 
                                    className={cn("p-2 text-gray-500 hover:text-white transition-all", match.expanded && "rotate-180")}
                                >
                                    <ChevronDown size={18} />
                                </button>
                            </div>
                        </div>

                        {/* 확장된 상세 정보 */}
                        {match.expanded && (
                            <div className="bg-[#1a1a1a] border border-white/5 border-t-transparent rounded-b-2xl p-4 md:p-6 flex flex-col gap-8">
                                {/* 쿼터별 스코어 */}
                                <div className="bg-[#111] rounded-2xl p-6">
                                    <h3 className="text-xs font-bold text-gray-500 mb-4">쿼터별 스코어</h3>
                                    <div className="flex gap-2 mb-6">
                                        {[1, 2, 3, 4].map(q => (
                                            <button 
                                                key={q}
                                                onClick={() => setSelectedQuarter(q)}
                                                className={cn(
                                                    "w-10 h-10 rounded-full text-xs font-bold transition-all border",
                                                    selectedQuarter === q 
                                                        ? "bg-primary border-primary text-black" 
                                                        : "bg-transparent border-white/10 text-gray-500 hover:border-white/30"
                                                )}
                                            >
                                                {q}Q
                                            </button>
                                        ))}
                                    </div>

                                    {/* 스코어 추가 영역 */}
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => setIsModalOpen(true)}
                                            className="flex-1 py-3 px-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-all text-center"
                                        >
                                            우리팀 득점 추가
                                        </button>
                                        <span className="text-base font-bold text-white">3 - 1</span>
                                        <button className="flex-1 py-3 px-4 rounded-xl bg-red-400/5 border border-red-400/20 text-red-400 text-xs font-bold hover:bg-red-400/10 transition-all text-center opacity-40">
                                            상대팀 득점 추가
                                        </button>
                                    </div>
                                </div>

                                {/* 스코어 로그 */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-500">스코어</h3>
                                    
                                    {/* 득점 로그 1 */}
                                    <div className="bg-[#111] rounded-2xl p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                                <Image src="/images/ovr.png" alt="OVR" width={16} height={16} />
                                            </div>
                                            <span className="text-xs font-bold text-white">득점</span>
                                            <button 
                                                onClick={() => setIsModalOpen(true)}
                                                className="bg-white/5 text-gray-400 text-[10px] px-2 py-1 rounded hover:bg-white/10"
                                            >
                                                선수 변경
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-white">득점 김정수</p>
                                            <p className="text-[10px] text-gray-500">도움 호날두</p>
                                            <p className="text-[10px] text-gray-500">기점 -</p>
                                        </div>
                                    </div>

                                    {/* 득점 로그 2 */}
                                    <div className="bg-[#111]/50 rounded-2xl p-5 flex items-center justify-between border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                                <Image src="/images/ovr.png" alt="OVR" width={16} height={16} />
                                            </div>
                                            <span className="text-xs font-bold text-white">득점</span>
                                            <button className="bg-primary text-black text-[10px] font-bold px-2 py-1 rounded hover:opacity-90">
                                                선수 입력
                                            </button>
                                        </div>
                                    </div>

                                    {/* 실점 로그 */}
                                    <div className="bg-red-400/10 rounded-2xl p-5 flex items-center gap-4 border border-red-400/10">
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                            <Image src="/images/ovr.png" alt="OVR" width={16} height={16} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-300">실점</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <PlayerSelectModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={() => {}} 
            />

            {/* 하단 저장 바 */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/5 p-4 flex items-center justify-between px-6 md:px-12">
                <p className="text-xs md:text-sm text-gray-400 font-medium">
                    변경사항이 있습니다. 저장하지 않으면 사라집니다.
                </p>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 rounded-xl border border-white/10 text-white text-xs md:text-sm font-bold hover:bg-white/5 transition-colors">
                        초기화
                    </button>
                    <button className="px-5 py-2.5 rounded-xl bg-primary text-black text-xs md:text-sm font-bold hover:opacity-90 transition-opacity">
                        저장하기
                    </button>
                </div>
            </div>
            {/* 하단 여백 확보 */}
            <div className="h-24" />
        </div>
    );
}
