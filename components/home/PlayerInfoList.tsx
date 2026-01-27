"use client";

import React, { useState } from "react";
import Image from "next/image";
import PositionChip from "@/components/PositionChip";
import SeasonChip, { SeasonType } from "@/components/ui/SeasonChip";
import type { Position } from "@/components/PositionChip";

export interface Player {
    id: number;
    name: string;
    position: string;
    number: number;
    overall: number;
    nationality?: string;
    image?: string;
    season?: string;
    seasonType?: "general" | "worldBest";
    // Stats for PlayerCard
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
    pace: number;
}

const DEFAULT_PLAYER_IMAGE = "/images/ovr.png";

/**
 * 테이블 헤더 컴포넌트
 */
const PlayerListHeader = () => (
    <div className="grid grid-cols-[2.8125rem_1.875rem_1fr_2.8125rem] md:grid-cols-[3.75rem_3.125rem_1fr_3.125rem] items-center gap-1 md:gap-4 px-2 md:px-3 py-2 text-gray-500 text-xs md:text-xs border-b border-gray-800 whitespace-nowrap">
        <span>포지션</span>
        <span className="text-center">등번호</span>
        <span>선수명</span>
        <span className="text-right">OVR</span>
    </div>
);

/**
 * 개별 선수 아이템 컴포넌트
 */
const PlayerListItem = ({ player, onClick }: { player: Player; onClick?: () => void }) => {
    const [imageError, setImageError] = useState(false);
    const playerImage = imageError || !player.image ? DEFAULT_PLAYER_IMAGE : player.image;

    return (
        <div
            onClick={onClick}
            className="grid grid-cols-[2.8125rem_1.875rem_1fr_2.8125rem] md:grid-cols-[3.75rem_3.125rem_1fr_3.125rem] items-center gap-1 md:gap-4 py-1.5 md:py-2 px-2 md:px-3 hover:bg-gray-800/30 transition-colors cursor-pointer"
        >
            {/* 포지션 배지 */}
            <div className="flex justify-center">
                <PositionChip position={player.position as Position} variant="filled" />
            </div>

            {/* 등번호 */}
            <span className="text-white font-bold text-center text-sm md:text-base">{player.number}</span>

            {/* 선수 정보 */}
            <div className="flex items-center gap-2 md:gap-3">
                {/* 선수 이미지 */}
                <div className="relative w-8 h-12 md:w-12 md:h-16 flex-shrink-0">
                    <Image
                        src={playerImage}
                        alt={player.name}
                        fill
                        className="object-contain"
                        onError={() => setImageError(true)}
                    />
                </div>

                {/* 연도 배지 */}
                <SeasonChip
                    season={player.season || "26"}
                    type={player.seasonType as SeasonType || "general"}
                />

                {/* 선수 이름 */}
                <span className="text-white font-medium truncate text-xs md:text-base">{player.name}</span>
            </div>

            {/* OVR */}
            <div className="flex justify-end min-w-[1.875rem]">
                <span className="text-primary font-bold text-base md:text-lg">{player.overall}</span>
            </div>
        </div>
    );
};

interface PlayerInfoListProps {
    players: Player[];
    showHeader?: boolean;
    onPlayerSelect?: (player: Player) => void;
}

/**
 * 선수 정보 리스트 컴포넌트
 */
const PlayerInfoList = ({ players, showHeader = true, onPlayerSelect }: PlayerInfoListProps) => {
    return (
        <div className="w-full">
            {showHeader && <PlayerListHeader />}
            <div className="divide-y divide-gray-800/50">
                {players.map((player) => (
                    <PlayerListItem
                        key={player.id}
                        player={player}
                        onClick={() => onPlayerSelect && onPlayerSelect(player)}
                    />
                ))}
            </div>
        </div>
    );
};

export default PlayerInfoList;
