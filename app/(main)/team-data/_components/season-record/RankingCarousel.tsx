import { useMemo } from "react";
import type { Player } from "../../_types/player";
import { formatPlayerValue } from "../../_constants/playerTableColumns";
import {
  SORTABLE_RANKING_CATEGORY_KEYS,
  getTop5PlayersByCategory,
  getSortedPlayersByCategory,
} from "../../_lib/getTop5PlayersByCategory";
import RankingCard from "./RankingCard";
import CarouselNavButton from "./CarouselNavButton";
import { useDraggableScroll } from "@/hooks/useDraggableScroll";

interface RankingCarouselProps {
  allPlayers: Player[];
  onMoreClick: (category: string, players: Player[]) => void;
  onPlayerClick: (player: Player) => void;
}

export default function RankingCarousel({
  allPlayers,
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

  // 카테고리별 상위 5명 + 표시용 value 세팅 (allPlayers 변경 시에만 재계산)
  const categoryCards = useMemo(() => {
    return SORTABLE_RANKING_CATEGORY_KEYS.map((categoryKey) => {
      const top5 = getTop5PlayersByCategory(allPlayers, categoryKey);
      const top5WithValue = top5.map((p) => ({
        ...p,
        value: formatPlayerValue(p, categoryKey),
      }));
      const sortedAll = getSortedPlayersByCategory(allPlayers, categoryKey);
      const sortedAllWithValue = sortedAll.map((p) => ({
        ...p,
        value: formatPlayerValue(p, categoryKey),
      }));
      return {
        categoryKey,
        top5WithValue,
        sortedAllWithValue,
      };
    });
  }, [allPlayers]);

  return (
    <section aria-label="시즌 기록 순위" className="relative group">
      <CarouselNavButton
        direction="left"
        onClick={() => scroll("left")}
        ariaLabel="이전 순위 카드"
        visible={showLeftArrow}
      />

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
        {categoryCards.map(({ categoryKey, top5WithValue, sortedAllWithValue }) => (
          <RankingCard
            key={categoryKey}
            title={categoryKey}
            players={top5WithValue}
            onMoreClick={() => onMoreClick(categoryKey, sortedAllWithValue)}
            onPlayerClick={onPlayerClick}
          />
        ))}
      </div>

      <CarouselNavButton
        direction="right"
        onClick={() => scroll("right")}
        ariaLabel="다음 순위 카드"
        visible={showRightArrow}
      />
    </section>
  );
}
