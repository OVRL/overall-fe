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
  const playerImage =
    imageError || !player.image ? DEFAULT_PLAYER_IMAGE : player.image;

  return (
    <tr
      onClick={onClick}
      className="flex items-center w-full hover:bg-gray-800/30 transition-colors cursor-pointer pl-2 pr-1.5"
    >
      <td className="flex items-center">
        <div className="flex items-center">
          <div className="w-12.25 flex justify-center">
            <PositionChip
              position={player.position as Position}
              variant="filled"
            />
          </div>
          <span className="w-9.75 text-white font-bold text-center text-sm md:text-base">
            {player.number}
          </span>
        </div>
      </td>

      <td className="flex-1 flex items-center overflow-hidden">
        <div className="flex-none mr-2 md:mr-3">
          <ProfileAvatar
            src={playerImage}
            alt={player.name}
            size={36}
            onError={() => setImageError(true)}
          />
        </div>

        <span className="text-white font-medium truncate text-center text-xs md:text-base">
          {player.name}
        </span>
      </td>

      <td className="w-12.25 flex justify-end">
        <span className="text-Label-AccentPrimary text-sm w-full text-center">
          {player.overall}
        </span>
      </td>
    </tr>
  );
};

export default PlayerListItem;
