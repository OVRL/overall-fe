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

interface PlayerListItemProps {
    player: Player;
    onClick?: () => void;
}

const PlayerListItem = ({ player, onClick }: PlayerListItemProps) => {
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
                <div className="relative w-8 h-12 md:w-12 md:h-16 shrink-0">
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
            <div className="flex justify-end min-w-7.5">
                <span className="text-primary font-bold text-base md:text-lg">{player.overall}</span>
            </div>
        </div>
    );
};

export default PlayerListItem;
