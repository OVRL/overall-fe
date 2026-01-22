"use client";

import React, { useState } from "react";
import Image from "next/image";
import PositionChip from "@/components/PositionChip";
import type { Position } from "@/components/PositionChip";

interface Player {
    id: number;
    name: string;
    position: string;
    number: number;
    overall: number;
    image?: string;
}

interface PlayerListProps {
    players: Player[];
}

const DEFAULT_PLAYER_IMAGE = "/images/ovr.png";

/**
 * 선수 목록 테이블 컴포넌트 (HTML 스타일 기반)
 */
export default function PlayerList({ players }: PlayerListProps) {
    const [activeTab, setActiveTab] = useState("전체");

    return (
        <div className="bg-[#141414] rounded-[20px] p-5 mt-5">
            {/* 탭 메뉴 */}
            <div className="flex gap-2 mb-5 bg-[#0a0a0a] p-1 rounded-xl">
                {["전체", "선발", "교체", "OVR"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${activeTab === tab
                                ? "bg-[#1a1a1a] text-white"
                                : "text-gray-500 hover:text-gray-300"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 선수 목록 */}
            <div className="space-y-2">
                {players.map((player) => (
                    <PlayerListItem key={player.id} player={player} />
                ))}
            </div>
        </div>
    );
}

function PlayerListItem({ player }: { player: Player }) {
    const [imageError, setImageError] = React.useState(false);
    const playerImage = imageError || !player.image ? DEFAULT_PLAYER_IMAGE : player.image;

    return (
        <div className="grid grid-cols-[60px_50px_1fr_50px] items-center gap-4 p-3 bg-[#0a0a0a] rounded-xl">
            {/* 포지션 배지 */}
            <PositionChip position={player.position as Position} variant="filled" />

            {/* 등번호 */}
            <span className="text-white font-bold text-center">{player.number}</span>

            {/* 선수 정보 */}
            <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 bg-[#1a1a1a] rounded-full overflow-hidden flex-shrink-0">
                    <Image
                        src={playerImage}
                        alt={player.name}
                        fill
                        className="object-cover"
                        onError={() => setImageError(true)}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 bg-gray-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {player.number}
                    </div>
                </div>
                <span className="text-white font-medium">{player.name}</span>
            </div>

            {/* OVR */}
            <span className="text-primary font-bold text-lg text-right">{player.overall}</span>
        </div>
    );
}
