import type { Player } from "../_types/player";
import { statsData, getPlayerValue } from "../_constants/mockPlayers";
import RankingCard from "./RankingCard";
import { useDraggableScroll } from "@/hooks/useDraggableScroll";
import arrowBack from "@/public/icons/arrow_back.svg";
import arrowForward from "@/public/icons/arrow_forward.svg";
import Icon from "@/components/ui/Icon";
interface RankingCarouselProps {
  onMoreClick: (category: string, players: Player[]) => void;
  onPlayerClick: (player: Player) => void;
}

export default function RankingCarousel({
  onMoreClick,
  onPlayerClick,
}: RankingCarouselProps) {
  const {
    scrollContainerRef,
    showLeftArrow,
    showRightArrow,
    scroll,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onMouseMove,
    checkScrollButtons,
  } = useDraggableScroll();

  return (
    <div className="relative group">
      {/* PC에서만 보이는 왼쪽 스크롤 버튼 */}
      {showLeftArrow && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-Fill_AccentPrimary opacity-0 shadow-lg transition-all duration-300 md:flex cursor-pointer group-hover:opacity-100 hover:bg-Fill_AccentPrimary/80 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Fill_AccentPrimary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="Previous"
        >
          <Icon src={arrowBack} alt="arrowBack" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide md:mx-0 md:pl-0 md:pr-40 cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onScroll={checkScrollButtons}
      >
        {Object.entries(statsData).map(([title, players]) => (
          <RankingCard
            key={title}
            title={title}
            players={players.map((p) => ({
              ...p,
              value: getPlayerValue(p, title),
            }))}
            onMoreClick={() => onMoreClick(title, players as Player[])}
            onPlayerClick={onPlayerClick}
          />
        ))}
      </div>

      {/* PC에서만 보이는 오른쪽 스크롤 버튼 */}
      {showRightArrow && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-Fill_AccentPrimary opacity-0 shadow-lg transition-all duration-300 md:flex cursor-pointer group-hover:opacity-100 hover:bg-Fill_AccentPrimary/80 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Fill_AccentPrimary focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="Next"
        >
          <Icon src={arrowForward} alt="arrowForward" />
        </button>
      )}
    </div>
  );
}
