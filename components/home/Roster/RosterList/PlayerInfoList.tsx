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

const PlayerInfoList = ({
  id,
  players,
  showHeader = true,
  onPlayerSelect,
}: PlayerInfoListProps) => {
  return (
    <div id={id} className="w-full flex flex-col rounded-tl-xl overflow-hidden">
      {showHeader && <PlayerListHeader />}
      {players.map((player) => (
        <PlayerListItem
          key={player.id}
          player={player}
          onClick={() => onPlayerSelect && onPlayerSelect(player)}
        />
      ))}
    </div>
  );
};

export default PlayerInfoList;
