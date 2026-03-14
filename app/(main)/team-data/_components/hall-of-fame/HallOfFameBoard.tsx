"use client";

import type { Player } from "../../_types/player";
import type {
  HallOfFameFeatureItem,
  HallOfFameRecordItem,
  HallOfFamePlayerInfo,
} from "../../_types/hallOfFame";
import HallOfFameFeatureCard from "./HallOfFameFeatureCard";
import HallOfFameRecordCard from "./HallOfFameRecordCard";

interface HallOfFameBoardProps {
  onPlayerClick?: (player: Player) => void;
}

/** 목업: 명예의 전당 피처 1건 + 기록 4건 (API 연동 전) */
const MOCK_FEATURE: HallOfFameFeatureItem = {
  categoryType: "goal",
  categoryLabel: "통산 최다 득점",
  player: {
    id: 1,
    name: "랜디",
    image: "/images/player/img_player_1.webp",
    value: 43,
    unit: "골",
    yearOverYear: "전년 대비 +12",
  },
};

const MOCK_RECORDS: HallOfFameRecordItem[] = [
  {
    categoryType: "assist",
    categoryLabel: "통산 최다 도움",
    player: {
      id: 2,
      name: "다리알베스",
      image: "/images/player/img_player_2.webp",
      value: 24,
      unit: "도움",
    },
  },
  {
    categoryType: "starter",
    categoryLabel: "통산 최다 기점",
    player: {
      id: 3,
      name: "다리알베스",
      image: "/images/player/img_player_2.webp",
      value: 24,
      unit: "기점",
    },
  },
  {
    categoryType: "defence",
    categoryLabel: "통산 최다 클린시트",
    player: {
      id: 4,
      name: "다리알베스",
      image: "/images/player/img_player_2.webp",
      value: 24,
      unit: "회",
    },
  },
  {
    categoryType: "attend",
    categoryLabel: "통산 최다 출장",
    player: {
      id: 5,
      name: "다리알베스",
      image: "/images/player/img_player_2.webp",
      value: 24,
      unit: "회",
    },
  },
];

function toMinimalPlayer(info: HallOfFamePlayerInfo): Player {
  return {
    id: info.id ?? 0,
    name: info.name,
    team: "",
    value: info.value,
    image: info.image,
    position: "FW",
    backNumber: 0,
    ovr: 0,
  };
}

const HallOfFameBoard = ({ onPlayerClick }: HallOfFameBoardProps) => {
  return (
    <section
      className="flex flex-col gap-4 pt-12.5 lg:flex-row lg:gap-x-4"
      aria-label="명예의 전당"
    >
      <div>
        <HallOfFameFeatureCard
          item={MOCK_FEATURE}
          onMoreClick={undefined}
          onPlayerClick={
            onPlayerClick
              ? () => onPlayerClick(toMinimalPlayer(MOCK_FEATURE.player))
              : undefined
          }
        />
      </div>

      <div className="min-w-0 flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:grid-rows-2">
        {MOCK_RECORDS.map((item) => (
          <HallOfFameRecordCard
            key={item.categoryLabel}
            item={item}
            onMoreClick={undefined}
            onPlayerClick={
              onPlayerClick
                ? () => onPlayerClick(toMinimalPlayer(item.player))
                : undefined
            }
          />
        ))}
      </div>
    </section>
  );
};

export default HallOfFameBoard;
