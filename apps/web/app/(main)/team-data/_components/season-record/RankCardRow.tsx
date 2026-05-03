import PositionChip from "@/components/PositionChip";
import type { Player } from "../../_types/player";
import { Racing_Sans_One } from "next/font/google";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { getPlayerPlaceholderSrc } from "@/lib/playerPlaceholderImage";

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
      <div className="flex items-center gap-3">
        <span
          className={`${racingSansOne.className} text-Label-Primary text-sm text-center shrink-0 w-7.5`}
          aria-hidden
        >
          {index + 2}
        </span>
        <div className="flex gap-4 items-center">
          <ProfileAvatar
            src={player.image}
            fallbackSrc={
              player.imageFallbackUrl ??
              getPlayerPlaceholderSrc(`m:${player.id}`)
            }
            alt={player.name}
            size={36}
            className="object-cover"
          />
          <div className="flex items-center gap-1 flex-1">
            <span className="text-sm text-Label-Primary truncate w-18.75">
              {player.name}
            </span>
          </div>
        </div>
      </div>
      <span className="w-12.25 font-bold text-Label-Primary text-sm text-center">
        {String(player.value).replace(/[^0-9%]/g, "")}
      </span>
    </li>
  );
};

export default RankCardRow;
