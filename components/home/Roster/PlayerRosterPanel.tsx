import RosterDetail from "./RosterDetail";
import RosterList from "./RosterList";
import { Player } from "@/types/player";

interface PlayerRosterPanelProps {
  players: Player[];
  selectedPlayer: Player | null;
  onPlayerSelect: (player: Player) => void;
  className?: string;
}

const PlayerRosterPanel = ({
  players,
  selectedPlayer,
  onPlayerSelect,
  className,
}: PlayerRosterPanelProps) => {
  return (
    <aside className={`h-full p-4 flex flex-col gap-3  ${className}`}>
      {selectedPlayer && <RosterDetail player={selectedPlayer} />}
      <RosterList players={players} onPlayerSelect={onPlayerSelect} />
    </aside>
  );
};

export default PlayerRosterPanel;
