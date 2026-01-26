"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Player, QuarterData, TeamType } from "@/app/formation/page";
import FormationBoard, { FORMATIONS, FormationType } from "@/components/formation/FormationBoard";
import FormationPlayerList from "./FormationPlayerList";

interface TeamManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    quarterId: number;
    teamKey: string; // "teamA", "teamB"...
    teamName: string; // "A", "B"...
    currentLineup: Record<number, Player | null>;
    quarters: QuarterData[];
    allPlayers: Player[]; // Full roster
    currentQuarterLineups: Record<number, Player | null>[]; // New prop for counts
    onUpdateLineup: (quarterId: number, teamKey: string, posId: number, player: Player | null) => void;
    onAddPlayer?: (name: string) => void;
    onRemovePlayer?: (id: number) => void;
}

export default function TeamManagerModal({
    isOpen,
    onClose,
    quarterId,
    teamKey,
    teamName,
    currentLineup,
    quarters,
    allPlayers,
    currentQuarterLineups,
    onUpdateLineup,
    onAddPlayer,
    onRemovePlayer
}: TeamManagerModalProps) {
    const [selectedBoardPos, setSelectedBoardPos] = useState<number | null>(null);
    const [selectedListPlayer, setSelectedListPlayer] = useState<Player | null>(null);
    const [autoFilterPos, setAutoFilterPos] = useState<string | null>(null);

    if (!isOpen) return null;

    // Helper: Find which team a player belongs to in this quarter
    const getPlayerTeamStatus = (playerId: number) => {
        // ... (existing logic) ...
        // Re-implement or remove if unused in this component (FormationPlayerList handles visual badges)
        return "UNASSIGNED";
    };

    const handlePlaceListPlayer = (posId: number) => {
        if (!selectedListPlayer) return;

        // Check if player is already in THIS team (Standard FormationBoard check logic?)
        // FormationBoard usually allows overwrite.
        // We use ForceAssign passed from Page.

        onUpdateLineup(quarterId, teamKey, posId, selectedListPlayer);
        setSelectedListPlayer(null); // Clear selection after placement
        setSelectedBoardPos(null);
    };

    const handleBoardPositionClick = (posId: number) => {
        setSelectedBoardPos(posId);

        // Auto-Filter Logic
        const formationStr = quarters.find(q => q.id === quarterId)?.formation || "4-2-3-1";
        // Type safe access
        // @ts-ignore
        const formationDef = FORMATIONS[formationStr];
        if (formationDef && formationDef[posId]) {
            const role = formationDef[posId].role; // "ST", "CB" etc.
            setAutoFilterPos(role);
        } else {
            setAutoFilterPos(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn" onClick={onClose}>
            <div className="bg-surface-secondary w-full h-full max-w-[95vw] max-h-[95vh] rounded-2xl flex flex-col md:flex-row overflow-hidden border border-gray-700 shadow-2xl" onClick={e => e.stopPropagation()}>

                {/* LEFT: Board Section */}
                <div className="flex-1 flex flex-col p-4 border-r border-gray-700 bg-black/20">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <h2 className={`text-2xl font-bold text-white px-3 py-1 rounded bg-${teamName === "A" ? "blue" : teamName === "B" ? "red" : teamName === "C" ? "green" : "purple"}-900`}>
                                {teamName}팀 관리
                            </h2>
                            <span className="text-gray-400 text-sm">목록에서 선수를 선택하고 빈 자리를 누르세요.</span>
                        </div>
                        <button onClick={onClose} className="bg-gray-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600">닫기</button>
                    </div>

                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="w-full max-w-[800px] aspect-[3/4] md:aspect-[16/9] relative">
                            <FormationBoard
                                quarterId={quarterId}
                                label=""
                                lineup={currentLineup}
                                // @ts-ignore
                                formation={quarters.find(q => q.id === quarterId)?.formation}
                                teamColor={teamName === "A" ? "blue" : teamName === "B" ? "red" : teamName === "C" ? "green" : "purple"}
                                onUpdate={(pos, p) => onUpdateLineup(quarterId, teamKey, pos, p)}
                                onSwap={(p1, p2) => {
                                    // Internal Swap logic or placeholder
                                }}
                                // Pass selected list player for "Tap to Place" mode
                                selectedListPlayer={selectedListPlayer}
                                onPlaceListPlayer={handlePlaceListPlayer}
                                onPositionClick={handleBoardPositionClick}
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT: Player List Section (Standard) */}
                <div className="w-full md:w-[350px] bg-surface-tertiary flex flex-col border-l border-gray-700">
                    <FormationPlayerList
                        players={allPlayers}
                        currentQuarterLineups={currentQuarterLineups}
                        selectedPlayer={selectedListPlayer}
                        onSelectPlayer={setSelectedListPlayer}
                        isLineupFull={false} // Allow selecting even if full (swap logic)
                        onAddPlayer={onAddPlayer}
                        onRemovePlayer={onRemovePlayer}
                        targetPosition={autoFilterPos}
                    />
                </div>

            </div>
        </div>
    );
}
