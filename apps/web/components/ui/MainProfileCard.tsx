import Image from "next/image";
import { cn, MOCK_IMAGE_SRC } from "@/lib/utils";
import PositionChip from "../PositionChip";
import { Position } from "@/types/position";
import PlayerProfileDim from "./PlayerProfileDim";
import { CARD_THEME_MAP, CardGrade } from "@/constants/playerCard";
import { MainProfileCardPlayerPortrait } from "./MainProfileCardPlayerPortrait";

interface MainProfileCardProps {
  /** 원본 선수 이미지 URL */
  imgUrl?: string | null;
  /** 무효·로드 실패 시 */
  imgFallbackSrc?: string;
  grade?: CardGrade;
  playerName: string;
  mainPosition: Position;
  backNumber: number;
  className?: string;
  nameClassName?: string;
  numberClassName?: string;
  positionClassName?: string;
  /** LCP 이미지일 때 true (above the fold) */
  imagePriority?: boolean;
}

const MainProfileCard = ({
  imgUrl,
  imgFallbackSrc = MOCK_IMAGE_SRC,
  grade = "NORMAL_GREEN",
  playerName,
  mainPosition,
  backNumber,
  className,
  nameClassName,
  numberClassName,
  positionClassName,
  imagePriority,
}: MainProfileCardProps) => {
  const theme = CARD_THEME_MAP[grade];
  const cardSizes = "(max-width: 768px) 33vw, 128px";
  return (
    <div
      className={cn(
        "relative w-32 h-42 bg-cover bg-center rounded-[0.625rem] overflow-hidden shadow-md",
        className,
      )}
    >
      <Image
        src={theme.bgUrl}
        alt={`${playerName} background card`}
        fill
        sizes={cardSizes}
        priority={imagePriority}
        className="object-cover"
      />
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
        <div className="relative w-full h-full">
          <MainProfileCardPlayerPortrait
            imgUrl={imgUrl}
            imgFallbackSrc={imgFallbackSrc}
            alt={playerName}
            sizes={cardSizes}
            imagePriority={imagePriority}
          />
        </div>
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full text-center z-20">
        <span
          className={cn(
            "text-sm font-bold text-white drop-shadow-md",
            theme.nameClassName,
            nameClassName,
          )}
        >
          {playerName}
        </span>
      </div>

      <div className="absolute flex flex-col justify-center items-center top-2 left-1.75 z-20">
        <span
          className={cn(
            "text-2xl font-bold text-white leading-8 drop-shadow-md",
            theme.numberClassName,
            numberClassName,
          )}
        >
          {backNumber}
        </span>

        <PositionChip
          position={mainPosition}
          variant={theme.positionVariant || "filled"}
          className={cn(
            "text-[10px] px-1 py-0.5 h-auto",
            theme.positionClassName,
            positionClassName,
          )}
        />
      </div>
      <PlayerProfileDim />
    </div>
  );
};

export default MainProfileCard;
