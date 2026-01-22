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
    nationality?: string;
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
        <div className="bg-surface-secondary rounded-[20px] p-5 mt-5">
            {/* 탭 메뉴 */}
            <div className="flex gap-2 mb-4 bg-surface-primary p-1 rounded-xl">
                {["전체", "선발", "교체", "OVR"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${activeTab === tab
                            ? "bg-surface-tertiary text-white"
                            : "text-gray-500 hover:text-gray-300"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 테이블 헤더 */}
            <div className="grid grid-cols-[60px_50px_1fr_50px] items-center gap-4 px-3 py-2 text-gray-500 text-xs border-b border-gray-800">
                <span>포지션</span>
                <span className="text-center">등번호</span>
                <span>선수명</span>
                <span className="text-right">OVR</span>
            </div>

            {/* 선수 목록 */}
            <div className="divide-y divide-gray-800/50">
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
        <div className="grid grid-cols-[60px_50px_1fr_50px] items-center gap-4 py-2 px-3 hover:bg-gray-800/30 transition-colors">
            {/* 포지션 배지 */}
            <PositionChip position={player.position as Position} variant="filled" />

            {/* 등번호 */}
            <span className="text-white font-bold text-center">{player.number}</span>

            {/* 선수 정보 */}
            <div className="flex items-center gap-3">
                {/* 선수 이미지 */}
                <div className="relative w-9 h-9 bg-surface-tertiary rounded-full overflow-hidden flex-shrink-0">
                    <Image
                        src={playerImage}
                        alt={player.name}
                        fill
                        className="object-cover"
                        onError={() => setImageError(true)}
                    />
                </div>

                {/* 연도 배지 */}
                <div className="w-6 h-4 bg-gray-700 rounded-sm flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">
                    26
                </div>

                {/* 선수 이름 */}
                <span className="text-white font-medium truncate">{player.name}</span>
            </div>

            {/* OVR */}
            <span className="text-primary font-bold text-lg text-right">{player.overall}</span>
        </div>
    );
}
