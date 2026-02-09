"use client";

import React, { useState } from "react";
import PositionChip from "@/components/PositionChip";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { Position } from "@/types/position";

import { Player } from "@/types/player";

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
                <ProfileAvatar
                    src={playerImage}
                    alt={player.name}
                    size="xs"
                    onError={() => setImageError(true)}
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

