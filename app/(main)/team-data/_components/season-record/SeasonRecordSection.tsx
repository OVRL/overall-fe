import RankingCarousel from "./RankingCarousel";
import PlayerListBoard from "./PlayerListBoard";
import type { Player } from "../../_types/player";

interface SeasonRecordSectionProps {
  onMoreClick: (category: string, players: Player[]) => void;
  onPlayerClick: (player: Player) => void;
  allPlayers: Player[];
}

const SeasonRecordSection = ({
  onMoreClick,
  onPlayerClick,
  allPlayers,
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
