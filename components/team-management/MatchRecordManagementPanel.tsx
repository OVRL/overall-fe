import React, { useState, Suspense } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { cn, getValidImageSrc } from "@/lib/utils";
import { Edit2, Trash2, ChevronDown, Plus, X, Swords } from "lucide-react";
import InHouseMatchPanel from "./InHouseMatchPanel";
import { useMatchRecordsQuery } from "./hooks/useMatchRecordsQuery";
import { useDeleteMatchMutation } from "./hooks/useDeleteMatchMutation";

interface Player {
    id: string;
    name: string;
    profileImage: string;
}

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

const MOCK_PLAYERS: Player[] = [
    { id: "1", name: "다리알베스", profileImage: "/images/player/img_player_1.webp" },
    { id: "2", name: "권대근(용병)", profileImage: "/images/player/img_player_2.webp" },
    { id: "3", name: "랜디", profileImage: "/images/player/img_player_3.webp" },
    { id: "4", name: "정수", profileImage: "/images/player/img_player_4.webp" },
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
    const [selectedGoal, setSelectedGoal] = useState<string>("3");
    const [selectedAssist, setSelectedAssist] = useState<string>("1");
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
                            <button 
                                onClick={() => handleGoalChange("own-goal")}
                                className={cn(
                                    "flex flex-col items-center gap-2 shrink-0 group",
                                    selectedGoal === "own-goal" ? "opacity-100" : "opacity-60"
                                )}
                            >
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl bg-[#2a2a2a] border-2 flex items-center justify-center transition-all",
                                    selectedGoal === "own-goal" ? "border-red-500 scale-105" : "border-transparent"
                                )}>
                                    <span className={cn("text-xs font-bold", selectedGoal === "own-goal" ? "text-red-500" : "text-gray-500")}>자책골</span>
                                </div>
                            </button>
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
                                        <Image src={getValidImageSrc(player.profileImage)} alt={player.name} width={56} height={56} className="object-cover" />
                                    </div>
                                    <span className={cn("text-[10px] font-medium transition-colors", selectedGoal === player.id ? "text-white" : "text-gray-500")}>
                                        {player.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 도움/기점 섹션은 MOCK 기반이므로 구조만 유지 */}
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

function MatchRecordManagementPanelInner({ teamId }: { teamId: number }) {
    const data = useMatchRecordsQuery(teamId);
    const { executeMutation: deleteMatch } = useDeleteMatchMutation();
    const [selectedQuarter, setSelectedQuarter] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"RECORD" | "IN_HOUSE">("RECORD");
    
    // API 데이터를 로컬 상태와 결합 (확장 여부 관리용)
    const initialMatches: MatchRecord[] = React.useMemo(() => (data.findMatch || []).map((m: any) => ({
        id: String(m.id),
        date: m.matchDate ? new Date(m.matchDate).toLocaleDateString() : "-",
        opponent: m.opponentTeam?.name || m.teamName || "상대팀 미정",
        score: { home: 0, away: 0 },
        result: "draw",
        expanded: false,
    })), [data.findMatch]);

    const [matches, setMatches] = useState<MatchRecord[]>(initialMatches);
    const [hasChanges, setHasChanges] = useState(false);
    const [pendingDeletes, setPendingDeletes] = useState<string[]>([]);
    const [isSavingChanges, setIsSavingChanges] = useState(false);

    // 초기 데이터 로드 시 상태 동기화
    React.useEffect(() => {
        setMatches(initialMatches);
    }, [initialMatches]);

    const toggleExpand = (id: string) => {
        setMatches(prev => prev.map(m => m.id === id ? { ...m, expanded: !m.expanded } : m));
    };

    if (viewMode === "IN_HOUSE") {
        return <InHouseMatchPanel onBack={() => setViewMode("RECORD")} />;
    }

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setPendingDeletes(prev => [...prev, id]);
        setHasChanges(true);
    };

    const handleReset = () => {
        setPendingDeletes([]);
        setMatches(initialMatches);
        setHasChanges(false);
    };

    const handleSaveChanges = async () => {
        if (pendingDeletes.length === 0) {
            setHasChanges(false);
            return;
        }

        setIsSavingChanges(true);
        try {
            // 보류 중인 모든 삭제 요청 처리
            await Promise.all(pendingDeletes.map(id => deleteMatch(Number(id))));
            setPendingDeletes([]);
            setHasChanges(false);
            alert("변경사항이 저장되었습니다.");
        } catch (err) {
            console.error(err);
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setIsSavingChanges(false);
        }
    };

    // 화면에 보여줄 매치 필터링 (임시 삭제된 것 제외)
    const visibleMatches = matches.filter(m => !pendingDeletes.includes(m.id));

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">경기 기록 관리</h1>
                <Button 
                    variant="primary" 
                    size="s" 
                    className="bg-primary text-black font-black flex items-center gap-1.5 px-4 shadow-xl shadow-primary/10"
                    onClick={() => setViewMode("IN_HOUSE")}
                >
                    <Plus size={16} strokeWidth={3} />
                    내전 등록
                </Button>
            </div>

            <div className="flex flex-col gap-3">
                {visibleMatches.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">등록된 경기 기록이 없습니다.</div>
                ) : visibleMatches.map((match) => (
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
                                <button 
                                    onClick={(e) => handleDelete(match.id, e)}
                                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                >
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
                                {/* ... (rest of the expanded content remains the same) */}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <PlayerSelectModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={() => setHasChanges(true)} 
            />

            {/* 하단 저장 바 - 변경사항이 있을 때만 노출 */}
            {hasChanges && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/5 p-4 flex items-center justify-between px-6 md:px-12 animate-in slide-in-from-bottom duration-300">
                    <p className="text-xs md:text-sm text-gray-400 font-medium">
                        변경사항이 있습니다. 저장하지 않으면 사라집니다.
                    </p>
                    <div className="flex gap-3">
                        <button 
                            disabled={isSavingChanges}
                            onClick={handleReset}
                            className="px-5 py-2.5 rounded-xl border border-white/10 text-white text-xs md:text-sm font-bold hover:bg-white/5 transition-colors disabled:opacity-50"
                        >
                            초기화
                        </button>
                        <button 
                            disabled={isSavingChanges}
                            onClick={handleSaveChanges}
                            className="px-5 py-2.5 rounded-xl bg-primary text-black text-xs md:text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSavingChanges ? "저장 중..." : "저장하기"}
                        </button>
                    </div>
                </div>
            )}
            <div className="h-24" />
        </div>
    );
}

export default function MatchRecordManagementPanel() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">경기 기록 로딩 중...</div>}>
            <MatchRecordManagementPanelInner teamId={1} />
        </Suspense>
    );
}
