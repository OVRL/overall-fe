import RankingCarousel from "./RankingCarousel";
import PlayerListBoard from "./PlayerListBoard";
import type { Player } from "../../_types/player";

interface SeasonRecordSectionProps {
  allPlayers: Player[];
  onMoreClick: (category: string, players: Player[]) => void;
  onPlayerClick: (player: Player) => void;
}

const SeasonRecordSection = ({
  allPlayers,
  onMoreClick,
  onPlayerClick,
}: SeasonRecordSectionProps) => {
  return (
    <>
      <RankingCarousel
        onMoreClick={onMoreClick}
        onPlayerClick={onPlayerClick}
      />
      <PlayerListBoard
        initialPlayers={allPlayers}
        onPlayerClick={onPlayerClick}
      />
    </>
  );
};

export default SeasonRecordSection;
