"use client";

import React, { useState } from "react";
import Image from "next/image";
import PlayerPositionCard from "./PlayerPositionCard";

interface Player {
    id: number;
    name: string;
    position: string;
    number: number;
    overall: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
    pace: number;
}

interface FormationPosition {
    top: string;
    left: string;
}

interface StartingXIProps {
    players: Player[];
    onPlayersChange: (players: Player[]) => void;
}

/**
 * 포메이션 컴포넌트 (HTML 스타일 기반)
 */
export default function StartingXI({ players, onPlayersChange }: StartingXIProps) {
    const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null);
    const [activeTab, setActiveTab] = useState("대표");

    // 포메이션 위치 (4-2-3-1)
    const formationPositions: Record<number, FormationPosition> = {
        1: { top: "90%", left: "50%" },      // GK
        2: { top: "75%", left: "10%" },      // LB
        3: { top: "75%", left: "35%" },      // CB
        4: { top: "75%", left: "65%" },      // CB
        5: { top: "75%", left: "90%" },      // RB
        6: { top: "55%", left: "25%" },      // CDM
        7: { top: "55%", left: "75%" },      // CDM
        8: { top: "40%", left: "50%" },      // CAM
        9: { top: "20%", left: "15%" },      // LW
        10: { top: "20%", left: "85%" },     // RW
        11: { top: "10%", left: "50%" },     // ST
    };

    const handleDragStart = (e: React.DragEvent, player: Player) => {
        setDraggedPlayer(player);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDrop = (e: React.DragEvent, targetPlayer: Player) => {
        e.preventDefault();
        if (!draggedPlayer || draggedPlayer.id === targetPlayer.id) return;

        const newPlayers = players.map(p => {
            if (p.id === draggedPlayer.id) return { ...targetPlayer, id: draggedPlayer.id };
            if (p.id === targetPlayer.id) return { ...draggedPlayer, id: targetPlayer.id };
            return p;
        });

        onPlayersChange(newPlayers);
        setDraggedPlayer(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    return (
        <div className="bg-[#141414] rounded-[20px] p-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-[28px] font-black text-white">STARTING XI</h2>
                <div className="flex gap-4">
                    {["대표", "A", "B", "C"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === tab
                                    ? "bg-primary text-black"
                                    : "bg-transparent border border-gray-700 text-gray-500 hover:border-gray-500"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* 필드 */}
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-b from-[#1a4d1a] to-[#0d260d] p-8">
                {/* 중앙선 */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30" />

                {/* 중앙 원 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/30 rounded-full" />

                {/* 상단 패널티 박스 */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 border-2 border-white/30 border-t-0 rounded-b-xl" />

                {/* 하단 패널티 박스 */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-24 border-2 border-white/30 border-b-0 rounded-t-xl" />

                {/* 선수 배치 */}
                {players.slice(0, 11).map((player, index) => {
                    const position = formationPositions[index + 1];
                    return (
                        <div
                            key={player.id}
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                            style={{ top: position.top, left: position.left }}
                        >
                            <PlayerPositionCard
                                player={player}
                                onDragStart={(e) => handleDragStart(e, player)}
                                onDrop={(e) => handleDrop(e, player)}
                                onDragOver={handleDragOver}
                            />
                        </div>
                    );
                })}
            </div>

            {/* 감독 정보 */}
            <div className="text-center mt-5">
                <div className="inline-block relative">
                    <div className="w-14 h-14 bg-[#1a1a1a] rounded-full border-2 border-gray-700 overflow-hidden relative mx-auto">
                        <Image
                            src="/images/ovr.png"
                            alt="Manager"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="absolute -top-1 -right-1 bg-gray-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold">
                        30
                    </div>
                </div>
                <div className="mt-2">
                    <p className="text-gray-500 text-xs">감독</p>
                    <p className="text-white font-bold">정태우</p>
                    <p className="text-gray-500 text-xs mt-1">경기수: 30 | 20/5/5 | 팀 승률: 60%</p>
                </div>
            </div>
        </div>
    );
}
