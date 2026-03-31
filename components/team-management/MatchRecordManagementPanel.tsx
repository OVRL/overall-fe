import React, { useState, Suspense } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { cn, getValidImageSrc } from "@/lib/utils";
import { Edit2, Trash2, ChevronDown, Plus, X, Swords } from "lucide-react";
import InHouseMatchPanel from "./InHouseMatchPanel";
import { useMatchRecordsQuery } from "./hooks/useMatchRecordsQuery";
import { useDeleteMatchMutation } from "./hooks/useDeleteMatchMutation";
import { usePlayerManagementQuery } from "./hooks/usePlayerManagementQuery";
import { useUpdateMatchMutation } from "./hooks/useUpdateMatchMutation";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";

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
    score: {
        home: number;
        away: number;
    };
    result: "win" | "draw" | "loss";
    expanded: boolean;
    logs: Record<number, ScoreLog[]>; // 쿼터별 로그
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
    onSave: (data: { goalId: string; assistId: string; preAssistId: string }) => void;
    onSaveText: (data: (ScoreLog & { quarter: number })[]) => void;
    onShowSummary?: () => void;
    players: Player[];
    currentQuarter: number;
}

const PlayerSelectModal = ({ isOpen, onClose, onSave, onSaveText, onShowSummary, players, currentQuarter }: PlayerSelectModalProps) => {
    const [mode, setMode] = useState<"SELECT" | "TEXT">("SELECT");
    const [textInput, setTextInput] = useState("");
    const [selectedGoal, setSelectedGoal] = useState<string>("none");
    const [selectedAssist, setSelectedAssist] = useState<string>("none");
    const [selectedPreAssist, setSelectedPreAssist] = useState<string>("none");
    const [suggestions, setSuggestions] = useState<{ label: string; value: string }[]>([]);
    const [showLocalSummary, setShowLocalSummary] = useState(false);

    // 선택 모드와 텍스트 모드 동기화 로직
    React.useEffect(() => {
        if (mode !== "SELECT") return;

        const goalPlayer = players.find(p => p.id === selectedGoal)?.name;
        const assistPlayer = players.find(p => p.id === selectedAssist)?.name;
        const preAssistPlayer = players.find(p => p.id === selectedPreAssist)?.name;

        if (!goalPlayer && selectedGoal !== "own-goal") {
            setTextInput("");
            return;
        }

        const parts = [];
        if (selectedGoal === "own-goal") parts.push("자책골");
        else if (goalPlayer) parts.push(`${goalPlayer}골`);
        
        if (assistPlayer) parts.push(`${assistPlayer}어시`);
        if (preAssistPlayer) parts.push(`${preAssistPlayer}기점`);

        if (parts.length > 0) {
            setTextInput(`${currentQuarter}Q ${parts.join(" ")}`);
        } else {
            setTextInput("");
        }
    }, [selectedGoal, selectedAssist, selectedPreAssist, mode, currentQuarter, players]);

    // 제안 로직 고도화
    React.useEffect(() => {
        if (mode !== "TEXT" || !textInput.trim()) {
            setSuggestions([]);
            return;
        }

        const lines = textInput.split("\n");
        const lastLine = lines[lines.length - 1];
        
        // 현재 라인에서 마지막 토큰 추출 (공백 기준)
        const tokens = lastLine.trim().split(/\s+/);
        const lastToken = tokens[tokens.length - 1] || "";

        if (!lastToken) {
            setSuggestions([]);
            return;
        }

        const newSuggestions: { label: string; value: string }[] = [];

        // 1. 숫자만 입력된 경우 Q 제안
        if (/^\d+$/.test(lastToken)) {
            newSuggestions.push({ label: `${lastToken}Q`, value: "Q " });
        }

        // 현재 라인에 이미 등장한 선수들 찾기
        const playersOnLine = players.filter(p => lastLine.includes(p.name)).map(p => p.name);

        // 2. 정확히 이름과 일치하면 다음 액션 제안 (골 -> 어시 -> 기점)
        const exactPlayer = players.find(p => p.name === lastToken);
        if (exactPlayer) {
            const hasGoal = lastLine.includes("득점") || lastLine.includes("골");
            const hasAssist = lastLine.includes("어시");
            
            if (!hasGoal) newSuggestions.push({ label: "골", value: "골 " });
            else if (!hasAssist) newSuggestions.push({ label: "어시", value: "어시 " });
            else newSuggestions.push({ label: "기점", value: "기점 " });
        } else {
            // 3. 선수 이름 매칭 시도 (부분 일치)
            const matchedPlayers = players
                .filter(p => !playersOnLine.includes(p.name) && p.name.startsWith(lastToken))
                .slice(0, 3);
            
            matchedPlayers.forEach(p => {
                newSuggestions.push({ 
                    label: p.name, 
                    value: p.name.slice(lastToken.length) + " " 
                });
            });
        }

        setSuggestions(newSuggestions.slice(0, 3));
    }, [textInput, mode, players]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (mode === "TEXT" && e.key === " " && suggestions.length > 0) {
            // 스페이스바 입력 시 첫 번째 제안 적용 (기존 동작 유지하되 힌트는 제거)
            e.preventDefault();
            setTextInput(prev => prev + suggestions[0].value);
        }
    };

    // 텍스트 파싱 로직
    const parsedSummary = React.useMemo(() => {
        if (!textInput.trim()) return [];
        
        const lines = textInput.split(/\n| /); // 뉴라인이나 공백으로 분리
        let currentQuarter = 1;
        const results: (ScoreLog & { quarter: number })[] = [];

        const quarterRegex = /(\d+)[qQ]/;
        const goalRegex = /([^득점골어시기점\s\n]+?)\s*(?:득점|골)/;
        const assistRegex = /([^득점골어시기점\s\n]+?)\s*어시/;
        const preAssistRegex = /([^득점골어시기점\s\n]+?)\s*기점/;

        textInput.split(/\n/).forEach((line: string) => {
            const qMatch = line.match(quarterRegex);
            if (qMatch) {
                currentQuarter = parseInt(qMatch[1]);
            }

            const goalEvents = line.split(/(?=.+?득점)/);
            goalEvents.forEach((event: string) => {
                const g = event.match(goalRegex);
                if (g) {
                    const playerName = g[1].trim();
                    const player = players.find(p => p.name.includes(playerName));
                    
                    const a = event.match(assistRegex);
                    const assistPlayer = a ? players.find(p => p.name.includes(a[1].trim())) : undefined;
                    
                    const pa = event.match(preAssistRegex);
                    const preAssistPlayer = pa ? players.find(p => p.name.includes(pa[1].trim())) : undefined;
                    
                    results.push({
                        id: Date.now().toString() + Math.random(),
                        type: "goal",
                        player,
                        assist: assistPlayer,
                        preAssist: preAssistPlayer,
                        quarter: currentQuarter
                    });
                }
            });
        });

        return results;
    }, [textInput, players]);

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
                    <h2 className="text-base font-bold text-white">득점 정보 입력</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* 입력 방식 선택 탭 */}
                    <div className="flex p-1 bg-black/40 rounded-2xl border border-white/5">
                        <button 
                            onClick={() => setMode("SELECT")}
                            className={cn(
                                "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all",
                                mode === "SELECT" ? "bg-primary text-black" : "text-gray-500 hover:text-white"
                            )}
                        >
                            선택해서 넣기
                        </button>
                        <button 
                            onClick={() => setMode("TEXT")}
                            className={cn(
                                "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all",
                                mode === "TEXT" ? "bg-primary text-black" : "text-gray-500 hover:text-white"
                            )}
                        >
                            텍스트로 넣기
                        </button>
                    </div>

                    {mode === "SELECT" ? (
                        <div className="space-y-8">
                            {/* 득점 */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-sm font-medium text-gray-400">득점</span>
                                    <span className="text-sm font-bold text-primary">
                                        {selectedGoal === "own-goal" ? "자책골" : players.find(p => p.id === selectedGoal)?.name}
                                    </span>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
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
                                    {players.map(player => (
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

                            {/* 도움 섹션 */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-sm font-medium text-gray-400">도움</span>
                                    <span className="text-sm font-bold text-primary">
                                        {selectedAssist === "none" ? "없음" : players.find(p => p.id === selectedAssist)?.name}
                                    </span>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                    <button 
                                        onClick={() => setSelectedAssist("none")}
                                        className={cn(
                                            "flex flex-col items-center gap-2 shrink-0 group",
                                            selectedAssist === "none" ? "opacity-100" : "opacity-60"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl bg-[#2a2a2a] border-2 flex items-center justify-center transition-all",
                                            selectedAssist === "none" ? "border-primary scale-105" : "border-transparent"
                                        )}>
                                            <span className={cn("text-xs font-bold", selectedAssist === "none" ? "text-primary" : "text-gray-500")}>없음</span>
                                        </div>
                                    </button>
                                    {players.map(player => (
                                        <button 
                                            key={player.id} 
                                            onClick={() => setSelectedAssist(player.id)}
                                            disabled={selectedGoal === player.id || selectedGoal === "own-goal"}
                                            className="flex flex-col items-center gap-2 shrink-0 group disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <div className={cn(
                                                "w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all",
                                                selectedAssist === player.id ? "border-primary scale-105" : "border-transparent opacity-60 group-hover:opacity-100"
                                            )}>
                                                <Image src={getValidImageSrc(player.profileImage)} alt={player.name} width={56} height={56} className="object-cover" />
                                            </div>
                                            <span className={cn("text-[10px] font-medium transition-colors", selectedAssist === player.id ? "text-white" : "text-gray-500")}>
                                                {player.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* 기점 섹션 */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-sm font-medium text-gray-400">기점</span>
                                    <span className="text-sm font-bold text-primary">
                                        {selectedPreAssist === "none" ? "없음" : players.find(p => p.id === selectedPreAssist)?.name}
                                    </span>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                    <button 
                                        onClick={() => setSelectedPreAssist("none")}
                                        className={cn(
                                            "flex flex-col items-center gap-2 shrink-0 group",
                                            selectedPreAssist === "none" ? "opacity-100" : "opacity-60"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl bg-[#2a2a2a] border-2 flex items-center justify-center transition-all",
                                            selectedPreAssist === "none" ? "border-primary scale-105" : "border-transparent"
                                        )}>
                                            <span className={cn("text-xs font-bold", selectedPreAssist === "none" ? "text-primary" : "text-gray-500")}>없음</span>
                                        </div>
                                    </button>
                                    {players.map(player => (
                                        <button 
                                            key={player.id} 
                                            onClick={() => setSelectedPreAssist(player.id)}
                                            disabled={selectedGoal === player.id || selectedAssist === player.id || selectedGoal === "own-goal"}
                                            className="flex flex-col items-center gap-2 shrink-0 group disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <div className={cn(
                                                "w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all",
                                                selectedPreAssist === player.id ? "border-primary scale-105" : "border-transparent opacity-60 group-hover:opacity-100"
                                            )}>
                                                <Image src={getValidImageSrc(player.profileImage)} alt={player.name} width={56} height={56} className="object-cover" />
                                            </div>
                                            <span className={cn("text-[10px] font-medium transition-colors", selectedPreAssist === player.id ? "text-white" : "text-gray-500")}>
                                                {player.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">텍스트 입력 (카톡 스타일)</label>
                                    <span className="text-[10px] text-primary/60 font-medium">예시: 1Q 메시골 호날두어시</span>
                                </div>
                                <div className="relative group">
                                    <textarea 
                                        className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-700 relative z-10 scrollbar-hide"
                                        placeholder="입력 예시:&#10;1Q 메시골 호날두어시 이니에스타기점&#10;2Q&#10;음바페득점 벨링엄어시 손흥민기점"
                                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                            </div>

                            {parsedSummary.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">파싱 미리보기</label>
                                        <button 
                                            onClick={() => setShowLocalSummary(true)}
                                            className="px-2 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[10px] text-primary font-black hover:bg-primary/20 transition-all shadow-sm"
                                        >
                                            전체보기
                                        </button>
                                    </div>
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
                                        {parsedSummary.map((item, idx) => (
                                            <div key={idx} className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-primary">{item.quarter}Q</span>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-white">득점: {item.player?.name || "알 수 없음"}</span>
                                                        <span className="text-[10px] text-gray-500">
                                                            어시: {item.assist?.name || "-"} / 기점: {item.preAssist?.name || "-"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 로컬 파싱 요약 모달 */}
                            {showLocalSummary && (
                                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                                    <div className="w-full max-w-lg bg-[#1a1a1a] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                                        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                                            <div className="flex flex-col gap-1">
                                                <h2 className="text-lg font-black text-white">쿼터별 데이터 요약</h2>
                                                <p className="text-[10px] text-gray-500 font-medium">현재 입력 중인 데이터를 확인합니다</p>
                                            </div>
                                            <button onClick={() => setShowLocalSummary(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
                                            {[1, 2, 3, 4].map(q => {
                                                const quarterData = parsedSummary.filter(item => item.quarter === q);
                                                if (quarterData.length === 0) return null;
                                                return (
                                                    <div key={q} className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary/30 before:rounded-full">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <span className="text-xs font-black text-primary px-2 py-0.5 rounded bg-primary/10">{q}Q</span>
                                                            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">{quarterData.length} GOALS</span>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {quarterData.map((item, idx) => (
                                                                <div key={idx} className="flex flex-col gap-1 bg-white/2 rounded-2xl p-4 border border-white/5">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                                        <span className="text-sm font-bold text-white">득점: {item.player?.name || "알 수 없음"}</span>
                                                                    </div>
                                                                    {(item.assist || item.preAssist) && (
                                                                        <div className="flex gap-3 ml-3.5">
                                                                            {item.assist && <span className="text-[11px] text-gray-500 font-medium"><span className="text-primary/60 mr-1">어시:</span> {item.assist.name}</span>}
                                                                            {item.preAssist && <span className="text-[11px] text-gray-500 font-medium"><span className="text-primary/60 mr-1">기점:</span> {item.preAssist.name}</span>}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {parsedSummary.length === 0 && (
                                                <div className="py-20 text-center text-gray-700 font-bold uppercase tracking-widest text-xs">No parsed data available</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="px-6 space-y-4">
                    {/* 자동완성 제안 바 - 모바일 최우선 배치 */}
                    {mode === "TEXT" && suggestions.length > 0 && (
                        <div className="flex gap-2 p-2 bg-black/40 rounded-xl border border-white/5 overflow-x-auto scrollbar-hide animate-in fade-in slide-in-from-bottom-2">
                            {suggestions.map((s, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setTextInput(prev => prev + s.value)}
                                    className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold whitespace-nowrap active:bg-primary active:text-black transition-all"
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-3 pb-6">
                        <button onClick={onClose} className="flex-1 py-4 rounded-xl bg-[#2a2a2a] text-gray-400 text-sm font-bold hover:bg-[#333] transition-colors">
                            취소
                        </button>
                        <button 
                            onClick={() => { 
                                if (mode === "SELECT") {
                                    onSave({ goalId: selectedGoal, assistId: selectedAssist, preAssistId: selectedPreAssist }); 
                                } else {
                                    onSaveText(parsedSummary);
                                }
                                onClose(); 
                            }} 
                            className="flex-1 py-4 rounded-xl bg-primary text-black text-sm font-bold hover:opacity-90 transition-opacity"
                        >
                            저장
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function MatchRecordManagementPanelInner({ teamId }: { teamId: number }) {
    const data = useMatchRecordsQuery(teamId);
    const playersData = usePlayerManagementQuery(teamId);
    const { executeMutation: deleteMatch } = useDeleteMatchMutation();
    const [selectedQuarter, setSelectedQuarter] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"RECORD" | "IN_HOUSE">("RECORD");
    const [showFullSummary, setShowFullSummary] = useState(false);
    const [logToDelete, setLogToDelete] = useState<{ matchId: string; quarter: number; logId: string; description: string } | null>(null);
    
    // 실제 팀 멤버 데이터 매핑
    const teamPlayers: Player[] = React.useMemo(() => (playersData.findManyTeamMember.members || []).map((m: any) => ({
        id: String(m.id),
        name: m.user?.name || "알 수 없음",
        profileImage: m.user?.profileImage || "/images/player/img_player_1.webp"
    })), [playersData.findManyTeamMember.members]);
    // API 데이터를 로컬 상태와 결합 (확장 여부 관리용 및 로그 데이터 복원)
    const initialMatches: MatchRecord[] = React.useMemo(() => (data.findMatch || []).map((m: any) => {
        let savedData = { score: { home: 0, away: 0 }, logs: { 1: [], 2: [], 3: [], 4: [] } };
        try {
            if (m.description && m.description.startsWith("{")) {
                savedData = JSON.parse(m.description);
            }
        } catch (e) {
            console.error("Failed to parse match description:", e);
        }

        return {
            id: String(m.id),
            date: m.matchDate ? new Date(m.matchDate).toLocaleDateString() : "-",
            opponent: m.opponentTeam?.name || m.teamName || "상대팀 미정",
            score: savedData.score,
            result: (savedData.score.home > savedData.score.away ? "win" : 
                    savedData.score.home < savedData.score.away ? "loss" : "draw") as "win" | "draw" | "loss",
            expanded: false,
            logs: savedData.logs,
        };
    }), [data.findMatch]);

    const [matches, setMatches] = useState<MatchRecord[]>(initialMatches);
    const [changedIds, setChangedIds] = useState<Set<string>>(new Set());
    const { executeMutation: updateMatch } = useUpdateMatchMutation();
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

    const updateMatchData = (id: string, updater: (m: MatchRecord) => MatchRecord) => {
        setMatches(prev => prev.map(m => {
            if (m.id === id) {
                const updated = updater(m);
                // 결과 자동 계산
                const result = updated.score.home > updated.score.away ? "win" : 
                               updated.score.home < updated.score.away ? "loss" : "draw";
                return { ...updated, result };
            }
            return m;
        }));
        setChangedIds(prev => new Set(prev).add(id));
        setHasChanges(true);
    };

    const handleSaveChanges = async () => {
        if (pendingDeletes.length === 0 && changedIds.size === 0) {
            setHasChanges(false);
            return;
        }

        setIsSavingChanges(true);
        try {
            // 삭제 처리
            if (pendingDeletes.length > 0) {
                await Promise.all(pendingDeletes.map(id => deleteMatch(Number(id))));
            }

            // 수정 처리 (로그/스코어 보관을 위해 description 업데이트)
            if (changedIds.size > 0) {
                const updates = Array.from(changedIds).map(id => {
                    const match = matches.find(m => m.id === id);
                    if (!match) return Promise.resolve();
                    
                    const recordData = JSON.stringify({
                        score: match.score,
                        logs: match.logs
                    });

                    return updateMatch({
                        variables: {
                            input: {
                                id: Number(id),
                                description: recordData
                            }
                        }
                    });
                });
                await Promise.all(updates);
            }

            setPendingDeletes([]);
            setChangedIds(new Set());
            setHasChanges(false);
            alert("변경사항이 성공적으로 저장되었습니다.");
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
                <div className="flex items-center gap-3">
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
                            <div className="flex items-center gap-2 md:gap-8 min-w-0">
                                <span className="text-[10px] md:text-xs text-gray-500 font-mono shrink-0">{match.date}</span>
                                <div className="flex items-center gap-2 md:gap-3 min-w-0 overflow-hidden">
                                    <span className="text-xs md:text-base font-bold text-white truncate">vs {match.opponent}</span>
                                    {match.score && (
                                        <span className="hidden md:inline md:text-base font-bold text-white shrink-0">
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
                                    className={cn("p-2 text-gray-500 hover:text-white transition-all", match.expanded && "rotate-180")}
                                >
                                    <ChevronDown size={18} />
                                </button>
                            </div>
                        </div>

                        {/* 확장된 상세 정보 */}
                        {match.expanded && (
                            <div className="bg-[#1a1a1a] border border-white/5 border-t-transparent rounded-b-2xl p-4 md:p-6 flex flex-col gap-8">
                                {/* 쿼터 탭 */}
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {[1, 2, 3, 4].map(q => (
                                        <button
                                            key={q}
                                            onClick={() => setSelectedQuarter(q)}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                                                selectedQuarter === q ? "bg-primary text-black" : "bg-white/5 text-gray-500 hover:text-white"
                                            )}
                                        >
                                            {q}쿼터
                                        </button>
                                    ))}
                                </div>

                                {/* 스코어보드 */}
                                <div className="flex flex-col items-center gap-6 py-4">
                                    <div className="flex items-center gap-8 md:gap-16">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-xs text-gray-500 font-bold">HOME</span>
                                            <span className="text-4xl md:text-5xl font-black text-white">{match.score.home}</span>
                                        </div>
                                        <div className="text-2xl md:text-3xl font-black text-gray-700">:</div>
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-xs text-gray-500 font-bold">AWAY</span>
                                            <span className="text-4xl md:text-5xl font-black text-white">{match.score.away}</span>
                                        </div>
                                    </div>

                                    {/* 로그 리스트 */}
                                    <div className="w-full max-w-md space-y-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Match Logs ({selectedQuarter}Q)</span>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => {
                                                        setActiveMatchId(match.id);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold hover:bg-emerald-500/20 transition-all"
                                                >
                                                    <Plus size={12} /> 득점 추가
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        const newLogs = { ...match.logs };
                                                        newLogs[selectedQuarter] = [...(newLogs[selectedQuarter] || []), { id: Date.now().toString(), type: "conceded" }];
                                                        updateMatchData(match.id, m => ({
                                                            ...m,
                                                            logs: newLogs,
                                                            score: { ...m.score, away: m.score.away + 1 }
                                                        }));
                                                    }}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold hover:bg-red-500/20 transition-all"
                                                >
                                                    <Plus size={12} /> 실점 추가
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {(match.logs[selectedQuarter] || []).map(log => (
                                                <div key={log.id} className="flex items-center justify-between bg-[#222] border border-white/5 rounded-xl px-4 py-3 group">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-1.5 h-1.5 rounded-full",
                                                            log.type === "goal" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                                        )} />
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-bold text-white">
                                                                    {log.type === "goal" ? "득점" : "실점"}
                                                                </span>
                                                                {log.player && (
                                                                    <div className="w-5 h-5 rounded-md overflow-hidden bg-white/5 border border-white/10">
                                                                        <Image src={getValidImageSrc(log.player.profileImage)} alt={log.player.name} width={20} height={20} className="object-cover" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {log.player && (
                                                                <span className="text-[10px] text-gray-500 mt-0.5">
                                                                    {log.player.name} {log.assist && <span className="opacity-60 text-[9px] ml-1">(도움: {log.assist.name})</span>}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveMatchId(match.id);
                                                                setIsModalOpen(true);
                                                                // TODO: 실제 수정을 위해 기존 정보를 모달에 세팅하는 로직은 향후 고도화 가능
                                                            }}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:text-primary hover:bg-primary/10 transition-all"
                                                        >
                                                            <Edit2 size={13} />
                                                        </button>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const parts = [];
                                                                if (log.player) parts.push(`${log.player.name}골`);
                                                                else if (log.type === "conceded") parts.push("실점");
                                                                
                                                                if (log.assist) parts.push(`${log.assist.name}어시`);
                                                                if (log.preAssist) parts.push(`${log.preAssist.name}기점`);
                                                                
                                                                setLogToDelete({
                                                                    matchId: match.id,
                                                                    quarter: selectedQuarter,
                                                                    logId: log.id,
                                                                    description: `${selectedQuarter}Q ${parts.join(" ")}`
                                                                });
                                                            }}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {(match.logs[selectedQuarter] || []).length === 0 && (
                                                <div className="py-8 text-center text-[10px] text-gray-700 font-bold bg-white/2 rounded-xl border border-dashed border-white/5 uppercase tracking-widest">No logs for this quarter</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <PlayerSelectModal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    setActiveMatchId(null);
                }} 
                players={teamPlayers}
                currentQuarter={selectedQuarter}
                onShowSummary={() => setShowFullSummary(true)}
                onSave={(saveData) => {
                    if (!activeMatchId) return;
                    
                    const goalPlayer = teamPlayers.find(p => p.id === saveData.goalId);
                    const assistPlayer = teamPlayers.find(p => p.id === saveData.assistId);
                    const preAssistPlayer = teamPlayers.find(p => p.id === saveData.preAssistId);
                    
                    const newLog: ScoreLog = {
                        id: Date.now().toString(),
                        type: "goal",
                        player: goalPlayer,
                        assist: assistPlayer,
                        preAssist: preAssistPlayer
                    };

                    updateMatchData(activeMatchId, m => {
                        const newLogs = { ...m.logs };
                        newLogs[selectedQuarter] = [...(newLogs[selectedQuarter] || []), newLog];
                        return { 
                            ...m, 
                            logs: newLogs, 
                            score: { ...m.score, home: m.score.home + 1 } 
                        };
                    });
                }} 
                onSaveText={(parsedLogs) => {
                    if (!activeMatchId) return;
                    
                    updateMatchData(activeMatchId, m => {
                        const newLogs = { ...m.logs };
                        let homeScoreAdd = 0;
                        
                        parsedLogs.forEach(log => {
                            const { quarter, ...logData } = log;
                            newLogs[quarter] = [...(newLogs[quarter] || []), logData];
                            homeScoreAdd++;
                        });

                        return {
                            ...m,
                            logs: newLogs,
                            score: { ...m.score, home: m.score.home + homeScoreAdd }
                        };
                    });
                }}
            />

            {/* 전체 쿼터 요약 모달 */}
            {showFullSummary && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl bg-[#1e1e1e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                            <h2 className="text-base font-bold text-white">전체 경기 요약 (쿼터별 득점)</h2>
                            <button onClick={() => setShowFullSummary(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-8 scrollbar-hide">
                            {visibleMatches.map(match => (
                                <div key={match.id} className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-primary">vs {match.opponent} ({match.date})</h3>
                                        <span className="text-xs font-bold text-white">{match.score.home} : {match.score.away}</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[1, 2, 3, 4].map(q => {
                                            const quarterLogs = match.logs[q] || [];
                                            const goals = quarterLogs.filter(l => l.type === "goal");
                                            if (goals.length === 0) return null;
                                            return (
                                                <div key={q} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                                    <div className="text-[10px] font-black text-gray-500 mb-3 uppercase tracking-widest">{q}QUARTER</div>
                                                    <div className="space-y-2">
                                                        {goals.map((log, idx) => (
                                                            <div key={idx} className="flex items-center gap-2">
                                                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                                                <span className="text-xs text-white font-bold">{log.player?.name}</span>
                                                                {log.assist && <span className="text-[10px] text-gray-500">(도움: {log.assist.name})</span>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="h-px bg-white/5 w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 삭제 확인 모달 */}
            {logToDelete && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
                    <div className="w-full max-w-sm bg-[#1a1a1a] rounded-[2.5rem] border border-white/10 shadow-2xl p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
                            <Trash2 size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black text-white mb-2">기록 삭제 확인</h3>
                        <p className="text-sm text-gray-500 leading-relaxed mb-8">
                            <span className="text-white font-bold bg-white/5 px-2 py-1 rounded-lg">{logToDelete.description}</span>
                            <br /><br />
                            정말로 이 기록을 삭제하시겠습니까?
                        </p>
                        <div className="flex gap-3 w-full">
                            <button 
                                onClick={() => setLogToDelete(null)}
                                className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-400 text-sm font-bold hover:bg-white/10 transition-all"
                            >
                                취소
                            </button>
                            <button 
                                onClick={() => {
                                    updateMatchData(logToDelete.matchId, m => {
                                        const newLogs = { ...m.logs };
                                        const removedLog = newLogs[logToDelete.quarter]?.find(l => l.id === logToDelete.logId);
                                        newLogs[logToDelete.quarter] = (newLogs[logToDelete.quarter] || []).filter(l => l.id !== logToDelete.logId);
                                        
                                        // 스코어 차감
                                        let { home, away } = m.score;
                                        if (removedLog?.type === "goal") home = Math.max(0, home - 1);
                                        else if (removedLog?.type === "conceded") away = Math.max(0, away - 1);

                                        return { ...m, logs: newLogs, score: { home, away } };
                                    });
                                    setLogToDelete(null);
                                }}
                                className="flex-1 py-4 rounded-2xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                            >
                                삭제하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
    const { selectedTeamIdNum } = useSelectedTeamId();

    if (!selectedTeamIdNum) {
        return <div className="p-8 text-center text-gray-500">팀을 선택해주세요.</div>;
    }

    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">경기 기록 로딩 중...</div>}>
            <MatchRecordManagementPanelInner teamId={selectedTeamIdNum} />
        </Suspense>
    );
}
