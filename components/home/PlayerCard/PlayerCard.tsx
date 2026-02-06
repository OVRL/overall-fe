"use client";
import MainProfileCard from "@/components/ui/MainProfileCard";
import PlayerStats from "./PlayerStat";
import { Position } from "@/types/position";

import Button from "../../ui/Button";

interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  overall: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  pace: number;
  image?: string;
  season?: string;
  seasonType?: "general" | "worldBest";
}

interface PlayerCardProps {
  player: Player;
}

const DEFAULT_PLAYER_IMAGE = "/images/ovr.png";

/**
 * 선수 상세 카드 컴포넌트
 */
const PlayerCard = ({ player }: PlayerCardProps) => {
  const playerImage = player.image || DEFAULT_PLAYER_IMAGE;

  return (
    <div className="bg-surface-tertiary rounded-2xl p-4 md:p-5 mt-4 md:mt-0">
      {/* 선수 헤더 */}
      <div className="flex gap-3 md:gap-4 mb-4 md:mb-5">
        <MainProfileCard
          imgUrl={playerImage}
          playerName={player.name}
          mainPosition={player.position as Position}
          backNumber={player.number}
          className="w-24 h-32 md:w-28 md:h-36 shrink-0"
        />
        <PlayerStats player={player} />
      </div>

      {/* 버튼 */}
      <Button
        variant="ghost"
        className="w-full h-10.25 flex justify-center items-center gap-2.5 p-3 rounded-[10px] border border-[#252525] text-white text-sm font-bold transition-colors hover:bg-[#252525]"
      >
        선수 정보 더보기
      </Button>
    </div>
  );
};

export default PlayerCard;

