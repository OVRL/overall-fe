"use client";

import React, { useState } from "react";
import Image from "next/image";
import SeasonChip from "@/components/ui/SeasonChip";

interface Player {
    id: number;
    name: string;
    position: string;
    number: number;
    overall: number;
    image?: string;
    season?: string;
    seasonType?: "general" | "worldBest";
}

interface PlayerPositionCardProps {
    player: Player;
    onDragStart: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
}

const DEFAULT_PLAYER_IMAGE = "/images/ovr.png";

/**
 * 포메이션 내 선수 카드 컴포넌트
 */
const PlayerPositionCard = ({
    player,
    onDragStart,
    onDrop,
    onDragOver
}: PlayerPositionCardProps) => {
    const [imageError, setImageError] = useState(false);
    const playerImage = imageError || !player.image ? DEFAULT_PLAYER_IMAGE : player.image;

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="flex flex-col items-center gap-1 md:gap-2 cursor-move hover:scale-105 transition-transform"
        >
            {/* 선수 아바타 */}
            <div className="relative">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-surface-tertiary rounded-full border-2 md:border-[3px] border-gray-700 overflow-hidden relative">
                    <Image
                        src={playerImage}
                        alt={player.name}
                        fill
                        className="object-cover"
                        onError={() => setImageError(true)}
                    />
                </div>

                {/* 등번호 배지 */}
                <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-gray-600 text-white w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-[11px] font-bold">
                    {player.number}
                </div>

                {/* 주장 배지 (첫 번째 선수에만) */}
                {player.id === 5 && (
                    <div className="absolute top-0 left-0 bg-yellow-400 text-black w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[10px] md:text-xs font-black">
                        C
                    </div>
                )}
            </div>

            {/* 선수 이름 */}
            <div className="bg-surface-tertiary px-2 md:px-3 py-0.5 md:py-1 rounded-md flex items-center gap-1.5 md:gap-2">
                <SeasonChip
                    season={player.season || "26"}
                    type={player.seasonType || "general"}
                    className="md:scale-110"
                />
                <span className="text-[11px] md:text-[13px] text-white font-semibold whitespace-nowrap">
                    {player.name}
                </span>
            </div>
        </div>
    );
};

export default PlayerPositionCard;
