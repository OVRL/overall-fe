import { render, screen, fireEvent } from "@testing-library/react";
import RankingCarousel from "../season-record/RankingCarousel";
import { SORTABLE_RANKING_CATEGORY_KEYS } from "../../_lib/getTop5PlayersByCategory";

jest.mock("../season-record/RankingCard", () => ({
  __esModule: true,
  default: ({ title, onMoreClick }: any) => (
    <div data-testid="ranking-card">
      <h3>{title}</h3>
      <button onClick={onMoreClick}>더보기 {title}</button>
    </div>
  ),
}));

jest.mock("@/hooks/useDraggableScroll", () => ({
  useDraggableScroll: () => ({
    scrollContainerRef: { current: null },
    onMouseDown: jest.fn(),
    onMouseLeave: jest.fn(),
    onMouseUp: jest.fn(),
    onMouseMove: jest.fn(),
    checkScrollButtons: jest.fn(),
  }),
}));

describe("RankingCarousel 컴포넌트", () => {
  const mockOnMoreClick = jest.fn();
  const mockOnPlayerClick = jest.fn();

  it("정렬 가능 카테고리마다 RankingCard를 렌더링해야 한다", () => {
    render(
      <RankingCarousel
        allPlayers={[]}
        onMoreClick={mockOnMoreClick}
        onPlayerClick={mockOnPlayerClick}
      />,
    );

    const cards = screen.getAllByTestId("ranking-card");
    expect(cards).toHaveLength(SORTABLE_RANKING_CATEGORY_KEYS.length);
    SORTABLE_RANKING_CATEGORY_KEYS.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it("순위 섹션에 접근 가능한 이름(aria-label)이 있어야 한다", () => {
    render(
      <RankingCarousel
        allPlayers={[]}
        onMoreClick={mockOnMoreClick}
        onPlayerClick={mockOnPlayerClick}
      />,
    );

    expect(
      screen.getByRole("region", { name: "시즌 기록 순위" }),
    ).toBeInTheDocument();
  });

  it("RankingCard의 더보기 클릭 시 onMoreClick 콜백이 호출되어야 한다", () => {
    render(
      <RankingCarousel
        allPlayers={[]}
        onMoreClick={mockOnMoreClick}
        onPlayerClick={mockOnPlayerClick}
      />,
    );

    const firstCategory = SORTABLE_RANKING_CATEGORY_KEYS[0];
    const moreButton = screen.getByText(`더보기 ${firstCategory}`);

    fireEvent.click(moreButton);
    expect(mockOnMoreClick).toHaveBeenCalledWith(
      firstCategory,
      expect.any(Array),
    );
  });
});
