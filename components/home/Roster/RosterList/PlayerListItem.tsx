"use client";

import React, { useState } from "react";
import PositionChip from "@/components/PositionChip";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { Position } from "@/types/position";
import PlayerListItemGradation from "./PlayerListItemGradation";

import { Player } from "@/types/player";

const DEFAULT_PLAYER_IMAGE = "/images/ovr.png";

interface PlayerListItemProps {
  player: Player;
  onClick?: () => void;
}

const PlayerListItem = ({ player, onClick }: PlayerListItemProps) => {
  const [imageError, setImageError] = useState(false);
  const playerImage =
    imageError || !player.image ? DEFAULT_PLAYER_IMAGE : player.image;

  return (
    <div
      onClick={onClick}
      className="flex items-center w-full hover:bg-gray-800/30 transition-colors cursor-pointer pl-2 pr-1.5 relative"
      role="row"
    >
      <div className="flex items-center" role="cell">
        <div className="flex items-center">
          <div className="w-12.25 flex justify-center">
            <PositionChip
              position={player.position as Position}
              variant="outline"
            />
          </div>
          <span className="w-9.75 text-Label-Primary text-center text-sm md:text-base">
            {player.number}
          </span>
        </div>
      </div>

      <div
        className="flex-1 flex items-center overflow-hidden justify-center"
        role="cell"
      >
        <div className="flex-none mr-2 md:mr-3">
          <ProfileAvatar
            src={playerImage}
            alt={player.name}
            size={36}
            onError={() => setImageError(true)}
          />
        </div>

        <span className="text-white font-medium truncate text-xs md:text-base w-18.75 text-ellipsis">
          {player.name}
        </span>
      </div>

      <div className="w-12.25 flex justify-end" role="cell">
        <span className="text-Label-AccentPrimary text-sm w-full text-center">
          {player.overall}
        </span>
      </div>

      {/* 구분선 */}
      <div className="absolute inset-x-0 bottom-0 h-px z-10 bg-[#252525]" />
      <PlayerListItemGradation position={player.position as Position} />
    </div>
  );
};

export default PlayerListItem;
