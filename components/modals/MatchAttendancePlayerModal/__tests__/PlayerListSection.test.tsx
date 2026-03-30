import { render, screen, fireEvent } from "@testing-library/react";
import PlayerListSection from "../PlayerListSection";
import type { PendingPlayerItem } from "@/hooks/usePlayerSearch";

// Mocking child components for simplified testing
jest.mock("../_components/PlayerItem", () => {
  return function MockPlayerItem({ player, isSelected, onSelect }: any) {
    return (
      <div data-testid="player-item" onClick={onSelect}>
        {player.name} - {isSelected ? "Selected" : "Not Selected"}
      </div>
    );
  };
});

jest.mock("@/components/ui/SearchState", () => ({
  SearchLoadingList: () => <div data-testid="search-loading">로딩 중...</div>,
  SearchEmptyState: ({ message }: { message: string }) => (
    <div data-testid="search-empty">{message}</div>
  ),
}));

describe("PlayerListSection", () => {
  const mockOnToggle = jest.fn();

  const createMockPlayer = (
    overrides?: Partial<PendingPlayerItem>,
  ): PendingPlayerItem => ({
    id: 1,
    teamMemberId: 1,
    userId: 1,
    memberType: "MEMBER",
    name: "손흥민",
    position: "FW",
    number: 7,
    overall: 90,
    currentStatus: null,
    originalStatus: null,
    ...overrides,
  });

  const defaultProps = {
    keyword: "",
    isSearching: false,
    results: [],
    mercenary: null,
    pendingChanges: new Map<number, PendingPlayerItem>(),
    onToggle: mockOnToggle,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("isSearching이 true일 때 SearchLoadingList가 렌더링되어야 한다", () => {
    render(<PlayerListSection {...defaultProps} isSearching={true} />);
    expect(screen.getByTestId("search-loading")).toBeInTheDocument();
  });

  it("검색어(keyword)가 존재하지만 검색 결과(results)가 없으면 SearchEmptyState가 렌더링되어야 한다", () => {
    render(
      <PlayerListSection {...defaultProps} keyword="없는선수" results={[]} />,
    );
    expect(screen.getByTestId("search-empty")).toBeInTheDocument();
  });

  it("검색 결과가 존재할 경우 PlayerItem 요소들이 렌더링되어야 한다", () => {
    const player1 = createMockPlayer({ id: 1, teamMemberId: 1, name: "선수1" });
    const player2 = createMockPlayer({ id: 2, teamMemberId: 2, name: "선수2" });

    render(
      <PlayerListSection
        {...defaultProps}
        keyword="선수"
        results={[player1, player2]}
      />,
    );

    const items = screen.getAllByTestId("player-item");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("선수1");
    expect(items[1]).toHaveTextContent("선수2");
  });

  it("mercenary가 존재하고 검색 중이 아니면 용병으로 추가 섹션이 렌더링되어야 한다", () => {
    const mercenary = createMockPlayer({
      id: -1,
      teamMemberId: -1,
      memberType: "MERCENARY",
      name: "용병1",
    });

    render(<PlayerListSection {...defaultProps} mercenary={mercenary} />);

    expect(screen.getByText("용병으로 추가")).toBeInTheDocument();
    const items = screen.getAllByTestId("player-item");
    // 용병 하나만 렌더링됨 (results는 비어있음)
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent("용병1");
  });

  it("pendingChanges가 존재하면 변경 사항 미리보기 섹션이 렌더링되어야 한다", () => {
    const pendingChanges = new Map<number, PendingPlayerItem>();
    const pendingPlayer = createMockPlayer({
      id: 1,
      teamMemberId: 1,
      name: "추가될 선수",
      position: "MF",
      currentStatus: "ATTEND",
    });
    pendingChanges.set(1, pendingPlayer);

    render(
      <PlayerListSection {...defaultProps} pendingChanges={pendingChanges} />,
    );

    expect(screen.getByText("변경 사항 미리보기")).toBeInTheDocument();
    expect(screen.getByText("추가될 선수")).toBeInTheDocument();
    expect(screen.getByText("참석 추가")).toBeInTheDocument();
    expect(screen.getByText("MF")).toBeInTheDocument(); // PositionChip 렌더링 검증용
  });

  it("PlayerItem 클릭 시 onToggle 콜백이 호출되어야 한다", () => {
    const player = createMockPlayer({ id: 1, teamMemberId: 1, name: "선수1" });

    render(
      <PlayerListSection {...defaultProps} keyword="선수" results={[player]} />,
    );

    fireEvent.click(screen.getByTestId("player-item"));
    expect(mockOnToggle).toHaveBeenCalledWith(player);
  });
});
