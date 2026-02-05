"use client";

import React, { useState } from "react";
import SeasonChip, { SeasonType } from "@/components/ui/SeasonChip";
import ImgPlayer from "@/components/ui/ImgPlayer";

export interface Player {
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
    onClick?: () => void;
}

const DEFAULT_PLAYER_IMAGE = "/images/ovr.png";

/**
 * 포메이션 내 선수 카드 컴포넌트
 */
const PlayerPositionCard = ({
    player,
    onDragStart,
    onDrop,
    onDragOver,
    onClick
}: PlayerPositionCardProps) => {
    const [imageError, setImageError] = useState(false);
    const playerImage = imageError || !player.image ? DEFAULT_PLAYER_IMAGE : player.image;

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={onClick}
            className="flex flex-col items-center gap-1 md:gap-2 cursor-pointer hover:scale-105 transition-transform"
        >
            {/* 선수 아바타 */}
            <div className="relative">
                <div className="w-14 h-20 md:w-20 md:h-28 relative -mt-4 md:-mt-8">
                    <ImgPlayer
                        src={playerImage}
                        alt={player.name}
                        className="w-full h-full object-contain bg-transparent"
                        onError={() => setImageError(true)}
                    />
                </div>

                {/* 주장 배지 (첫 번째 선수에만 - Mock logic) */}
                {player.id === 5 && (
                    <div className="absolute top-0 left-0 bg-yellow-400 text-black w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[0.625rem] md:text-xs font-black shadow-sm">
                        C
                    </div>
                )}
            </div>

            {/* 선수 이름 */}
            <div className="flex items-center gap-0.5 md:gap-1.5 -mt-3 md:-mt-5 max-w-16 md:max-w-none justify-center z-10">
                <SeasonChip
                    season={player.season || "26"}
                    type={player.seasonType as SeasonType || "general"}
                    className="scale-[0.8] md:scale-100 shadow-sm shrink-0"
                />
                <span className="text-[0.5625rem] md:text-[0.875rem] text-white font-bold whitespace-nowrap drop-shadow-md truncate">
                    {player.name}
                </span>
            </div>
        </div>
    );
};

export default PlayerPositionCard;

