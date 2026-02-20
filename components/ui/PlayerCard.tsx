import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import ImgPlayer from "./ImgPlayer";
import Icon from "@/components/ui/Icon";
import close from "@/public/icons/close.svg";

const cardVariants = cva("relative flex shrink-0", {
  variants: {
    type: {
      L: "flex-col items-center gap-y-1 w-[6.75rem]",
      S: "flex-col items-center gap-y-1 w-[5.25rem]",
      XS: "flex-col items-center gap-y-1 w-[4.25rem]",
    },
  },
  defaultVariants: {
    type: "L",
  },
});

interface PlayerCardProps extends VariantProps<typeof cardVariants> {
  imgUrl: string;
  playerName: string;
  playerSeason?: string;
  onDelete?: () => void;
  className?: string;
}

const PlayerCard = ({
  type = "L",
  imgUrl,
  playerName,
  playerSeason,
  onDelete,
  className,
}: PlayerCardProps) => {
  const isXS = type === "XS";

  return (
    <div className={cn(cardVariants({ type }), "relative", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[5px] bg-gray-200 shrink-0 bg-transparent",
          type === "L" && "w-16 h-21",
          type === "S" && "w-12 h-16",
          type === "XS" && "w-8 h-10",
        )}
      >
        <ImgPlayer
          src={imgUrl}
          alt={playerName}
          className="scale-[2] origin-top bg-transparent w-full h-full"
        />
      </div>
      {isXS && onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-1 right-1 z-10 text-Fill_Primary cursor-pointer hover:scale-110 transition-transform"
        >
          <Icon src={close} alt="close-icon" width={16} height={16} />
        </button>
      )}

      <div className="flex items-center justify-center w-full">
        {!isXS && (
          <div className="flex items-center gap-x-1">
            {playerSeason && (
              <span className="text-[10px] font-semibold text-Label-Tertiary">
                {playerSeason}
              </span>
            )}
            <span className="text-[12px] font-bold text-Label-Primary truncate leading-none">
              {playerName}
            </span>
          </div>
        )}

        {isXS && (
          <span className="text-[0.6875rem] text-center font-semibold text-white truncate leading-tight">
            {playerName}
          </span>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
