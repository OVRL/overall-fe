import React from "react";
import type { PlayerStats } from "@/app/(main)/team-data/_types/player";
import Icon from "@/components/ui/Icon";

import cleatsIcon from "@/public/icons/player-infos/cleats.svg";
import ballIcon from "@/public/icons/player-infos/ball.svg";
import signpostIcon from "@/public/icons/player-infos/signpost.svg";
import whistleIcon from "@/public/icons/player-infos/whistle.svg";
import shieldIcon from "@/public/icons/player-infos/shield.svg";
import trophyIcon from "@/public/icons/player-infos/trophy.svg";

interface StatGridProps {
  stats: PlayerStats;
}

import { StaticImageData } from "next/image";

// 스탯 라벨에 따른 아이콘 매핑 (확장성 고려)
const STAT_ICONS: Record<string, StaticImageData> = {
  출장: whistleIcon,
  골: ballIcon,
  도움: cleatsIcon,
  기점: signpostIcon,
  클린시트: shieldIcon,
  승률: trophyIcon,
};

const StatGrid = ({ stats }: StatGridProps) => {
  const statItems = [
    { label: "출장", value: stats.출장 },
    { label: "골", value: stats.골 },
    { label: "도움", value: stats.어시 ?? stats.도움 ?? 0 },
    { label: "기점", value: stats.기점 },
    { label: "클린시트", value: stats.클린시트 },
    { label: "승률", value: stats.승률 },
  ];

  return (
    <div className="grid grid-cols-3 gap-1">
      {statItems.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center py-3 bg-white/5 rounded-lg relative h-14"
        >
          <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5">
            <Icon
              src={STAT_ICONS[label]}
              alt={`${label} 아이콘`}
              className="w-5 h-5"
              nofill
            />
            <span className="text-gray-400 text-[0.6875rem]">{label}</span>
          </div>
          <span className="text-white font-semibold text-sm absolute bottom-1.5 right-1.5">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatGrid;
