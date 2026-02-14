import MainProfileCard from "@/components/ui/MainProfileCard";
import { Position } from "@/types/position";

import { Player } from "@/types/player";
import PlayerStats from "@/components/home/PlayerStats/PlayerStats";

interface PlayerCardProps {
  player: Player;
}

const RosterDetail = ({ player }: PlayerCardProps) => {
  return (
    <div className="mt-4 md:mt-0">
      <div className="flex gap-3 md:gap-4">
        <div className="relative shrink-0 flex justify-center">
          <div className="origin-top">
            <MainProfileCard
              imgUrl={player.image || "/images/ovr.png"}
              playerName={player.name}
              mainPosition={player.position as Position}
              backNumber={player.number}
              className="shadow-lg"
            />
          </div>
        </div>
        <PlayerStats player={player} />
      </div>
    </div>
  );
};

export default RosterDetail;
