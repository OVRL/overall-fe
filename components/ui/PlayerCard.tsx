import { cva, type VariantProps } from "class-variance-authority";
import { cn, MOCK_IMAGE_SRC } from "@/lib/utils";
import ImgPlayer from "./ImgPlayer";
import Icon from "@/components/ui/Icon";
import close from "@/public/icons/close.svg";
import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";

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
  /** 원본 이미지 URL */
  imgUrl?: string | null;
  /** 무효·로드 실패 시 */
  imgFallbackSrc?: string;
  playerName: string;
  playerSeason?: string;
  onDelete?: () => void;
  className?: string;
}

const PlayerCard = ({
  type = "L",
  imgUrl,
  imgFallbackSrc = MOCK_IMAGE_SRC,
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
          "relative overflow-hidden shrink-0 bg-transparent",
          type === "L" && "w-16 h-21",
          type === "S" && "w-12 h-16",
          type === "XS" && "w-8 h-10",
        )}
      >
        <ImgPlayer
          src={imgUrl}
          fallbackSrc={imgFallbackSrc}
          alt={playerName}
          className="scale-[2] origin-top bg-transparent w-full h-full"
        />
      </div>
      {isXS && onDelete && (
        <button
          onClick={onDelete}
          className={cn(
            "absolute z-10 text-Fill_Primary cursor-pointer hover:scale-110 transition-transform",
            // pretext를 이용한 이름 너비 측정 및 버튼 위치 동적 조정 (사용자 요청 반영)
            (() => {
              try {
                const prepared = prepareWithSegments(playerName, "600 0.6875rem Inter, system-ui, sans-serif");
                // 아주 넓은 공간에 배치하여 실제 텍스트 너비를 얻음
                const { lines } = layoutWithLines(prepared, 200, 16);
                const textWidth = lines[0]?.width || 0;
                // 이름이 길어 겹칠 우려가 있으면 위치를 상단으로 조금 더 올리거나 우측 끝으로 밀착
                return textWidth > 58 ? "-top-1 -right-1" : "top-0 right-0";
              } catch (e) {
                return "top-0 right-0";
              }
            })()
          )}
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
