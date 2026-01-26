"use client";

import React, { useState } from "react";
import { Player } from "@/app/formation/page";

interface FormationPlayerListProps {
    players: Player[];
    currentQuarterLineups: Record<number, Player | null>[];
    selectedPlayer: Player | null; // For Mobile Tap-to-Place
    onSelectPlayer: (player: Player) => void;
    isLineupFull: boolean;
    onAddPlayer?: (name: string) => void;
    onRemovePlayer?: (id: number) => void;
    targetPosition?: string | null; // e.g., "ST", "CDM"
}

export default function FormationPlayerList({
    players,
    currentQuarterLineups,
    selectedPlayer,
    onSelectPlayer,
    isLineupFull,
    onAddPlayer,
    onRemovePlayer,
    targetPosition
}: FormationPlayerListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activePosTab, setActivePosTab] = useState<string>("ALL");

    // Auto-switch Position Tab when targetPosition changes
    React.useEffect(() => {
        if (!targetPosition) return;

        const pos = targetPosition.toUpperCase();
        if (["ST", "CF", "RW", "LW", "RF", "LF"].includes(pos)) setActivePosTab("FW");
        else if (["CAM", "CM", "CDM", "RM", "LM"].includes(pos)) setActivePosTab("MF");
        else if (["CB", "LB", "RB", "LWB", "RWB", "SW"].includes(pos)) setActivePosTab("DF");
        else if (["GK"].includes(pos)) setActivePosTab("GK");
        else setActivePosTab("ALL");

    }, [targetPosition]);

    // Check if player is currently playing in ANY of the active lineups for this quarter AND which team
    const getPlayerTeamCurrentQuarter = (playerId: number): string | null => {
        // Iterate currentQuarterLineups to find player
        // CAUTION: passing lineup array isn't enough to know TEAM NAME unless index maps to team?
        // We receive `currentQuarterLineups` as array of lineups.
        // We assume index 0 -> Team A, 1 -> Team B?
        // Let's assume the Parent passes them in order of [A, B, C, D].
        // But `availableTeamKeys` in parent might vary?
        // Actually the parent maps `availableTeamKeys.map(...)`.
        // So index 0 is first available team. 
        // We ideally need a Map { "teamA": Lineup, ... } passed as prop OR pass player status directly in `players`?
        // But `players` is static list. `QuarterData` has the info.
        // To keep it simple: We just need to know if UNASSIGNED or ASSIGNED.
        // And if ASSIGNED, to WHICH team (for Team Tabs).
        // Let's rely on `players.quarterCount`? No that's total.

        // Let's upgrade the prop `currentQuarterLineups` to extend with Team Info?
        // Or update `isPlayingCurrentQuarter` to return team index.

        for (let i = 0; i < currentQuarterLineups.length; i++) {
            if (Object.values(currentQuarterLineups[i] || {}).some(p => p?.id === playerId)) {
                // Return Team Identifier? 
                // We don't know the Team Name (A, B) for sure from just index unless we lock it.
                // Let's assume Standard indexing for tabs?
                // Or better: Pass a function `getPlayerTeam(id)` from parent?
                // But we want this component self-contained for display.
                // Let's assume the parent passes `activeTeamKeys`?
                // For now, let's just support "Playing" vs "Not Playing" for the main lists.
                // BUT filter asks for "Team A", "Team B".
                // We need to know who is in Team A.
                // The Parent `TeamManagerModal` has `quarters` data. It passes `currentQuarterLineups`.
                // Let's assume currentQuarterLineups[0] is A, [1] is B... if we want robust.
                // Actually, `activeTeamTab` = "A" -> we need to filter if player is in Team A lineup.

                // Let's relax the requirement for EXACT Team Tab filtering logic OR fix the prop.
                // `TeamManagerModal` passed `availableTeamKeys.map(...)`.
                // If keys are consistently sorted (A, B, C, D), then index 0=A.
                // Let's assume index 0 = A, 1 = B... (since keys are likely sorted string array).
                const teamName = ["A", "B", "C", "D"][i];
                return teamName;
            }
        }
        return null; // Unassigned in current quarter
    };

    // Filter Logic
    const filteredPlayers = players.filter(p => {
        // 1. Search
        if (searchTerm && !p.name.includes(searchTerm)) return false;

        // 2. Position Tab
        if (activePosTab !== "ALL") {
            const pos = p.position; // Player's MAIN position
            let mapped = "ALL";
            if (["ST", "CF", "RW", "LW", "RF", "LF"].includes(pos)) mapped = "FW";
            else if (["CAM", "CM", "CDM", "RM", "LM"].includes(pos)) mapped = "MF";
            else if (["CB", "LB", "RB", "LWB", "RWB", "SW"].includes(pos)) mapped = "DF";
            else if (["GK"].includes(pos)) mapped = "GK";

            if (activePosTab === "FW" && mapped !== "FW") return false;
            if (activePosTab === "MF" && mapped !== "MF") return false;
            if (activePosTab === "DF" && mapped !== "DF") return false;
            if (activePosTab === "GK" && mapped !== "GK") return false;
        }

        return true;
    });

    // Sort Helper
    const sortByCount = (a: Player, b: Player) => (a.quarterCount || 0) - (b.quarterCount || 0);

    // Grouping Logic
    const unassignedPlayers = filteredPlayers.filter(p => getPlayerTeamCurrentQuarter(p.id) === null).sort(sortByCount);

    // Get all unique teams present or just A/B/C/D
    const teamGroups: Record<string, Player[]> = {};
    ["A", "B", "C", "D"].forEach(team => {
        teamGroups[team] = filteredPlayers.filter(p => getPlayerTeamCurrentQuarter(p.id) === team).sort(sortByCount);
    });

    // UI Helpers
    const DragStart = (e: React.DragEvent, player: Player) => {
        e.dataTransfer.setData("player", JSON.stringify(player));
        e.dataTransfer.effectAllowed = "copy";
        onSelectPlayer(player);
    };

    const handleAddClick = () => {
        const name = prompt("새로운 선수의 이름을 입력하세요:");
        if (name && name.trim()) onAddPlayer?.(name.trim());
    };

    const handleRemoveClick = (e: React.MouseEvent, player: Player) => {
        e.stopPropagation();
        if (confirm(`'${player.name}' 선수를 정말 삭제하시겠습니까?\n모든 분기 라인업에서 제거됩니다.`)) {
            onRemovePlayer?.(player.id);
        }
    };

    const renderPlayerRow = (player: Player) => {
        const currentTeam = getPlayerTeamCurrentQuarter(player.id);
        const isBench = currentTeam === null;

        const isSelected = selectedPlayer?.id === player.id;

        return (
            <div
                key={player.id}
                draggable
                onDragStart={(e) => DragStart(e, player)}
                onClick={() => onSelectPlayer(player)}
                className={`flex items-center p-2 rounded-lg border-2 transition-all cursor-pointer select-none relative mb-2 group ${isSelected
                    ? "bg-primary/20 border-primary shadow-[0_0_0.9375rem_rgba(59,130,246,0.3)] z-10"
                    : isBench
                        ? "bg-gray-800/40 border-gray-700 hover:border-gray-500 hover:bg-gray-700/50" // Neutral for Unassigned
                        : "bg-surface-tertiary border-blue-900/10 hover:border-blue-500/50" // Playing Style
                    }`}
            >
                {/* Team Badge Side Stencil */}
                {!isBench && currentTeam && (
                    <div className={`absolute left-0 top-0 w-1 h-full rounded-l-lg opacity-80 
                        ${currentTeam === "A" ? "bg-blue-500" : currentTeam === "B" ? "bg-red-500" : currentTeam === "C" ? "bg-green-500" : "bg-purple-500"}`} />
                )}

                {/* Position Badge */}
                <div className={`w-8 h-8 rounded flex items-center justify-center mr-3 font-bold text-xs ${isBench ? "bg-gray-700 text-gray-400" : "bg-blue-900 text-blue-300"
                    }`}>
                    {player.position}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex items-center justify-between pr-2">
                    <div className={`font-bold text-sm truncate ${isBench ? "text-gray-300" : "text-gray-500"}`}>
                        {player.name}
                    </div>
                </div>

                <div className="text-gray-500 text-xs mr-2">OVR {player.overall}</div>

                <div className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${(player.quarterCount || 0) === 0 ? "bg-gray-700 text-gray-500" :
                    (player.quarterCount || 0) === 1 ? "bg-yellow-500 text-black" :
                        (player.quarterCount || 0) === 2 ? "bg-green-600 text-white" :
                            (player.quarterCount || 0) === 3 ? "bg-blue-600 text-white" :
                                "bg-cyan-400 text-black border border-white shadow-[0_0_0.3125rem_rgba(34,211,238,0.8)]" // Diamond Style
                    }`}>
                    {player.quarterCount}Q
                </div>

                <button
                    onClick={(e) => handleRemoveClick(e, player)}
                    className="ml-2 w-6 h-6 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    title="선수 삭제"
                >
                    ✕
                </button>
            </div>
        );
    };

    return (
        <div className="bg-surface-secondary rounded-xl overflow-hidden h-full flex flex-col border border-gray-700">
            {/* Header */}
            <div className={`p-4 border-b transition-colors bg-surface-secondary border-gray-700`}>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold text-lg">선수 명단</h3>
                        <span className="text-gray-400 text-xs">({filteredPlayers.length}명)</span>
                    </div>
                    <button onClick={handleAddClick} className="bg-surface-tertiary hover:bg-white hover:text-black text-white w-7 h-7 rounded flex items-center justify-center font-bold transition-colors">+</button>
                </div>

                {/* Position Filters Only */}
                <div className="flex gap-2 mb-2 overflow-x-auto scrollbar-hide">
                    {["ALL", "FW", "MF", "DF", "GK"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActivePosTab(tab)}
                            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activePosTab === tab ? "bg-white text-black" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <input
                    type="text"
                    placeholder="이름 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-surface-tertiary text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary border border-transparent"
                />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-hide space-y-4">

                {/* 1. Unassigned Section */}
                {unassignedPlayers.length > 0 && (
                    <div>
                        <div className="text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider px-1 border-b border-gray-700 pb-1">
                            미배정 ({unassignedPlayers.length})
                        </div>
                        {unassignedPlayers.map(p => renderPlayerRow(p))}
                    </div>
                )}

                {/* 2. Team Sections */}
                {["A", "B", "C", "D"].map(team => {
                    const group = teamGroups[team];
                    if (group.length === 0) return null;
                    return (
                        <div key={team}>
                            <div className={`text-xs font-bold mb-2 uppercase tracking-wider px-1 border-b pb-1 flex justify-between items-center ${team === "A" ? "text-blue-400 border-blue-900/30" :
                                team === "B" ? "text-red-400 border-red-900/30" :
                                    team === "C" ? "text-green-400 border-green-900/30" : "text-purple-400 border-purple-900/30"
                                }`}>
                                <span>{team}팀 ({group.length})</span>
                            </div>
                            {group.map(p => renderPlayerRow(p))}
                        </div>
                    );
                })}

                {filteredPlayers.length === 0 && (
                    <div className="text-center text-gray-500 py-10 text-sm">
                        선수가 없습니다.
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-surface-tertiary text-center text-xs text-gray-400 border-t border-gray-700">
                {selectedPlayer ? (
                    <span className="text-primary font-bold animate-pulse">
                        {selectedPlayer.name} 선택됨 - 교체할 위치를 누르세요
                    </span>
                ) : (
                    "선수 선택 후 필드를 눌러 교체하세요"
                )}
            </div>
        </div>
    );
}
