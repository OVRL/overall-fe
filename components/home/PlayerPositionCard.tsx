"use client";

import React from "react";
import Image from "next/image";

interface Player {
    id: number;
    name: string;
    position: string;
    number: number;
    overall: number;
    image?: string;
}

interface PlayerPositionCardProps {
    player: Player;
    onDragStart: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
}

const DEFAULT_PLAYER_IMAGE = "/images/ovr.png";

/**
 * 포메이션 내 선수 카드 컴포넌트 (HTML 스타일 기반)
 */
export default function PlayerPositionCard({
    player,
    onDragStart,
    onDrop,
    onDragOver
}: PlayerPositionCardProps) {
    const [imageError, setImageError] = React.useState(false);
    const playerImage = imageError || !player.image ? DEFAULT_PLAYER_IMAGE : player.image;

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="flex flex-col items-center gap-2 cursor-move hover:scale-105 transition-transform"
        >
            {/* 선수 아바타 */}
            <div className="relative">
                <div className="w-14 h-14 bg-[#1a1a1a] rounded-full border-[3px] border-gray-700 overflow-hidden relative">
                    <Image
                        src={playerImage}
                        alt={player.name}
                        fill
                        className="object-cover"
                        onError={() => setImageError(true)}
                    />
                </div>

                {/* 등번호 배지 */}
                <div className="absolute -top-1 -right-1 bg-gray-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold">
                    {player.number}
                </div>

                {/* 주장 배지 (첫 번째 선수에만) */}
                {player.id === 5 && (
                    <div className="absolute top-0 left-0 bg-yellow-400 text-black w-5 h-5 rounded-full flex items-center justify-center text-xs font-black">
                        C
                    </div>
                )}
            </div>

            {/* 선수 이름 */}
            <div className="bg-[#1a1a1a] px-3 py-1 rounded-md text-[13px] text-white font-semibold whitespace-nowrap">
                {player.name}
            </div>
        </div>
    );
}
