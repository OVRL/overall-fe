"use client";

import React, { useState, useMemo, useId } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, MoreVertical, AlertCircle, Plus, Save, RotateCcw, Menu, X } from "lucide-react";
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
    goals: number;
    assists: number;
    cleanSheets: number;
    mom: number;
    team: TeamType;
    isMercenary?: boolean;
    image?: string;
}

const POSITIONS: ('FW' | 'MF' | 'DF' | 'GK')[] = ["FW", "MF", "DF", "GK"];
const POS_ORDER: Record<string, number> = { "FW": 0, "MF": 1, "DF": 2, "GK": 3 };

// 22명의 더미 데이터 생성
const generateMockPlayers = (): InHousePlayer[] => {
    const players: InHousePlayer[] = [];
    const names = ["김시후", "박정현", "신유찬", "윤기현", "김병문", "이준호", "최민석", "정대만", "강백호", "서태웅", "송태섭", "채치수", "전호장", "이정환", "신준섭", "고민구", "성현준", "김수겸", "황태산", "윤대협", "안영수", "허태환"];
    
    for (let i = 0; i < 22; i++) {
        const pos = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
        players.push({
            id: String(i + 1),
            name: names[i] || `선수 ${i + 1}`,
            overall: Math.floor(Math.random() * (99 - 80 + 1)) + 80,
            age: Math.floor(Math.random() * (35 - 20 + 1)) + 20,
            position: pos,
            goals: pos === 'FW' || pos === 'MF' ? Math.floor(Math.random() * 15) : 0,
            assists: pos === 'FW' || pos === 'MF' ? Math.floor(Math.random() * 15) : 0,
            cleanSheets: pos === 'DF' || pos === 'GK' ? Math.floor(Math.random() * 12) : 0,
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

export default function InHouseMatchPanel({ onBack }: { onBack: () => void }) {
    const [players, setPlayers] = useState<InHousePlayer[]>(generateMockPlayers());
    const [selectedTeam, setSelectedTeam] = useState<TeamType>("ALL");
    const [matchMode, setMatchMode] = useState<MatchMode>("2WAY");
    const [viewMode, setViewMode] = useState<ViewMode>("LIST");
    const [sortBy, setSortBy] = useState<SortOption>("OVR");
    const [isDirty, setIsDirty] = useState(false);
    const [showTeamMenu, setShowTeamMenu] = useState(false);

    // DnD 관련 상태
    const dndId = useId();
    const [activePlayer, setActivePlayer] = useState<Player | null>(null);
    const [selectedDndPlayer, setSelectedDndPlayer] = useState<Player | null>(null);
    const [quarters, setQuarters] = useState<QuarterData[]>([
      { id: 1, type: "MATCHING", formation: "4-2-3-1", matchup: { home: "OVR" as any, away: "B" as any }, lineup: {} },
      { id: 2, type: "MATCHING", formation: "4-2-3-1", matchup: { home: "OVR" as any, away: "B" as any }, lineup: {} },
      { id: 3, type: "MATCHING", formation: "4-2-3-1", matchup: { home: "OVR" as any, away: "B" as any }, lineup: {} },
      { id: 4, type: "MATCHING", formation: "4-2-3-1", matchup: { home: "OVR" as any, away: "B" as any }, lineup: {} },
    ]);
    const [currentQuarterId, setCurrentQuarterId] = useState<number | null>(1);

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
            if (sortBy === "POS") return POS_ORDER[a.position] - POS_ORDER[b.position];
            if (sortBy === "AGE") return b.age - a.age;
            return 0;
        });
    }, [players, selectedTeam, sortBy]);

    const formationTeamPlayers = useMemo(() => {
        return players.filter(p => p.team === (selectedTeam === "ALL" ? "A" : selectedTeam)).map(p => ({
            id: Number(p.id), name: p.name, overall: p.overall, position: p.position === 'GK' ? 'GK' : 'ST', image: p.image
        } as Player));
    }, [players, selectedTeam]);

    const handleTeamChange = (playerId: string, team: TeamType) => {
        setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, team } : p));
        setIsDirty(true);
    };

    const handleAddPlayer = () => {
        const inputName = window.prompt("추가할 선수의 이름을 입력해 주세요", `뉴선수 ${players.length + 1}`);
        if (inputName === null) return;
        
        const name = inputName.trim() || `뉴선수 ${players.length + 1}`;
        const newId = String(Date.now());
        const pos = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
        const newPlayer: InHousePlayer = {
            id: newId,
            name: name,
            overall: 80 + Math.floor(Math.random() * 20),
            age: 20 + Math.floor(Math.random() * 15),
            position: pos,
            goals: 0, assists: 0, cleanSheets: 0, mom: 0,
            team: selectedTeam,
            isMercenary: true,
            image: "/images/player/img_player_2.webp"
        };
        setPlayers(prev => [...prev, newPlayer]);
        setIsDirty(true);
    };

    const handleTeamCardClick = (team: TeamType) => {
        setSelectedTeam(team);
        setViewMode(team === "ALL" ? "LIST" : "FORMATION");
    };

    const handleReassignSelectedPlayer = (toTeam: TeamType) => {
        if (!selectedDndPlayer) {
            alert("팀을 변경할 선수를 먼저 선택해 주세요.");
            return;
        }
        handleTeamChange(String(selectedDndPlayer.id), toTeam);
        setShowTeamMenu(false);
    };

    // --- DnD 핸들러 ---
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
            setQuarters(prev => prev.map(q => {
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
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-6 shrink-0 z-20">
                <button onClick={onBack} className="text-white hover:opacity-70 transition-opacity"><ChevronLeft size={28} /></button>
                <h1 className="text-xl font-bold text-white tracking-tight">진행 중 매치</h1>
                <div className="w-10" />
            </header>

            {/* Persistent Team Cards Section */}
            <div className="px-4 mb-4 z-20">
                <div className="flex items-center justify-between mb-3 min-h-[40px]">
                    <p className="text-[10px] text-gray-500 font-medium opacity-80">팀 카드를 눌러 포메이션을 편집하세요</p>
                    <button 
                        className="bg-[#333] text-gray-200 text-xs px-5 py-2.5 rounded-xl font-bold active:scale-95 transition-all shadow-lg border border-white/5 active:bg-[#444]"
                        onClick={() => setMatchMode(prev => prev === "2WAY" ? "3WAY" : "2WAY")}
                    >
                        {matchMode === "2WAY" ? "3파전으로 바꾸기" : "2파전으로 바꾸기"}
                    </button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { id: "ALL", color: "gray", label: "전체", sub: teamStats.ALL.avgOverall ? `아마추어${Math.floor(teamStats.ALL.avgOverall/20)}` : "준비중" },
                        { id: "A", color: "red", label: "A팀", sub: "비기너1" },
                        { id: "B", color: "yellow", label: "B팀", sub: "비기너1" }, 
                        ...(matchMode === "3WAY" ? [{ id: "C", color: "blue", label: "C팀", sub: "비기너1" }] : [])
                    ].map(t => (
                        <button 
                            key={t.id} 
                            onClick={() => handleTeamCardClick(t.id as TeamType)}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[88px] h-32 rounded-3xl transition-all border-2",
                                selectedTeam === t.id ? `bg-white/10 border-primary` : "bg-[#1a1a1a] border-transparent hover:bg-white/5"
                            )}
                        >
                            {t.id === "ALL" ? (
                                <div className="flex flex-col items-center">
                                    <span className="text-[11px] font-bold text-gray-500 mb-2">{t.label}</span>
                                    <span className="text-2xl font-black text-white">{teamStats[t.id as TeamType].count}명</span>
                                    <span className="text-[10px] text-gray-500 mt-1">{t.sub}</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <VestIcon color={t.id === "A" ? "#ef4444" : t.id === "B" ? "#eab308" : "#3b82f6"} className="mb-1" />
                                    <span className="text-xl font-black text-white">{teamStats[t.id as TeamType].count}명</span>
                                    <span className="text-[10px] text-gray-500 mt-0.5">{t.sub}</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {viewMode === "FORMATION" ? (
                    <div className="flex-1 overflow-hidden pb-32 relative">
                        <DndContext id={dndId} sensors={sensors} collisionDetection={customCollisionDetection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                            <div className="h-full flex flex-col lg:flex-row gap-4 px-4 pb-4">
                                <div className="flex-1 bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5 relative flex flex-col shadow-2xl">
                                    {/* Sub-Header in Formation View */}
                                    <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-md border-b border-white/5 z-30">
                                      <span className="text-[11px] font-bold text-primary px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                                        {selectedTeam}팀 포메이션 편집
                                      </span>
                                      <div className="relative">
                                        <button 
                                            onClick={() => setShowTeamMenu(!showTeamMenu)}
                                            className="p-2 text-gray-400 hover:text-white transition-all bg-white/5 rounded-full"
                                        >
                                            <Menu size={20} />
                                        </button>
                                        
                                        {showTeamMenu && (
                                            <div className="absolute right-0 top-12 w-48 bg-[#222] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden">
                                                <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 mb-1">
                                                    <span className="text-[10px] font-bold text-gray-500">팀 변경 (선택된 선수)</span>
                                                    <button onClick={() => setShowTeamMenu(false)}><X size={12} className="text-gray-500" /></button>
                                                </div>
                                                {(["A", "B", "C"] as TeamType[]).filter(t => t !== selectedTeam && (t !== "C" || matchMode === "3WAY")).map(team => (
                                                    <button 
                                                        key={team}
                                                        onClick={() => handleReassignSelectedPlayer(team)}
                                                        className="w-full text-left px-3 py-2.5 text-[11px] font-bold text-gray-300 hover:bg-white/5 rounded-xl transition-all flex items-center gap-2"
                                                    >
                                                        <span className={cn("w-2 h-2 rounded-full", team === "A" ? "bg-red-500" : team === "B" ? "bg-yellow-500" : "bg-blue-500")} />
                                                        {team}팀으로 바꾸기
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                      </div>
                                    </div>

                                    <FormationBoardList 
                                        quarters={quarters} selectedPlayer={selectedDndPlayer} setQuarters={setQuarters} 
                                        onPositionRemove={(qId, idx) => setQuarters(prev => prev.map(q => q.id === qId ? { ...q, lineup: Object.fromEntries(Object.entries(q.lineup).filter(([k]) => Number(k) !== idx)) } : q))} 
                                        currentQuarterId={currentQuarterId} setCurrentQuarterId={setCurrentQuarterId} 
                                    />
                                </div>
                                <FormationPlayerList 
                                    players={formationTeamPlayers}
                                    currentQuarterLineups={quarters.map(q => q.lineup || {})}
                                    selectedPlayer={selectedDndPlayer}
                                    onSelectPlayer={setSelectedDndPlayer}
                                    onAddPlayer={handleAddPlayer}
                                    className="w-full lg:w-80 h-full"
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
                    <div className="flex-1 flex flex-col overflow-y-auto pb-32">
                        {/* Summary Section */}
                        <div className="px-4 mb-4">
                            <div className="bg-[#fef2f2]/5 border border-red-900/20 rounded-2xl p-4 flex gap-3 shadow-sm items-start">
                                <AlertCircle className="text-yellow-600 shrink-0" size={20} />
                                <p className="text-[11px] leading-relaxed text-gray-400">
                                    플래버의 개인정보는 '원활한 매치 진행'을 목적으로 제공됩니다. <span className="text-red-500 font-bold">목적 외 사용</span>할 경우 법적 처벌을 받을 수 있습니다.
                                </p>
                            </div>
                        </div>

                        {/* Sorting & Action Bar */}
                        <div className="px-5 mb-4 flex items-center justify-between gap-3">
                            <div className="flex items-center bg-[#1a1a1a] p-1 rounded-xl border border-white/5">
                                {(["OVR", "POS", "AGE"] as SortOption[]).map(opt => (
                                    <button 
                                        key={opt}
                                        onClick={() => setSortBy(opt)}
                                        className={cn(
                                            "px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                                            sortBy === opt ? "bg-primary text-black shadow-lg" : "text-gray-500 hover:text-gray-300"
                                        )}
                                    >
                                        {opt === "OVR" ? "OVR순" : opt === "POS" ? "포지션" : "나이순"}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleAddPlayer}
                                className="bg-[#333] text-gray-100 text-xs px-5 py-2.5 rounded-xl font-bold active:scale-95 transition-all shadow-md border border-white/5 flex items-center gap-2"
                            >
                                <Plus size={14} /> 선수 추가
                            </button>
                        </div>

                        {/* Player List */}
                        <div className="flex flex-col divide-y divide-white/5 px-4 bg-[#111] rounded-t-[40px] pt-10 flex-1 shadow-[0_-40px_80px_rgba(0,0,0,0.8)] border-t border-white/5">
                            {filteredAndSortedPlayers.length > 0 ? (
                                filteredAndSortedPlayers.map((player) => (
                                    <div key={player.id} className="py-5 flex items-center justify-between group px-1">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base font-bold text-white tracking-tight">{player.name}</span>
                                                <span className="bg-[#222] text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/5">루키</span>
                                                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/20">데뷔</span>
                                                {player.isMercenary && <span className="text-red-400 text-[10px] font-bold ml-1">용병</span>}
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-500">
                                                <span className="text-gray-400">남자 · {player.position === 'FW' ? '공격적' : player.position === 'DF' ? '수비적' : '밸런스'} · {player.position === 'MF' ? '패스' : '슛'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <select 
                                                    className={cn(
                                                        "appearance-none text-[11px] font-bold px-6 py-2.5 rounded-2xl border transition-all cursor-pointer outline-none min-w-[100px]",
                                                        player.team === "ALL" ? "bg-[#222] text-gray-400 border-transparent" :
                                                        player.team === "A" ? "bg-red-500 text-white border-red-400" :
                                                        player.team === "B" ? "bg-yellow-500 text-black border-yellow-400" :
                                                        "bg-blue-500 text-white border-blue-400"
                                                    )}
                                                    value={player.team} onChange={(e) => handleTeamChange(player.id, e.target.value as TeamType)}
                                                >
                                                    <option value="ALL">미지정</option><option value="A">팀A</option><option value="B">팀B</option>{matchMode === "3WAY" && <option value="C">팀C</option>}
                                                </select>
                                            </div>
                                            <button className="p-2 text-gray-700 hover:text-white transition-colors"><MoreVertical size={18} /></button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-32 flex flex-col items-center justify-center text-gray-700 gap-4">
                                    <AlertCircle size={40} className="opacity-10" />
                                    <p className="text-sm font-bold opacity-30">선수가 없습니다.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Smart Save Bar */}
            <div className={cn(
                "fixed bottom-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-3xl border-t border-white/10 p-5 flex items-center justify-between px-8 md:px-16 transition-all duration-700",
                isDirty ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
            )}>
                <p className="text-xs font-bold text-white/80">변동사항 있음</p>
                <div className="flex gap-2">
                    <button onClick={() => setIsDirty(false)} className="px-6 py-2 rounded-2xl border border-white/10 text-white/40 text-xs font-bold hover:text-white transition-all"><RotateCcw size={14} /></button>
                    <button onClick={() => { setIsDirty(false); alert("저장됨"); }} className="px-8 py-2 rounded-2xl bg-primary text-black text-xs font-black shadow-xl shadow-primary/20 flex items-center gap-2"><Save size={14} /> 저장하기</button>
                </div>
            </div>
        </div>
    );
}
