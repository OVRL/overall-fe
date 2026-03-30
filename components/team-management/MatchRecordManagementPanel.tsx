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
    players: Player[];
}

const PlayerSelectModal = ({ isOpen, onClose, onSave, onSaveText, players }: PlayerSelectModalProps) => {
    const [mode, setMode] = useState<"SELECT" | "TEXT">("SELECT");
    const [textInput, setTextInput] = useState("");
    const [selectedGoal, setSelectedGoal] = useState<string>("none");
    const [selectedAssist, setSelectedAssist] = useState<string>("none");
    const [selectedPreAssist, setSelectedPreAssist] = useState<string>("none");

    // 텍스트 파싱 로직
    const parsedSummary = React.useMemo(() => {
        if (!textInput.trim()) return [];
        
        const lines = textInput.split(/\n| /); // 뉴라인이나 공백으로 분리
        let currentQuarter = 1;
        const results: (ScoreLog & { quarter: number })[] = [];

        const quarterRegex = /(\d+)[qQ]/;
        const goalRegex = /([^득점어시기점\s\n]+)득점/;
        const assistRegex = /([^득점어시기점\s\n]+)어시/;
        const preAssistRegex = /([^득점어시기점\s\n]+)기점/;

        textInput.split(/\n/).forEach(line => {
            const qMatch = line.match(quarterRegex);
            if (qMatch) {
                currentQuarter = parseInt(qMatch[1]);
            }

            const goalEvents = line.split(/(?=.+?득점)/);
            goalEvents.forEach(event => {
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
                                    <span className="text-[10px] text-primary/60 font-medium">예시: 1q 메시득점 호날두어시</span>
                                </div>
                                <textarea 
                                    className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-700"
                                    placeholder="입력 예시:&#10;1q&#10;메시득점호날두어시반날두기점"
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                />
                                {/* 선수 이름 힌트 (자동완성 느낌) */}
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                    {players.slice(0, 8).map(p => (
                                        <button 
                                            key={p.id}
                                            onClick={() => setTextInput(prev => prev + p.name)}
                                            className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                        >
                                            {p.name}
                                        </button>
                                    ))}
                                    <span className="text-[10px] text-gray-600 self-center ml-1">...클릭하여 이름 추가</span>
                                </div>
                            </div>

                            {parsedSummary.length > 0 && (
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">파싱 미리보기</label>
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
                        </div>
                    )}
                </div>

                <div className="p-6 flex gap-3">
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
                                                    <button 
                                                        onClick={() => {
                                                            if (confirm("수정하시겠습니까?")) {
                                                                // 수정 로직: 기존 데이터를 모달에 세팅하거나 별도 처리
                                                                // 현재는 단순 확인 후 모달 열기로 안내
                                                                setActiveMatchId(match.id);
                                                                setIsModalOpen(true);
                                                                // TODO: 선택된 로그의 데이터를 PlayerSelectModal에 전달하는 기능 필요
                                                            }
                                                        }}
                                                        className="text-gray-700 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 p-1"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
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
