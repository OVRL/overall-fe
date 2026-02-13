"use client";

import React from "react";
import PlayerListItem from "./PlayerListItem";
import { Player } from "@/types/player";
import PlayerListHeader from "./PlayerListHeader";
export type { Player };

export { PlayerListHeader };

interface PlayerInfoListProps {
  id?: string;
  players: Player[];
  showHeader?: boolean;
  onPlayerSelect?: (player: Player) => void;
}

/**
 * 선수 정보 리스트 컴포넌트
 */
const PlayerInfoList = ({
  id,
  players,
  showHeader = true,
  onPlayerSelect,
}: PlayerInfoListProps) => {
  return (
    <tbody id={id} className="w-full divide-y divide-gray-800/50">
      {showHeader && <PlayerListHeader />}
      {players.map((player) => (
        <PlayerListItem
          key={player.id}
          player={player}
          onClick={() => onPlayerSelect && onPlayerSelect(player)}
        />
      ))}
    </tbody>
  );
};

export default PlayerInfoList;
