"use client";

import { cn } from "@/lib/utils";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import Icon from "@/components/ui/Icon";
import type {
  HallOfFameCategoryType,
  HallOfFameRecordItem,
} from "../../_types/hallOfFame";
import cleatsIcon from "@/public/icons/player-infos/cleats.svg";
import signpostIcon from "@/public/icons/player-infos/signpost.svg";
import shieldIcon from "@/public/icons/player-infos/shield.svg";
import whistleIcon from "@/public/icons/player-infos/whistle.svg";

const RECORD_TYPE_ICON: Record<
  Exclude<HallOfFameCategoryType, "goal">,
  typeof cleatsIcon
> = {
  assist: cleatsIcon,
  starter: signpostIcon,
  defence: shieldIcon,
  attend: whistleIcon,
};

interface HallOfFameRecordCardProps {
  item: HallOfFameRecordItem;
  onMoreClick?: () => void;
  onPlayerClick?: () => void;
  className?: string;
}

const HallOfFameRecordCard = ({
  item,
  onMoreClick,
  onPlayerClick,
  className,
}: HallOfFameRecordCardProps) => {
  const { categoryLabel, categoryType, player } = item;

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl bg-[#151515] h-58.5 w-full p-4",
        className,
      )}
      aria-label={categoryLabel}
    >
      <div className="flex items-center gap-2">
        {categoryType !== "goal" && (
          <Icon
            src={RECORD_TYPE_ICON[categoryType]}
            alt=""
            width={48}
            height={48}
            nofill
            className="shrink-0 size-12 text-Label-Secondary"
          />
        )}
        <h3 className="text-lg font-bold text-white whitespace-nowrap">
          {categoryLabel}
        </h3>
      </div>

      <div className="absolute bottom-7.5 left-7.5 flex items-end gap-5">
        <button
          type="button"
          onClick={onPlayerClick}
          className="flex h-18 w-18 shrink-0 overflow-hidden rounded-full border border-gray-1000 focus:outline-none focus-visible:ring-2 focus-visible:ring-Fill_AccentPrimary"
          aria-label={`${player.name} 선수 상세 보기`}
        >
          <ProfileAvatar
            src={player.image ?? "/images/player/img_player_1.webp"}
            alt={player.name}
            size={72}
          />
        </button>
        <div className="flex flex-col">
          <p className="font-bold text-white">{player.name}</p>
          <div className="flex items-center gap-2.5">
            <span className="text-[2.6875rem] font-bold leading-none text-Fill_AccentPrimary tabular-nums">
              {player.value}
            </span>
            <span className="text-xl font-bold text-gray-800">
              {player.unit}
            </span>
          </div>
        </div>
      </div>

      {onMoreClick && (
        <button
          type="button"
          onClick={onMoreClick}
          className="absolute bottom-0 right-4 text-xs font-normal text-gray-800 hover:text-Label-Secondary focus:outline-none focus-visible:underline"
        >
          전체 순위 보기
        </button>
      )}
    </article>
  );
};

export default HallOfFameRecordCard;
