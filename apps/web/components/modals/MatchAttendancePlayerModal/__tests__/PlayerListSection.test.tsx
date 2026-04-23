import { render, screen, fireEvent } from "@testing-library/react";
import PlayerListSection from "../PlayerListSection";
import type { PendingTeamMemberRow } from "@/types/formationRosterModal";
import type { MercenaryDraftRow } from "@/types/formationRosterModal";

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

jest.mock("@/components/PositionChip", () => ({
  __esModule: true,
  default: ({ position }: { position: string }) => (
    <span data-testid="position-chip">{position}</span>
  ),
}));

describe("PlayerListSection", () => {
  const mockToggleTeam = jest.fn();
  const mockToggleDraft = jest.fn();
  const mockToggleMercRemove = jest.fn();

  const createMockPlayer = (
    overrides?: Partial<PendingTeamMemberRow>,
  ): PendingTeamMemberRow => ({
    id: 1,
    teamMemberId: 1,
    userId: 1,
    rosterKind: "TEAM_MEMBER",
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
    results: [] as PendingTeamMemberRow[],
    existingMercenaries: [],
    mercenaryDraft: null as MercenaryDraftRow | null,
    pendingTeamMembers: new Map<number, PendingTeamMemberRow>(),
    pendingMercenaryCreates: new Set<string>(),
    pendingMercenaryDeletes: new Set<number>(),
    onToggleTeamMember: mockToggleTeam,
    onToggleMercenaryDraft: mockToggleDraft,
    onToggleMercenaryRemove: mockToggleMercRemove,
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

  it("mercenaryDraft가 있고 검색 중이 아니면 용병으로 추가 섹션이 렌더링되어야 한다", () => {
    const draft: MercenaryDraftRow = {
      kind: "MERCENARY_DRAFT",
      registerName: "용병1",
      displayName: "용병1 (용병)",
      willRegister: false,
    };

    render(<PlayerListSection {...defaultProps} mercenaryDraft={draft} />);

    expect(screen.getByText("용병으로 추가")).toBeInTheDocument();
    const items = screen.getAllByTestId("player-item");
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent("용병1 (용병)");
  });

  it("pendingTeamMembers가 있으면 변경 사항 미리보기 섹션이 렌더링되어야 한다", () => {
    const pending = new Map<number, PendingTeamMemberRow>();
    const pendingPlayer = createMockPlayer({
      id: 1,
      teamMemberId: 1,
      name: "추가될 선수",
      position: "MF",
      currentStatus: "ATTEND",
    });
    pending.set(1, pendingPlayer);

    render(
      <PlayerListSection {...defaultProps} pendingTeamMembers={pending} />,
    );

    expect(screen.getByText("변경 사항 미리보기")).toBeInTheDocument();
    expect(screen.getByText("추가될 선수")).toBeInTheDocument();
    expect(screen.getByText("참석 추가")).toBeInTheDocument();
    expect(screen.getByTestId("position-chip")).toHaveTextContent("MF");
  });

  it("PlayerItem 클릭 시 onToggleTeamMember가 호출되어야 한다", () => {
    const player = createMockPlayer({ id: 1, teamMemberId: 1, name: "선수1" });

    render(
      <PlayerListSection {...defaultProps} keyword="선수" results={[player]} />,
    );

    fireEvent.click(screen.getByTestId("player-item"));
    expect(mockToggleTeam).toHaveBeenCalledWith(player);
  });
});
