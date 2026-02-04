import { cn } from "@/lib/utils";
import ImgPlayer from "./ImgPlayer";
import PositionChip from "../PositionChip";
import { Position } from "@/types/position";
import PlayerProfileDim from "./PlayerProfileDim";

interface MainProfileCardProps {
  imgUrl: string;
  bgUrl: string;
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
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      <div className="absolute top-4 left-2 w-50 h-50 scale-90 origin-top-left pointer-events-none">
        <ImgPlayer
          src={imgUrl}
          alt={playerName}
          className="w-full h-full bg-transparent"
        />
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full text-center z-10">
        <span className="text-sm font-bold text-white drop-shadow-md">
          {playerName}
        </span>
      </div>

      <div className="absolute flex flex-col justify-center items-center top-2 left-1.75">
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
