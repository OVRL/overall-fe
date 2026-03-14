import { render, screen, fireEvent } from "@testing-library/react";
import RankingCarousel from "../season-record/RankingCarousel";
import { statsData } from "../../_constants/mockPlayers";

jest.mock("../season-record/RankingCard", () => ({
  __esModule: true,
  default: ({ title, onMoreClick }: any) => (
    <div data-testid="ranking-card">
      <h3>{title}</h3>
      <button onClick={onMoreClick}>더보기 {title}</button>
    </div>
  ),
}));

const mockScroll = jest.fn();
jest.mock("@/hooks/useDraggableScroll", () => ({
  useDraggableScroll: () => ({
    scrollContainerRef: { current: null },
    showLeftArrow: true,
    showRightArrow: true,
    scroll: mockScroll,
    onMouseDown: jest.fn(),
    onMouseLeave: jest.fn(),
    onMouseUp: jest.fn(),
    onMouseMove: jest.fn(),
    checkScrollButtons: jest.fn(),
  }),
}));

jest.mock("@/components/ui/Icon", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <div data-testid="icon">{alt}</div>,
}));

describe("RankingCarousel 컴포넌트", () => {
  const mockOnMoreClick = jest.fn();
  const mockOnPlayerClick = jest.fn();

  it("statsData에 정의된 모든 카테고리에 대해 RankingCard를 렌더링해야 한다", () => {
    render(
      <RankingCarousel
        onMoreClick={mockOnMoreClick}
        onPlayerClick={mockOnPlayerClick}
      />,
    );

    const categories = Object.keys(statsData);
    const cards = screen.getAllByTestId("ranking-card");

    expect(cards).toHaveLength(categories.length);
    categories.forEach((category) => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it("스크롤 버튼 클릭 시 scroll 함수가 호출되어야 한다", () => {
    render(
      <RankingCarousel
        onMoreClick={mockOnMoreClick}
        onPlayerClick={mockOnPlayerClick}
      />,
    );

    const leftButton = screen.getByLabelText("이전 순위 카드");
    const rightButton = screen.getByLabelText("다음 순위 카드");

    fireEvent.click(leftButton);
    expect(mockScroll).toHaveBeenCalledWith("left");

    fireEvent.click(rightButton);
    expect(mockScroll).toHaveBeenCalledWith("right");
  });

  it("RankingCard의 더보기 클릭 시 onMoreClick 콜백이 호출되어야 한다", () => {
    render(
      <RankingCarousel
        onMoreClick={mockOnMoreClick}
        onPlayerClick={mockOnPlayerClick}
      />,
    );

    const firstCategory = Object.keys(statsData)[0];
    const moreButton = screen.getByText(`더보기 ${firstCategory}`);

    fireEvent.click(moreButton);
    expect(mockOnMoreClick).toHaveBeenCalledWith(
      firstCategory,
      expect.any(Array),
    );
  });
});
