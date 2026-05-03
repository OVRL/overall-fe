import { cn } from "@/lib/utils";
import ImgPlayer from "@/components/ui/ImgPlayer";
import Icon from "@/components/ui/Icon";
import type { HallOfFameFeatureItem } from "../../_types/hallOfFame";
import ballIcon from "@/public/icons/player-infos/ball.svg";
import trendingUpIcon from "@/public/icons/trending_up.svg";
import {
  getHallOfFamePlayerImageFallbackUrl,
  getHallOfFamePlayerImageRawUrl,
} from "@/lib/playerPlaceholderImage";

interface HallOfFameFeatureCardProps {
  item: HallOfFameFeatureItem;
  className?: string;
}

const HallOfFameFeatureCard = ({
  item,
  className,
}: HallOfFameFeatureCardProps) => {
  const { categoryLabel, player } = item;

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[1.25rem] bg-[#151515] w-full min-w-84 lg:max-w-108 h-121",
        className,
      )}
      aria-label={categoryLabel}
    >
      <div className="flex items-center justify-between p-4 w-full relative z-10">
        <div className="flex items-center gap-2">
          <div className="relative size-12 shrink-0 flex items-center justify-center text-Label-Secondary">
            <Icon src={ballIcon} alt="" width={48} height={48} nofill />
          </div>
          <h3 className="text-lg font-bold text-white whitespace-nowrap">
            {categoryLabel}
          </h3>
        </div>
        <button
          type="button"
          className="mr-3 text-xs font-normal text-gray-800 hover:text-Label-Secondary focus:outline-none focus-visible:underline cursor-pointer"
        >
          전체 순위
        </button>
      </div>

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center size-fit">
        <div className="relative">
          <div
            className="size-50 rounded-[6.25rem] bg-Fill_AccentPrimary opacity-40 blur-2xl"
            aria-hidden
          />
          <div className="absolute -top-12.5 left-0 size-50">
            <ImgPlayer
              src={getHallOfFamePlayerImageRawUrl(player) || undefined}
              fallbackSrc={getHallOfFamePlayerImageFallbackUrl(player)}
              alt={player.name}
              className="size-full object-cover"
            />
          </div>

          <div className="absolute top-43.75 left-1/2 flex w-[103px] -translate-x-1/2 flex-col items-center gap-4">
            <p className="mt-2 text-2xl font-semibold text-white">{player.name}</p>
            <div className="flex items-baseline gap-2.5">
              <span className="text-[3.5rem] font-black leading-none text-Fill_AccentPrimary tabular-nums">
                {player.value}
              </span>
              <span className="relative bottom-1 text-xl font-semibold text-gray-800">
                {player.unit}
              </span>
            </div>
            {player.yearOverYear && (
              <div className="flex w-full items-center justify-between gap-1">
                <Icon
                  src={trendingUpIcon}
                  width={16}
                  height={16}
                  nofill
                  className="size-4 shrink-0 text-gray-500"
                  alt=""
                />
                <span className="text-sm font-semibold text-gray-500">
                  {player.yearOverYear}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default HallOfFameFeatureCard;
