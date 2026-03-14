import PositionChip from "@/components/PositionChip";
import type { Player } from "../../_types/player";
import { Racing_Sans_One } from "next/font/google";
import ProfileAvatar from "@/components/ui/ProfileAvatar";

const racingSansOne = Racing_Sans_One({
  weight: "400",
  subsets: ["latin"],
});

export interface RankCardRowProps {
  player: Player;
  index: number;
  onPlayerClick?: (player: Player) => void;
}

const RankCardRow = ({ player, index, onPlayerClick }: RankCardRowProps) => {
  return (
    <li
      className="flex items-center justify-between cursor-pointer group"
      onClick={() => onPlayerClick?.(player)}
      aria-label={`${index + 1}위 ${player.name} 선수`}
    >
      <span
        className={`${racingSansOne.className} text-Label-Primary text-sm text-center shrink-0 w-7.5`}
        aria-hidden
      >
        {index + 1}
      </span>
      <div className="flex gap-2 items-center">
        <ProfileAvatar
          src={player.image || "/images/ovr.png"}
          alt={player.name}
          size={36}
          className="object-cover"
        />
        <div className="flex items-center gap-1 flex-1">
          <div className="w-10.5">
            <PositionChip position={player.position} variant="outline" />
          </div>
          <span className="text-sm text-Label-Primary truncate w-18.75">
            {player.name}
          </span>
        </div>
      </div>
      <span className="w-12.25 font-bold text-Label-Primary text-sm text-center">
        {String(player.value).replace(/[^0-9%]/g, "")}
      </span>
    </li>
  );
};

export default RankCardRow;
