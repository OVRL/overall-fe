import Image from "next/image";
import { cn } from "@/lib/utils";
import PositionChip from "../PositionChip";
import { Position } from "@/types/position";
import PlayerProfileDim from "./PlayerProfileDim";

interface MainProfileCardProps {
  imgUrl: string;
  bgUrl?: string;
  playerName: string;
  mainPosition: Position;
  backNumber: number;
  className?: string;
}

const MainProfileCard = ({
  imgUrl,
  bgUrl,
  playerName,
  mainPosition,
  backNumber,
  className,
}: MainProfileCardProps) => {
  return (
    <div
      className={cn(
        "relative w-32 h-42 bg-cover bg-center rounded-[10px] overflow-hidden shadow-md",
        className,
      )}
    >
      <Image
        src={bgUrl || "/images/card-bg.webp"}
        alt={`${playerName} background card`}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
        <div className="relative w-full h-full">
          <Image
            src={imgUrl}
            alt={playerName}
            fill
            className="object-contain object-bottom z-10"
          />
        </div>
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full text-center z-20">
        <span className="text-sm font-bold text-white drop-shadow-md">
          {playerName}
        </span>
      </div>

      <div className="absolute flex flex-col justify-center items-center top-2 left-1.75 z-20">
        <span className="text-2xl font-bold text-white leading-8">
          {backNumber}
        </span>

        <PositionChip
          position={mainPosition}
          variant="filled"
          className="text-[10px] px-1 py-0.5 h-auto"
        />
      </div>
      <PlayerProfileDim />
    </div>
  );
};

export default MainProfileCard;
