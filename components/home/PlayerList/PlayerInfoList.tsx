"use client";

import React from "react";
import PlayerListItem, { Player } from "./PlayerListItem";
import PlayerListHeader from "./PlayerListHeader";

// Re-export Player type for convenience
export type { Player } from "./PlayerListItem";

export { PlayerListHeader };

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
