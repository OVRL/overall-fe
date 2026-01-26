"use client";

import React, { useState } from "react";
import { Player } from "@/app/formation/page";

interface FormationPlayerListProps {
    players: Player[];
    currentQuarterLineups: Record<number, Player | null>[];
    selectedPlayer: Player | null; // For Mobile Tap-to-Place
    onSelectPlayer: (player: Player) => void;
    isLineupFull: boolean;
    onAddPlayer?: (name: string) => void; // New Handler
    onRemovePlayer?: (id: number) => void; // New Handler
}

export default function FormationPlayerList({
    players,
    currentQuarterLineups,
    selectedPlayer,
    onSelectPlayer,
    isLineupFull,
    onAddPlayer,
    onRemovePlayer
}: FormationPlayerListProps) {
    const [searchTerm, setSearchTerm] = useState("");

    // Check if player is currently playing in ANY of the active lineups for this quarter
    const isPlayingCurrentQuarter = (playerId: number) => {
        return currentQuarterLineups.some(lineup =>
            Object.values(lineup).some(p => p?.id === playerId)
        );
    };

    // Filter by search
    const searchedPlayers = players.filter(p => p.name.includes(searchTerm));

    // Sort Helper
    const sortByCount = (a: Player, b: Player) => (a.quarterCount || 0) - (b.quarterCount || 0);

    // Split Logic
    let benchPlayers: Player[] = [];
    let fieldPlayers: Player[] = [];

    if (isLineupFull) {
        // If full, split into Bench (Not Playing) and Field (Playing)
        benchPlayers = searchedPlayers.filter(p => !isPlayingCurrentQuarter(p.id)).sort(sortByCount);
        fieldPlayers = searchedPlayers.filter(p => isPlayingCurrentQuarter(p.id)).sort(sortByCount);
    } else {
        // Standard view: All in one list, just sorted
        fieldPlayers = searchedPlayers.sort((a, b) => {
            const aPlaying = isPlayingCurrentQuarter(a.id);
            const bPlaying = isPlayingCurrentQuarter(b.id);
            if (aPlaying && !bPlaying) return 1; // Playing goes to bottom
            if (!aPlaying && bPlaying) return -1;
            return (a.quarterCount || 0) - (b.quarterCount || 0);
        });
    }

    const handleDragStart = (e: React.DragEvent, player: Player) => {
        e.dataTransfer.setData("player", JSON.stringify(player));
        e.dataTransfer.effectAllowed = "copy";
        onSelectPlayer(player);
    };

    const handleAddClick = () => {
        const name = prompt("새로운 선수의 이름을 입력하세요:");
        if (name && name.trim()) {
            onAddPlayer?.(name.trim());
        }
    };

    const handleRemoveClick = (e: React.MouseEvent, player: Player) => {
        e.stopPropagation(); // Prevent selection
        if (confirm(`'${player.name}' 선수를 정말 삭제하시겠습니까?\n모든 분기 라인업에서 제거됩니다.`)) {
            onRemovePlayer?.(player.id);
        }
    };

    const renderPlayerRow = (player: Player, isBenchSection: boolean) => {
        const isPlaying = isPlayingCurrentQuarter(player.id);
        const isSelected = selectedPlayer?.id === player.id;

        return (
            <div
                key={player.id}
                draggable
                onDragStart={(e) => handleDragStart(e, player)}
                onClick={() => onSelectPlayer(player)}
                className={`flex items-center p-2 rounded-lg border-2 transition-all cursor-pointer select-none relative mb-2 group ${isSelected
                    ? "bg-primary/20 border-primary shadow-[0_0_0.9375rem_rgba(59,130,246,0.3)] z-10"
                    : isBenchSection
                        ? "bg-green-900/20 border-green-500/30 hover:bg-green-500/10 hover:border-green-500" // Bench Style
                        : "bg-surface-tertiary border-blue-900/30 hover:border-blue-500/50" // Playing/Field Style (Vibrant)
                    }`}
            >
                {/* Bench Badge for Bench Section */}
                {isBenchSection && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-green-500 rounded-l-lg opacity-80" />
                )}

                {/* Playing Indicator (Subtle) */}
                {!isBenchSection && isPlaying && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-blue-500/50 rounded-l-lg" />
                )}

                {/* Position Badge */}
                <div className={`w-8 h-8 rounded flex items-center justify-center mr-3 font-bold text-xs ${isBenchSection ? "bg-green-900 text-green-400" : "bg-blue-900 text-blue-300"
                    }`}>
                    {player.position}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex items-center justify-between pr-2">
                    <div className={`font-bold text-sm truncate ${isBenchSection ? "text-white" : "text-gray-500"}`}>
                        {player.name}
                    </div>
                </div>

                {/* OVR (Only visible on bench for compactness?) -> Keep it but maybe smaller */}
                <div className="text-gray-500 text-xs mr-2">OVR {player.overall}</div>

                {/* Quarter Count Badge */}
                <div className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${(player.quarterCount || 0) === 0 ? "bg-gray-700 text-gray-500" :
                    (player.quarterCount || 0) === 1 ? "bg-yellow-500 text-black" :
                        (player.quarterCount || 0) === 2 ? "bg-green-600 text-white" :
                            (player.quarterCount || 0) === 3 ? "bg-blue-600 text-white" :
                                "bg-cyan-400 text-black border border-white shadow-[0_0_0.3125rem_rgba(34,211,238,0.8)]" // Diamond Style
                    }`}>
                    {player.quarterCount}Q
                </div>

                {/* Delete Button (Visible on Hover) */}
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
            <div className={`p-4 border-b transition-colors ${isLineupFull ? "bg-green-900/20 border-green-900/50" : "bg-surface-secondary border-gray-700"}`}>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold text-lg">
                            {isLineupFull ? "BENCH" : "선수 명단"}
                        </h3>
                        <span className="text-gray-400 text-xs">({players.length}명)</span>
                    </div>
                    <div className="flex gap-2">
                        {isLineupFull && <span className="text-xs bg-green-500 text-black font-bold px-2 py-0.5 rounded-full animate-pulse self-center">Selectable</span>}
                        <button
                            onClick={handleAddClick}
                            className="bg-surface-tertiary hover:bg-white hover:text-black text-white w-7 h-7 rounded flex items-center justify-center font-bold transition-colors"
                            title="새 선수 추가"
                        >
                            +
                        </button>
                    </div>
                </div>
                <input
                    type="text"
                    placeholder="선수 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-surface-tertiary text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary border border-transparent"
                />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">

                {/* 1. BENCH SECTION (Only if split) */}
                {isLineupFull && benchPlayers.length > 0 && (
                    <div className="mb-6">
                        <div className="text-green-400 text-xs font-bold mb-2 uppercase tracking-wider px-1">
                            Waiting ({benchPlayers.length})
                        </div>
                        {benchPlayers.map(p => renderPlayerRow(p, true))}
                    </div>
                )}

                {/* 2. FIELD SECTION */}
                <div className={isLineupFull ? "opacity-70" : ""}>
                    {isLineupFull && fieldPlayers.length > 0 && (
                        <div className="text-gray-500 text-xs font-bold mb-2 uppercase tracking-wider px-1 border-t border-gray-700 pt-4">
                            Playing ({fieldPlayers.length})
                        </div>
                    )}
                    {fieldPlayers.map(p => renderPlayerRow(p, false))}
                </div>
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
