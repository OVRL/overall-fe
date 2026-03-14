import Button from "@/components/ui/Button";
import type { Player } from "../../_types/player";
import RankCardRow from "./RankCardRow";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import Icon from "@/components/ui/Icon";
import medal from "@/public/icons/gold_medal.svg";

export interface RankingCardProps {
  title: string;
  players: Player[];
  onMoreClick?: () => void;
  onPlayerClick?: (player: Player) => void;
}

const RankingCard = ({
  title,
  players,
  onMoreClick,
  onPlayerClick,
}: RankingCardProps) => {
  const top4Players = players.slice(0, 4);

  return (
    <article
      className="flex flex-col w-76 h-100 shrink-0 relative select-none"
      aria-labelledby={`ranking-card-${title.replace(/\s/g, "-")}`}
    >
      <h3
        id={`ranking-card-${title.replace(/\s/g, "-")}`}
        className="text-sm font-semibold text-[#f7f8f8] mt-3.5 ml-3 w-19.5 mb-2 h-4.5"
      >
        {title}
      </h3>

      <div className="absolute top-1.25 left-1/2 -translate-x-1/2 flex flex-col gap-3">
        <div className="relative">
          <ProfileAvatar
            size={72}
            src="/images/player/img_player_1.webp"
            alt=""
          />
          <Icon
            src={medal}
            alt=""
            width={40}
            height={40}
            nofill
            className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2"
          />
          <div className="flex flex-col w-full">
            <span className="text-sm font-semibold text-center text-[#f7f8f8]">
              {title}
            </span>
            <span className="text-xl font-semibold text-Label-AccentPrimary text-center ">
              100
            </span>
          </div>
        </div>
      </div>

      <div className="w-full px-3 pt-30 pb-4 rounded-3xl bg-gray-1200 flex flex-col gap-4">
        <ul className="flex flex-col gap-2" aria-label={`${title} 상위 순위`}>
          {top4Players.map((player, index) => (
            <RankCardRow
              key={player.id}
              player={player}
              index={index}
              onPlayerClick={onPlayerClick}
            />
          ))}
        </ul>

        <Button onClick={onMoreClick} size="m" variant="line">
          더보기
        </Button>
      </div>
    </article>
  );
};

export default RankingCard;
