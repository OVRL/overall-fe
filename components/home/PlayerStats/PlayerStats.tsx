import { Player } from "@/types/player";
import PlayerStatRow from "./PlayerStatRow";

interface PlayerStatsProps {
  player: Player;
}

const PlayerStats = ({ player }: PlayerStatsProps) => {
  return (
    <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      <PlayerStatRow label="출장" value="25" />
      <PlayerStatRow label="오버롤" value={player.overall.toString()} />
      <PlayerStatRow label="골" value={player.shooting.toString()} />
      <PlayerStatRow label="어시" value={player.passing.toString()} />
      <PlayerStatRow label="기점" value={player.defending.toString()} />
      <PlayerStatRow label="클린시트" value={player.physical.toString()} />
      <PlayerStatRow label="주발" value="오른발" />
      <PlayerStatRow label="슈팅" value="50%" />
    </div>
  );
};

export default PlayerStats;
