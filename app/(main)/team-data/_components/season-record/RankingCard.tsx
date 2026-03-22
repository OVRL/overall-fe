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
  const firstPlace = players[0];
  const rank2To5 = players.slice(1, 5);

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

      {/* 1위: 프로필, 메달, 이름, 해당 카테고리 값 */}
      <div className="absolute top-1.25 left-1/2 -translate-x-1/2 flex flex-col gap-3">
        <div
          className="relative cursor-pointer"
          onClick={() => firstPlace && onPlayerClick?.(firstPlace)}
          onKeyDown={(e) =>
            firstPlace &&
            (e.key === "Enter" || e.key === " ") &&
            onPlayerClick?.(firstPlace)
          }
          role={firstPlace ? "button" : undefined}
          tabIndex={firstPlace ? 0 : undefined}
          aria-label={firstPlace ? `1위 ${firstPlace.name} 선수` : undefined}
        >
          <ProfileAvatar
            size={72}
            src={firstPlace?.image ?? "/images/ovr.png"}
            alt={firstPlace ? firstPlace.name : ""}
          />
          <Icon
            src={medal}
            alt=""
            width={40}
            height={40}
            nofill
            className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2"
          />
          <div className="flex flex-col w-full mt-3">
            <span className="text-sm font-semibold text-center text-[#f7f8f8]">
              {firstPlace ? firstPlace.name : "-"}
            </span>
            <span className="text-xl font-semibold text-Label-AccentPrimary text-center">
              {firstPlace != null
                ? String(firstPlace.value).replace(/[^0-9%]/g, "") || "-"
                : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* 2~5위 리스트 */}
      <div className="w-full px-3 pt-30 pb-4 rounded-3xl bg-gray-1200 flex flex-col gap-4">
        <ul className="flex flex-col gap-2" aria-label={`${title} 상위 순위`}>
          {rank2To5.map((player, index) => (
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
