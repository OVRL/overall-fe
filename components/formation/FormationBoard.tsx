"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Player } from "@/app/formation/page";

// Formation Definitions
export const FORMATIONS = {
    "4-2-3-1": {
        1: { top: "90%", left: "50%", role: "GK" },
        2: { top: "75%", left: "10%", role: "LB" },
        3: { top: "75%", left: "35%", role: "CB" },
        4: { top: "75%", left: "65%", role: "CB" },
        5: { top: "75%", left: "90%", role: "RB" },
        6: { top: "55%", left: "25%", role: "CDM" },
        7: { top: "55%", left: "75%", role: "CDM" },
        8: { top: "40%", left: "50%", role: "CAM" },
        9: { top: "20%", left: "15%", role: "LW" },
        10: { top: "20%", left: "85%", role: "RW" },
        11: { top: "18%", left: "50%", role: "ST" },
    },
    "4-4-2": {
        1: { top: "90%", left: "50%", role: "GK" },
        2: { top: "75%", left: "15%", role: "LB" },
        3: { top: "75%", left: "38%", role: "CB" },
        4: { top: "75%", left: "62%", role: "CB" },
        5: { top: "75%", left: "85%", role: "RB" },
        6: { top: "50%", left: "20%", role: "LM" },
        7: { top: "50%", left: "40%", role: "CM" },
        8: { top: "50%", left: "60%", role: "CM" },
        9: { top: "50%", left: "80%", role: "RM" },
        10: { top: "25%", left: "35%", role: "ST" },
        11: { top: "25%", left: "65%", role: "ST" },
    },
    "4-3-3": {
        1: { top: "90%", left: "50%", role: "GK" },
        2: { top: "75%", left: "15%", role: "LB" },
        3: { top: "75%", left: "38%", role: "CB" },
        4: { top: "75%", left: "62%", role: "CB" },
        5: { top: "75%", left: "85%", role: "RB" },
        6: { top: "55%", left: "50%", role: "CDM" },
        7: { top: "45%", left: "30%", role: "CM" },
        8: { top: "45%", left: "70%", role: "CM" },
        9: { top: "25%", left: "15%", role: "LW" },
        10: { top: "25%", left: "85%", role: "RW" },
        11: { top: "20%", left: "50%", role: "ST" },
    },
    "3-5-2": {
        1: { top: "90%", left: "50%", role: "GK" },
        2: { top: "75%", left: "20%", role: "CB" },
        3: { top: "75%", left: "50%", role: "CB" },
        4: { top: "75%", left: "80%", role: "CB" },
        5: { top: "50%", left: "15%", role: "LM" },
        6: { top: "55%", left: "35%", role: "CDM" },
        7: { top: "55%", left: "65%", role: "CDM" },
        8: { top: "50%", left: "85%", role: "RM" },
        9: { top: "40%", left: "50%", role: "CAM" },
        10: { top: "20%", left: "35%", role: "ST" },
        11: { top: "20%", left: "65%", role: "ST" },
    },
};

export type FormationType = keyof typeof FORMATIONS;

interface FormationBoardProps {
    quarterId: number;
    label: string;
    lineup: Record<number, Player | null>;
    onUpdate: (pos: number, player: Player | null) => void;
    teamColor?: "blue" | "red" | "green" | "purple";
    formation?: FormationType;
    onPositionClick?: (pos: number) => void;
    onSwap: (pos1: number, pos2: number) => void;
    selectedListPlayer: Player | null; // New prop for Tap-to-Place
    onPlaceListPlayer: (pos: number) => void; // New handler
    onRemove?: () => void; // Team Remove Handler
}

export default function FormationBoard({
    quarterId,
    label,
    lineup,
    onUpdate,
    teamColor,
    formation = "4-2-3-1",
    onPositionClick,
    onSwap,
    selectedListPlayer,
    onPlaceListPlayer,
    onRemove
}: FormationBoardProps) {
    const [selectedPos, setSelectedPos] = useState<number | null>(null);

    const positions = FORMATIONS[formation];

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };

    const handleDrop = (e: React.DragEvent, posId: number) => {
        e.preventDefault();
        const playerData = e.dataTransfer.getData("player");
        if (playerData) {
            const player = JSON.parse(playerData) as Player;
            onUpdate(posId, player);
        }
    };

    const handleRemove = (e: React.MouseEvent, posId: number) => {
        e.stopPropagation();
        onUpdate(posId, null);
    };

    const handleClick = (e: React.MouseEvent, posId: number) => {
        e.stopPropagation();

        // 1. If a list player is selected (Mobile Tap-to-Place mode)
        if (selectedListPlayer) {
            onPlaceListPlayer(posId);
            return;
        }

        // 2. Normal Board Interaction (Swap / Search)
        if (selectedPos === null) {
            // First click
            const player = lineup[posId];
            if (player) {
                // Select for swap
                setSelectedPos(posId);
            } else {
                // Empty slot -> Open Search Modal
                onPositionClick?.(posId);
            }
        } else {
            // Second click (Swap target)
            if (selectedPos === posId) {
                // Clicked same player -> Deselect
                setSelectedPos(null);
            } else {
                // Perform Swap
                onSwap(selectedPos, posId);
                setSelectedPos(null);
            }
        }
    };

    // Color theme logic
    const getBorderColor = () => {
        if (teamColor === "blue") return "border-blue-500";
        if (teamColor === "red") return "border-red-500";
        if (teamColor === "green") return "border-green-500";
        if (teamColor === "purple") return "border-purple-500";
        return "border-gray-700";
    };

    return (
        <div className={`rounded-2xl overflow-hidden bg-surface-secondary border-2 ${getBorderColor()} shadow-lg relative`}>
            {/* Header */}
            <div className="bg-surface-tertiary px-4 py-2 flex justify-between items-center group">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm md:text-base">{label}</h3>
                    {onRemove && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                            className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-colors"
                            title="팀 삭제"
                        >
                            ✕
                        </button>
                    )}
                </div>
                <span className="text-xs text-gray-500 font-mono group-hover:text-primary transition-colors cursor-help" title={`Formation: ${formation}`}>{formation}</span>
            </div>

            <div className="relative w-full aspect-[3/4] md:aspect-[16/9]" onClick={() => setSelectedPos(null)}>
                {/* Field Background */}
                <Image
                    src="/images/object_field.png"
                    alt="Field"
                    fill
                    className="object-cover opacity-90"
                    draggable={false}
                />

                {/* Drop Zones */}
                {Object.entries(positions).map(([key, pos]) => {
                    const posId = parseInt(key);
                    const player = lineup[posId];
                    const isSelected = selectedPos === posId;
                    const isSwapTarget = selectedPos !== null && selectedPos !== posId;
                    // Highlight if list player is pending placement
                    const isPlacementTarget = selectedListPlayer !== null;

                    return (
                        <div
                            key={posId}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-20 md:w-20 md:h-24 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer
                                ${isSelected ? "scale-110 z-20" : "hover:scale-105"}
                                ${isSwapTarget ? "hover:scale-110 hover:opacity-100" : ""}
                                ${isPlacementTarget ? "animate-pulse border-yellow-400" : ""} 
                            `}
                            style={{ top: pos.top, left: pos.left }}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, posId)}
                            onClick={(e) => handleClick(e, posId)}
                        >
                            {/* Player Card or Empty Slot */}
                            {player ? (
                                <div className="relative group w-full h-full flex flex-col items-center">
                                    {/* Selection Ring */}
                                    {isSelected && (
                                        <div className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-pulse z-0 pointer-events-none scale-125 md:scale-150 rounded-b-none" />
                                    )}

                                    {/* Placement Hint (Mobile) */}
                                    {isPlacementTarget && (
                                        <div className="absolute inset-0 z-30 flex items-center justify-center bg-primary/20 rounded-full pointer-events-none border-2 border-primary/50" />
                                    )}

                                    {/* Swap Indicator */}
                                    {isSwapTarget && (
                                        <div className="absolute inset-0 z-30 flex items-center justify-center text-white font-bold opacity-0 hover:opacity-100 bg-black/40 rounded-lg pointer-events-none backdrop-blur-[0.0625rem]">
                                            ⚡
                                        </div>
                                    )}

                                    {/* Remove Button */}
                                    {!selectedPos && !selectedListPlayer && (
                                        <button
                                            onClick={(e) => handleRemove(e, posId)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:scale-110"
                                        >
                                            ✕
                                        </button>
                                    )}

                                    {/* Image */}
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 shadow-lg bg-surface-tertiary relative z-10 transition-colors ${isSelected ? "border-yellow-400" : "border-white"}`}>
                                        <Image
                                            src={player.image || "/images/ovr.png"}
                                            alt={player.name}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                            draggable={false}
                                        />
                                    </div>

                                    {/* Name Badge */}
                                    <div className={`mt-1 bg-black/60 backdrop-blur-sm text-white text-[0.625rem] md:text-xs px-2 py-0.5 rounded-full whitespace-nowrap border z-10 ${isSelected ? "border-yellow-400 text-yellow-400" : "border-white/20"}`}>
                                        {player.name}
                                    </div>

                                    {/* Season Badge (Mini) */}
                                    <div className="absolute -top-1 -left-1 bg-surface-secondary text-[0.5rem] px-1 rounded border border-gray-600 z-10">
                                        {player.season || "LIVE"}
                                    </div>
                                </div>
                            ) : (
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/30 border-2 border-dashed flex items-center justify-center text-xs font-bold transition-colors ${isPlacementTarget ? "border-primary text-primary bg-primary/10" : "border-white/30 text-white/50"}`}>
                                    {pos.role}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
