import RosterDetail from "./RosterDetail";
import RosterList from "./RosterList";
import { Player } from "@/types/player";
import Button from "@/components/ui/Button";

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
    <aside className={`h-full  p-4 flex flex-col gap-3  ${className}`}>
      {selectedPlayer && <RosterDetail player={selectedPlayer} />}
      <Button variant="line" size="m">
        선수 정보 더보기
      </Button>
      <RosterList players={players} onPlayerSelect={onPlayerSelect} />
    </aside>
  );
};

export default PlayerRosterPanel;
