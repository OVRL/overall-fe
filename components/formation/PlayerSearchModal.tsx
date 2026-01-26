"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Player } from "@/app/formation/page";

interface PlayerSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (player: Player) => void;
    players: Player[]; // All available players
    playingPlayerIds?: number[]; // IDs of players currently on the field
}

// Reuse modal styles from Team Data page
export default function PlayerSearchModal({ isOpen, onClose, onSelect, players, playingPlayerIds = [] }: PlayerSearchModalProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredPlayers, setFilteredPlayers] = useState<Player[]>(players);
    const inputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setSearchTerm("");
            setFilteredPlayers(players);
            // Focus input on open
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, players]);

    useEffect(() => {
        const term = searchTerm.toLowerCase();

        // Filter first
        const matched = players.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.position.toLowerCase().includes(term)
        );

        // Then Sort: Bench (Not Playing) First -> Playing Last -> Then by Quarter Count
        const sorted = matched.sort((a, b) => {
            const isAPlaying = playingPlayerIds.includes(a.id);
            const isBPlaying = playingPlayerIds.includes(b.id);

            // 1. Primary: Playing Status (Bench First)
            if (isAPlaying && !isBPlaying) return 1; // Play -> Bottom
            if (!isAPlaying && isBPlaying) return -1; // Bench -> Top

            // 2. Secondary: Quarter Count (Ascending)
            return (a.quarterCount || 0) - (b.quarterCount || 0);
        });

        setFilteredPlayers(sorted);
    }, [searchTerm, players, playingPlayerIds]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-surface-secondary rounded-xl w-[90%] max-w-[25rem] border border-gray-700 shadow-2xl overflow-hidden animate-slideUp"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">선수 선택</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-gray-700 bg-surface-tertiary">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="선수 이름 검색..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-surface-secondary text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary border border-gray-600"
                    />
                </div>

                {/* List */}
                <div className="max-h-[50vh] overflow-y-auto p-2">
                    {filteredPlayers.length > 0 ? (
                        <div className="space-y-1">
                            {filteredPlayers.map(player => {
                                const isPlaying = playingPlayerIds.includes(player.id);
                                return (
                                    <button
                                        key={player.id}
                                        onClick={() => onSelect(player)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left group ${isPlaying
                                            ? "bg-surface-tertiary opacity-70 border border-transparent hover:border-gray-500"
                                            : "bg-surface-secondary border border-gray-700 hover:bg-surface-tertiary hover:border-primary"
                                            }`}
                                    >
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-800 border border-gray-600">
                                            <Image
                                                src={player.image || "/images/ovr.png"}
                                                alt={player.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <div className={`font-bold text-sm truncate ${isPlaying ? "text-gray-400" : "text-white"}`}>
                                                    {player.name}
                                                </div>
                                                {isPlaying && (
                                                    <span className="text-[0.625rem] bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800">
                                                        출전중
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-primary text-xs font-medium">{player.position}</div>
                                        </div>

                                        {/* Quarter Badge */}
                                        <div className={`px-2 py-1 rounded text-xs font-bold shadow-sm flex-shrink-0 ${(player.quarterCount || 0) === 0 ? "bg-gray-700 text-gray-500" :
                                            (player.quarterCount || 0) === 1 ? "bg-yellow-500 text-black" :
                                                (player.quarterCount || 0) === 2 ? "bg-green-600 text-white" :
                                                    (player.quarterCount || 0) === 3 ? "bg-blue-600 text-white" :
                                                        "bg-cyan-400 text-black border border-white shadow-[0_0_0.3125rem_rgba(34,211,238,0.8)]"
                                            }`}>
                                            {player.quarterCount}Q
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            검색 결과가 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
