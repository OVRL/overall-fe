"use client";

import PositionChip from "@/components/PositionChip";
import { Position } from "@/types/position";
import PlayerListItem from "@/components/home/PlayerList/PlayerListItem";
import type { Player } from "@/components/home/PlayerList/PlayerListItem";

// Re-export Player type for external usage
export type { Player };

/**
 * 테이블 헤더 컴포넌트
 */
export const PlayerListHeader = () => (
  <div className="grid grid-cols-[2.8125rem_1.875rem_1fr_2.8125rem] md:grid-cols-[3.75rem_3.125rem_1fr_3.125rem] items-center gap-1 md:gap-4 px-2 md:px-3 py-2 text-gray-500 text-xs md:text-xs border-b border-gray-800 whitespace-nowrap">
    <span>포지션</span>
    <span className="text-center">등번호</span>
    <span>선수명</span>
    <span className="text-right">OVR</span>
  </div>
);

interface PlayerInfoListProps {
  players: Player[];
  showHeader?: boolean;
  onPlayerSelect?: (player: Player) => void;
}

/**
 * 선수 정보 리스트 컴포넌트
 */
const PlayerInfoList = ({
  players,
  showHeader = true,
  onPlayerSelect,
}: PlayerInfoListProps) => {
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

