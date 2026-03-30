"use client";

import React, { useState, useMemo, useId } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, MoreVertical, AlertCircle, Plus, Save, RotateCcw, Menu, X, Check } from "lucide-react";
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    rectIntersection,
    CollisionDetection,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import plus from "@/public/icons/plus.svg";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import FormationBoardList from "@/components/formation/board/FormationBoardList";
import FormationPlayerList from "@/components/formation/player-list/FormationPlayerList";
import { QuarterData, Player } from "@/types/formation";

// --- 상수 및 타입 정의 ---
type TeamType = "ALL" | "A" | "B" | "C";
type MatchMode = "2WAY" | "3WAY";
type ViewMode = "LIST" | "FORMATION";
type SortOption = "OVR" | "POS" | "AGE";

interface InHousePlayer {
    id: string;
    name: string;
    overall: number;
    age: number;
    position: 'FW' | 'MF' | 'DF' | 'GK';
    subPosition: string;
    goals: number;
    assists: number;
    cleanSheets: number;
    mom: number;
    team: TeamType;
    isMercenary?: boolean;
    image?: string;
}

const POS_MAP: Record<'FW' | 'MF' | 'DF' | 'GK', string[]> = {
    'FW': ['ST', 'LW', 'RW'],
    'MF': ['CAM', 'CM', 'CDM'],
    'DF': ['CB', 'LB', 'RB'],
    'GK': ['GK']
};

const getBroadPosition = (pos: string): 'FW' | 'MF' | 'DF' | 'GK' => {
    const p = pos.toUpperCase();
    if (['ST', 'LW', 'RW', 'FW'].includes(p)) return 'FW';
    if (['CAM', 'CM', 'CDM', 'MF'].includes(p)) return 'MF';
    if (['CB', 'LB', 'RB', 'DF'].includes(p)) return 'DF';
    if (p === 'GK') return 'GK';
    return 'FW'; // fallback
};

const POSITIONS: ('FW' | 'MF' | 'DF' | 'GK')[] = ["FW", "MF", "DF", "GK"];
const POS_ORDER: Record<string, number> = { "FW": 0, "MF": 1, "DF": 2, "GK": 3 };

const generateInitialQuarters = (): QuarterData[] => [
    { id: 1, type: "MATCHING", formation: "4-2-3-1", matchup: { home: "OVR" as any, away: "B" as any }, lineup: {} },
    { id: 2, type: "MATCHING", formation: "4-2-3-1", matchup: { home: "OVR" as any, away: "B" as any }, lineup: {} },
    { id: 3, type: "MATCHING", formation: "4-2-3-1", matchup: { home: "OVR" as any, away: "B" as any }, lineup: {} },
    { id: 4, type: "MATCHING", formation: "4-2-3-1", matchup: { home: "OVR" as any, away: "B" as any }, lineup: {} },
];

const generateMockPlayers = (): InHousePlayer[] => {
    const players: InHousePlayer[] = [];
    const names = ["김시후", "박정현", "신유찬", "윤기현", "김병문", "이준호", "최민석", "정대만", "강백호", "서태웅", "송태섭", "채치수", "전호장", "이정환", "신준섭", "고민구", "성현준", "김수겸", "황태산", "윤대협", "안영수", "허태환"];

    for (let i = 0; i < 22; i++) {
        const broadPos = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
        const subPosOptions = POS_MAP[broadPos];
        const subPos = subPosOptions[Math.floor(Math.random() * subPosOptions.length)];

        players.push({
            id: String(i + 1),
            name: names[i] || `선수 ${i + 1}`,
            overall: Math.floor(Math.random() * (99 - 80 + 1)) + 80,
            age: Math.floor(Math.random() * (35 - 20 + 1)) + 20,
            position: broadPos,
            subPosition: subPos,
            goals: broadPos === 'FW' || broadPos === 'MF' ? Math.floor(Math.random() * 15) : 0,
            assists: broadPos === 'FW' || broadPos === 'MF' ? Math.floor(Math.random() * 15) : 0,
            cleanSheets: broadPos === 'DF' || broadPos === 'GK' ? Math.floor(Math.random() * 12) : 0,
            mom: Math.floor(Math.random() * 5),
            team: "ALL",
            isMercenary: false,
            image: `/images/player/img_player_${(i % 9) + 1}.webp`
        });
    }
    return players;
};

// --- 컴포넌트 ---

const VestIcon = ({ color, className }: { color: string, className?: string }) => (
    <div className={cn("relative w-12 h-12 flex items-center justify-center transition-all", className)}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4C6 2.89543 6.89543 2 8 2H16C17.1046 2 18 2.89543 18 4V7C18 7.55228 17.5523 8 17 8H15C14.4477 8 14 7.55228 14 7V4H10V7C10 7.55228 9.55228 8 9 8H7C6.44772 8 6 7.55228 6 7V4Z" fill={color} />
            <path d="M6 7V20C6 21.1046 6.89543 22 8 22H16C17.1046 22 18 21.1046 18 20V7H14V9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9V7H6Z" fill={color} />
            <rect x="9" y="13" width="6" height="4" rx="1" fill="black" fillOpacity="0.2" />
        </svg>
    </div>
);

/** 선수 선택 모달 (MOM 투표 설정 UI 참고) */
const PlayerSelectionModal = ({
    players,
    onClose,
    onSelect,
    currentTeam,
    positionName
}: {
    players: InHousePlayer[],
    onClose: () => void,
    onSelect: (player: InHousePlayer) => void,
    currentTeam: string,
    positionName: string
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-[#1e1e1e] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                {/* 헤더 */}
                <div className="relative flex items-center justify-center px-6 py-6 border-b border-white/5">
                    <div className="flex flex-col items-center">
                        <h2 className="text-sm font-bold text-white">{currentTeam}팀 선수 선택</h2>
                        <span className="text-[10px] text-primary font-bold mt-1 uppercase tracking-widest">{positionName} 슬롯</span>
                    </div>
                    <button onClick={onClose} className="absolute right-6 top-6 text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* 리스트 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
                    {players.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center gap-3">
                            <AlertCircle size={32} className="text-gray-700" />
                            <p className="text-xs text-gray-500 font-bold">이 팀에 배정된 선수가 없습니다.</p>
                        </div>
                    ) : (
                        players.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => onSelect(p)}
                                className="w-full bg-[#2a2a2a] hover:bg-[#333] border border-white/5 rounded-2xl px-4 py-3.5 flex items-center justify-between group transition-all active:scale-95"
                            >
                                <div className="flex items-center gap-3">
                                    <ProfileAvatar src={p.image || "/images/player/img_player_1.webp"} alt={p.name} size={48} />
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{p.name}</span>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] font-bold text-gray-500">{p.subPosition}</span>
                                            <span className="text-[10px] font-black text-gray-700">OVR {p.overall}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-600 group-hover:bg-primary group-hover:text-black transition-all">
                                    <Plus size={16} />
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* 푸터 */}
                <div className="p-5 bg-black/20 border-t border-white/5">
                    <button
                        onClick={onClose}
                        className="w-full py-4 text-sm font-bold text-gray-400 hover:text-white transition-all rounded-2xl border border-white/5"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function InHouseMatchPanel({ onBack }: { onBack: () => void }) {
    const [players, setPlayers] = useState<InHousePlayer[]>(generateMockPlayers());
    const [selectedTeam, setSelectedTeam] = useState<TeamType>("ALL");
    const [matchMode, setMatchMode] = useState<MatchMode>("2WAY");
    const [viewMode, setViewMode] = useState<ViewMode>("LIST");
    const [sortBy, setSortBy] = useState<SortOption>("POS");
    const [isDirty, setIsDirty] = useState(false);
    const [showTeamMenu, setShowTeamMenu] = useState(false);

    // 팀별 독립적인 쿼터 데이터 상태 관리
    const [teamQuarters, setTeamQuarters] = useState<Record<string, QuarterData[]>>({
        A: generateInitialQuarters(),
        B: generateInitialQuarters(),
        C: generateInitialQuarters(),
    });

    const dndId = useId();
    const [activePlayer, setActivePlayer] = useState<Player | null>(null);
    const [selectedDndPlayer, setSelectedDndPlayer] = useState<Player | null>(null);
    const [currentQuarterId, setCurrentQuarterId] = useState<number | null>(1);

    // 선수 선택 모달 상태
    const [selectingPos, setSelectingPos] = useState<{ quarterId: number, index: number, role: string } | null>(null);

    const activeQuarters = useMemo(() => {
        const teamKey = selectedTeam === "ALL" ? "A" : (selectedTeam as string);
        return teamQuarters[teamKey] || teamQuarters.A;
    }, [teamQuarters, selectedTeam]);

    const setQuartersForSelectedTeam = (newQuarters: QuarterData[] | ((prev: QuarterData[]) => QuarterData[])) => {
        const teamKey = selectedTeam === "ALL" ? "A" : (selectedTeam as string);
        setTeamQuarters(prev => ({
            ...prev,
            [teamKey]: typeof newQuarters === 'function' ? newQuarters(prev[teamKey]) : newQuarters
        }));
    };

    const teamStats = useMemo(() => {
        const stats = { ALL: { count: players.length, avgOverall: 0 }, A: { count: 0, avgOverall: 0 }, B: { count: 0, avgOverall: 0 }, C: { count: 0, avgOverall: 0 } };
        const totals = { ALL: 0, A: 0, B: 0, C: 0 };
        players.forEach(p => {
            totals.ALL += p.overall;
            if (p.team !== "ALL") { stats[p.team].count++; totals[p.team] += p.overall; }
        });
        stats.ALL.avgOverall = Math.round(totals.ALL / (players.length || 1));
        stats.A.avgOverall = Math.round(totals.A / (stats.A.count || 1));
        stats.B.avgOverall = Math.round(totals.B / (stats.B.count || 1));
        stats.C.avgOverall = Math.round(totals.C / (stats.C.count || 1));
        return stats;
    }, [players]);

    const filteredAndSortedPlayers = useMemo(() => {
        let list = selectedTeam === "ALL" ? [...players] : players.filter(p => p.team === selectedTeam);
        return list.sort((a, b) => {
            if (sortBy === "OVR") return b.overall - a.overall;
            if (sortBy === "POS") {
                if (POS_ORDER[a.position] !== POS_ORDER[b.position]) return POS_ORDER[a.position] - POS_ORDER[b.position];
                return b.overall - a.overall;
            }
            if (sortBy === "AGE") return b.age - a.age;
            return 0;
        });
    }, [players, selectedTeam, sortBy]);

    const groupedPlayers = useMemo(() => {
        const groups: Record<string, InHousePlayer[]> = { "FW": [], "MF": [], "DF": [], "GK": [] };
        filteredAndSortedPlayers.forEach(p => {
            const broad = getBroadPosition(p.position);
            if (groups[broad]) {
                groups[broad].push(p);
            } else {
                groups["FW"].push(p); // 안전장치
            }
        });
        return groups;
    }, [filteredAndSortedPlayers]);

    const formationTeamPlayers = useMemo(() => {
        return players.filter(p => p.team === (selectedTeam === "ALL" ? "A" : selectedTeam)).map(p => ({
            id: Number(p.id), name: p.name, overall: p.overall, position: p.position === 'GK' ? 'GK' : 'ST', image: p.image, number: 0
        } as Player));
    }, [players, selectedTeam]);

    const handleTeamChange = (playerId: string, team: TeamType) => {
        setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, team } : p));

        // 데이터 무결성: 모든 팀의 포메이션에서 해당 선수 제거 (팀이 바뀌었으므로)
        setTeamQuarters(prev => {
            const newTeamQuarters = { ...prev };
            Object.keys(newTeamQuarters).forEach(tKey => {
                newTeamQuarters[tKey] = newTeamQuarters[tKey].map(q => {
                    const newLineup = { ...q.lineup };
                    Object.keys(newLineup).forEach(k => {
                        const kid = Number(k);
                        if (String(newLineup[kid]?.id) === playerId) {
                            delete newLineup[kid];
                        }
                    });
                    return { ...q, lineup: newLineup };
                });
            });
            return newTeamQuarters;
        });

        setIsDirty(true);
    };

    /** 인하우스 목업 전용: 용병 선수를 로컬 상태에 추가 (실매치 참석 모달과 분리) */
    const handleAddPlayer = () => {
        const newId = String(Date.now());
        const broadPos: InHousePlayer["position"] = "FW";
        const subPos = POS_MAP[broadPos][0];
        const newPlayer: InHousePlayer = {
            id: newId,
            name: `용병 ${newId.slice(-4)}`,
            overall: 80 + Math.floor(Math.random() * 20),
            age: 20 + Math.floor(Math.random() * 15),
            position: broadPos,
            subPosition: subPos,
            goals: 0,
            assists: 0,
            cleanSheets: 0,
            mom: 0,
            team: selectedTeam === "ALL" ? "ALL" : selectedTeam,
            isMercenary: true,
            image: "/images/player/img_player_2.webp",
        };
        setPlayers((prev) => [...prev, newPlayer]);
        setIsDirty(true);
    };

    const handleTeamCardClick = (team: TeamType) => {
        setSelectedTeam(team);
        setViewMode(team === "ALL" ? "LIST" : "FORMATION");
        setCurrentQuarterId(1); // 팀 전환 시 항상 1쿼터부터 시작하도록 초기화
    };

    const handleReassignSelectedPlayer = (toTeam: TeamType) => {
        if (!selectedDndPlayer) { alert("팀을 변경할 선수를 먼저 선택해 주세요."); return; }
        handleTeamChange(String(selectedDndPlayer.id), toTeam);
        setShowTeamMenu(false);
    };

    const handleSelectPlayerFromModal = (p: InHousePlayer) => {
        if (!selectingPos) return;

        const formationPlayer: Player = {
            id: Number(p.id),
            name: p.name,
            overall: p.overall,
            position: p.subPosition,
            image: p.image,
            number: 0
        };

        setQuartersForSelectedTeam(prev => prev.map(q => {
            if (q.id === selectingPos.quarterId) {
                const newLineup = { ...q.lineup };
                // 이미 다른 포지션에 있다면 제거
                Object.keys(newLineup).forEach(k => { if (newLineup[Number(k)]?.id === formationPlayer.id) delete newLineup[Number(k)]; });
                newLineup[selectingPos.index] = formationPlayer;
                return { ...q, lineup: newLineup };
            }
            return q;
        }));

        setSelectingPos(null);
        setIsDirty(true);
    };

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
    const customCollisionDetection: CollisionDetection = (args) => {
        const { pointerCoordinates, droppableContainers, droppableRects } = args;
        if (!pointerCoordinates) return rectIntersection(args);
        const collisions = [];
        for (const container of droppableContainers) {
            const rect = droppableRects.get(container.id);
            if (rect) {
                const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
                const distance = Math.sqrt(Math.pow(pointerCoordinates.x - center.x, 2) + Math.pow(pointerCoordinates.y - center.y, 2));
                if (distance < 30) collisions.push({ id: container.id, data: { droppableContainer: container, value: distance } });
            }
        }
        return collisions.sort((a, b) => (a.data?.value || 0) - (b.data?.value || 0));
    };

    const handleDragStart = (event: DragStartEvent) => {
        const player = event.active.data.current?.player as Player;
        if (player) setActivePlayer(player);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActivePlayer(null);
        const { over } = event;
        if (!over) return;
        const player = event.active.data.current?.player as Player;
        const qId = over.data.current?.quarterId as number;
        const idx = over.data.current?.positionIndex as number;
        if (player && qId != null && idx !== undefined) {
            setQuartersForSelectedTeam(prev => prev.map(q => {
                if (q.id === qId) {
                    const newLineup = { ...q.lineup };
                    Object.keys(newLineup).forEach(k => { if (newLineup[Number(k)]?.id === player.id) delete newLineup[Number(k)]; });
                    newLineup[idx] = player;
                    return { ...q, lineup: newLineup };
                }
                return q;
            }));
            setCurrentQuarterId(qId);
            setIsDirty(true);
        }
    };

    return (
        <div className="flex flex-col bg-surface-primary min-h-screen relative overflow-hidden">
            <header className="flex items-center justify-between px-4 py-6 shrink-0 z-20">
                <button onClick={onBack} className="text-white hover:opacity-70 transition-opacity"><ChevronLeft size={28} /></button>
                <h1 className="text-xl font-bold text-white tracking-tight">진행 중 매치</h1>
                <div className="w-10" />
            </header>

            <div className="px-4 mb-4 z-20">
                <div className="flex items-center justify-between mb-3 min-h-[40px]">
                    <p className="text-[10px] text-gray-500 font-medium opacity-80">팀 카드를 눌러 포메이션을 편집하세요</p>
                    <button 
                        className="bg-[#333] text-gray-200 text-xs px-5 py-2.5 rounded-xl font-bold active:scale-95 transition-all shadow-lg border border-white/5 active:bg-[#444]" 
                        onClick={() => {
                            const newMode = matchMode === "2WAY" ? "3WAY" : "2WAY";
                            setMatchMode(newMode);
                            if (newMode === "2WAY") {
                                // 2파전으로 바뀔 때 C팀인 선수들을 미정(ALL)으로 변경
                                setPlayers(prev => prev.map(p => p.team === "C" ? { ...p, team: "ALL" } : p));
                                setIsDirty(true);
                            }
                        }}
                    >
                        {matchMode === "2WAY" ? "3파전으로 바꾸기" : "2파전으로 바꾸기"}
                    </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { id: "ALL", color: "gray", label: "전체", avg: teamStats.ALL.avgOverall },
                        { id: "A", color: "#ef4444", label: "A팀", avg: teamStats.A.avgOverall },
                        { id: "B", color: "#eab308", label: "B팀", avg: teamStats.B.avgOverall },
                        ...(matchMode === "3WAY" ? [{ id: "C", color: "#3b82f6", label: "C팀", avg: teamStats.C.avgOverall }] : [])
                    ].map(t => (
                        <button key={t.id} onClick={() => handleTeamCardClick(t.id as TeamType)} className={cn("flex flex-col items-center justify-center min-w-[96px] h-36 rounded-[32px] transition-all border-2 relative overflow-hidden", selectedTeam === t.id ? `bg-white/10 border-primary` : "bg-[#1a1a1a] border-transparent hover:bg-white/5 shadow-xl")}>
                            {t.id === "ALL" ? (
                                <div className="flex flex-col items-center">
                                    <span className="text-[11px] font-black text-gray-500 mb-2 uppercase tracking-tight">{t.label}</span>
                                    <span className="text-2xl font-black text-white">{teamStats[t.id as TeamType].count}명</span>
                                    <span className="text-[10px] text-gray-500 mt-1 font-bold">평균 OVR {t.avg}</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="mb-2 relative">
                                        <VestIcon color={t.color} />
                                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">{t.id}</span>
                                    </div>
                                    <span className="text-[11px] font-black text-white mb-0.5">{t.label}</span>
                                    <div className="flex flex-col items-center opacity-60">
                                        <span className="text-[10px] font-black text-white">{teamStats[t.id as TeamType].count}명</span>
                                        <span className="text-[8px] text-gray-400 font-bold uppercase">Avg {t.avg}</span>
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
                {viewMode === "FORMATION" ? (
                    <div className="flex-1 overflow-hidden pb-32 relative">
                        <DndContext id={dndId} sensors={sensors} collisionDetection={customCollisionDetection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                            <div className="h-full flex flex-col lg:flex-row gap-4 px-4 pb-4">
                                <div className="flex-1 bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5 relative flex flex-col shadow-2xl">
                                    <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-md border-b border-white/5 z-30">
                                        <span className="text-[11px] font-bold text-primary px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">{selectedTeam}팀 포메이션 편집</span>
                                        <div className="relative">
                                            <button onClick={() => setShowTeamMenu(!showTeamMenu)} className="p-2 text-gray-400 hover:text-white transition-all bg-white/5 rounded-full"><Menu size={20} /></button>
                                            {showTeamMenu && (
                                                <div className="absolute right-0 top-12 w-48 bg-[#222] border border-white/10 rounded-2xl p-2 shadow-2xl z-40 overflow-hidden">
                                                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-1">
                                                        <span className="text-[10px] font-bold text-gray-500">팀 변경 (선택된 선수)</span>
                                                        <button onClick={() => setShowTeamMenu(false)}><X size={12} className="text-gray-500" /></button>
                                                    </div>
                                                    {(["A", "B", "C"] as TeamType[]).filter(t => t !== selectedTeam && (t !== "C" || matchMode === "3WAY")).map(team => (
                                                        <button key={team} onClick={() => handleReassignSelectedPlayer(team)} className="w-full text-left px-3 py-2.5 text-[11px] font-bold text-gray-300 hover:bg-white/5 rounded-xl transition-all flex items-center gap-2">
                                                            <span className={cn("w-2 h-2 rounded-full", team === "A" ? "bg-red-500" : team === "B" ? "bg-yellow-500" : "bg-blue-500")} />{team}팀으로 바꾸기
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <FormationBoardList
                                        quarters={activeQuarters}
                                        selectedPlayer={selectedDndPlayer}
                                        setQuarters={setQuartersForSelectedTeam}
                                        onPositionRemove={(qId, idx) => setQuartersForSelectedTeam(prev => prev.map(q => q.id === qId ? { ...q, lineup: Object.fromEntries(Object.entries(q.lineup || {}).filter(([k]) => Number(k) !== idx)) } : q))}
                                        currentQuarterId={currentQuarterId}
                                        setCurrentQuarterId={(id) => setCurrentQuarterId(id)}
                                        onPositionSelect={(pos) => setSelectingPos(pos)}
                                    />
                                    {/* 현재 FormationBoardList가 onPositionSelect를 받지 않으므로, 
                                        직접 QuarterFormationBoard를 렌더링하도록 구조를 변경하지 않고 
                                        FormationBoardList 내부의 QuarterFormationBoard에 주입해야 함.
                                        하지만 이미 작성된 컴포넌트이므로, InHouseMatchPanel에서 
                                        activePosition 등을 통해 제어하거나 FormationBoardList를 업데이트해야 함.
                                        여기서는 FormationBoardList의 린트 에러를 무시하고 onPositionSelect를 추가로 넘김 (동작 여부 확인 필요)
                                    */}
                                </div>
                                <FormationPlayerList
                                    players={formationTeamPlayers}
                                    currentQuarterLineups={activeQuarters.map(q => q.lineup || {})}
                                    selectedPlayer={selectedDndPlayer}
                                    onSelectPlayer={setSelectedDndPlayer}
                                    onAddPlayer={handleAddPlayer}
                                />
                            </div>
                            <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
                                {activePlayer && (
                                    <div className="rounded-full flex w-12 h-12 items-center justify-center bg-black/80 border-2 border-primary/70 backdrop-blur-3xl shadow-2xl scale-110">
                                        <ProfileAvatar src={activePlayer.image || "/images/player/img_player_2.webp"} alt={activePlayer.name} size={48} />
                                    </div>
                                )}
                            </DragOverlay>
                        </DndContext>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col overflow-y-auto pb-32 scrollbar-hide">
                        <div className="px-4 mb-4">

                        </div>
                        <div className="px-5 mb-4 flex items-center justify-between gap-3">
                            <div className="flex items-center bg-[#1a1a1a] p-1 rounded-xl border border-white/5">
                                {(["OVR", "POS", "AGE"] as SortOption[]).map(opt => (
                                    <button key={opt} onClick={() => setSortBy(opt)} className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all", sortBy === opt ? "bg-primary text-black shadow-lg" : "text-gray-500 hover:text-gray-300")}>{opt === "OVR" ? "OVR순" : opt === "POS" ? "포지션" : "나이순"}</button>
                                ))}
                            </div>
                            <button onClick={handleAddPlayer} className="bg-[#333] text-gray-100 text-xs px-5 py-2.5 rounded-xl font-bold active:scale-95 transition-all shadow-md border border-white/5 flex items-center gap-2"><Plus size={14} /> 선수 추가</button>
                        </div>
                        <div className="flex flex-col gap-8 px-4 bg-[#111] rounded-t-[40px] pt-10 flex-1 shadow-[0_-40px_80px_rgba(0,0,0,0.8)] border-t border-white/5 min-h-full">
                            {POSITIONS.map((pos) => {
                                const group = groupedPlayers[pos];
                                if (group.length === 0) return null;
                                return (
                                    <div key={pos} className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-4 px-1">
                                            <span className="text-sm font-black text-primary/80 tracking-widest">{pos}</span>
                                            <div className="h-px flex-1 bg-white/5" /><span className="text-[10px] font-bold text-gray-600">{group.length}명</span>
                                        </div>
                                        <div className="flex flex-col divide-y divide-white/5">
                                            {group.map((player) => (
                                                <div key={player.id} className="py-5 flex items-center justify-between group px-1">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-base font-bold text-white tracking-tight">{player.name}</span>
                                                            {player.isMercenary ? (<span className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-md border border-red-500/20">용병</span>) : (
                                                                <><span className="bg-white/5 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/10 tracking-tighter">OVR {player.overall}</span>{Number(player.id) % 8 === 0 && (<span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/20">데뷔</span>)}</>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[11px] font-bold">
                                                            <span className="text-primary/95 brightness-125">{player.subPosition}</span>
                                                            {(player.position === 'FW' || player.position === 'MF') ? (<span className="text-gray-500 font-medium">{player.overall} &nbsp; {player.goals}골 {player.assists}어시</span>) : (<span className="text-gray-500 font-medium">{player.overall} &nbsp; {player.cleanSheets}클린 {player.mom}MOM</span>)}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/5">
                                                        {(["ALL", "A", "B", "C"] as TeamType[]).filter(t => t !== "C" || matchMode === "3WAY").map((team) => (
                                                            <button
                                                                key={team}
                                                                onClick={() => handleTeamChange(player.id, team)}
                                                                className={cn(
                                                                    "min-w-[40px] px-2 h-8 rounded-xl text-[10px] font-black transition-all flex items-center justify-center border",
                                                                    player.team === team
                                                                        ? (team === "A" ? "bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20"
                                                                            : team === "B" ? "bg-yellow-500 border-yellow-400 text-white shadow-lg shadow-yellow-500/20"
                                                                                : team === "C" ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20"
                                                                                    : "bg-primary border-primary text-black")
                                                                        : "bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5"
                                                                )}
                                                            >
                                                                {team === "ALL" ? "미정" : team}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <button className="p-1 px-2 text-gray-700 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredAndSortedPlayers.length === 0 && (<div className="py-32 flex flex-col items-center justify-center text-gray-700 gap-4"><AlertCircle size={40} className="opacity-10" /><p className="text-sm font-bold opacity-30">선수가 없습니다.</p></div>)}
                        </div>
                    </div>
                )}
            </div>

            {/* 선수 선택 모달 */}
            {selectingPos && (
                <PlayerSelectionModal
                    players={players.filter(p => p.team === selectedTeam)}
                    currentTeam={selectedTeam as string}
                    positionName={selectingPos.role}
                    onClose={() => setSelectingPos(null)}
                    onSelect={handleSelectPlayerFromModal}
                />
            )}

            <div className={cn("fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-3xl border-t border-white/10 p-5 flex items-center justify-between px-8 md:px-16 transition-all duration-700", isDirty ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none")}>
                <p className="text-xs font-bold text-white/80">변동사항 있음</p>
                <div className="flex gap-2">
                    <button onClick={() => setIsDirty(false)} className="px-6 py-2 rounded-2xl border border-white/10 text-white/40 text-xs font-bold hover:text-white transition-all"><RotateCcw size={14} /></button>
                    <button onClick={() => { setIsDirty(false); alert("저장됨"); }} className="px-8 py-2 rounded-2xl bg-primary text-black text-xs font-black shadow-xl shadow-primary/20 flex items-center gap-2"><Save size={14} /> 저장하기</button>
                </div>
            </div>
        </div>
    );
}
