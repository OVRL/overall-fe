import PlayerInfoList from "./PlayerInfoList";
import { Player } from "@/types/player";
import PlayerListCategory from "./PlayerListCategory";
import { usePlayerSort } from "@/hooks/usePlayerSort";

const RosterList = ({
  players,
  onPlayerSelect,
}: {
  players: Player[];
  onPlayerSelect?: (player: Player) => void;
}) => {
  const { sortedPlayers, sortConfig, handleSort } = usePlayerSort(players);

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div
        className="w-full flex flex-col gap-y-1"
        role="table"
        aria-label="선수 명단"
      >
        <PlayerListCategory sortConfig={sortConfig} onSort={handleSort} />
        <PlayerInfoList
          players={sortedPlayers}
          onPlayerSelect={onPlayerSelect}
          showHeader={false}
        />
      </div>

      {/* Empty State */}
      {players.length === 0 && (
        <div className="text-gray-500 text-center py-10">선수가 없습니다.</div>
      )}
    </div>
  );
};

export default RosterList;
