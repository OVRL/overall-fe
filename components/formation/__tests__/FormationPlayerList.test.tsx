import { render, screen, fireEvent } from "@testing-library/react";
import FormationPlayerList from "../player-list/FormationPlayerList";

jest.mock("../player-list/PlayerListFilter", () => {
  return function MockPlayerListFilter(props: any) {
    return (
      <div data-testid="player-filter">
        <button onClick={() => props.onPosTabChange("FW")}>FW로 탭 변경</button>
        <span>현재 탭: {props.activePosTab}</span>
        <button onClick={() => props.onSearchChange("손흥민")}>
          검색어 입력
        </button>
      </div>
    );
  };
});

jest.mock("../player-list/FormationPlayerGroupList", () => {
  return function MockFormationPlayerGroupList(props: any) {
    return (
      <div data-testid="group-list">
        필터링된 선수 수: {props.filteredPlayers.length}
      </div>
    );
  };
});

jest.mock("@/components/ui/Button", () => ({ children, onClick }: any) => (
  <button onClick={onClick} data-testid="mock-add-btn">
    {children}
  </button>
));
jest.mock("@/components/ui/Icon", () => () => <span />);

// 선수 추가는 모달(PLAYER_SEARCH) 완료 시 onAddPlayer가 호출되는 방식으로 동작함
jest.mock("@/hooks/useModal", () => ({
  __esModule: true,
  default: () => ({
    openModal: (options: { onComplete?: (player: { name: string }) => void }) => {
      if (options?.onComplete) {
        options.onComplete({ name: "새 선수" });
      }
    },
  }),
}));

describe("FormationPlayerList 컴포넌트", () => {
  const mockOnSelectPlayer = jest.fn();
  const mockOnAddPlayer = jest.fn();
  const mockOnRemovePlayer = jest.fn();

  const mockPlayers = [
    { id: 1, name: "손흥민", position: "LW", overall: 90 },
    { id: 2, name: "이강인", position: "CAM", overall: 85 },
    { id: 3, name: "김민재", position: "CB", overall: 88 },
  ] as any[];

  const defaultProps = {
    players: mockPlayers,
    currentQuarterLineups: [],
    selectedPlayer: null,
    onSelectPlayer: mockOnSelectPlayer,
    onAddPlayer: mockOnAddPlayer,
    onRemovePlayer: mockOnRemovePlayer,
    targetPosition: null, // "ST" 등
    activePosition: null, // Dropdown 클릭 포지션 등
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("기본 렌더링 및 하위 컴포넌트들이 정상적으로 나타나야 한다", () => {
    render(<FormationPlayerList {...defaultProps} />);

    expect(screen.getByTestId("player-filter")).toBeInTheDocument();
    expect(screen.getByTestId("group-list")).toBeInTheDocument();
    expect(screen.getByTestId("mock-add-btn")).toBeInTheDocument();
  });

  it("선수 추가 버튼 클릭 시 모달 완료 콜백이 호출되며 onAddPlayer가 실행되어야 한다", () => {
    render(<FormationPlayerList {...defaultProps} />);

    fireEvent.click(screen.getByTestId("mock-add-btn"));
    expect(mockOnAddPlayer).toHaveBeenCalledWith("새 선수");
  });

  it("필터 탭을 변경하면 FormationPlayerGroupList에 전달되는 선수 목록이 필터링되어야 한다", () => {
    render(<FormationPlayerList {...defaultProps} />);
    expect(screen.getByTestId("group-list")).toHaveTextContent(
      "필터링된 선수 수: 3",
    ); // 처음에 전체

    // PlayerListFilter 모킹 중 "FW로 탭 변경" 클릭
    fireEvent.click(screen.getByText("FW로 탭 변경"));

    // 손흥민(LW)은 FW로 매핑되므로 1명만 필터링 됨
    expect(screen.getByTestId("group-list")).toHaveTextContent(
      "필터링된 선수 수: 1",
    );
  });

  it("activePosition 또는 targetPosition이 변경되면 자동으로 탭 상태가 연동되어야 한다", () => {
    const { rerender } = render(<FormationPlayerList {...defaultProps} />);
    expect(screen.getByTestId("player-filter")).toHaveTextContent(
      "현재 탭: 전체",
    );

    // targetPosition 프로퍼티 변경 (예: CDM 클릭 시 -> MF 탭으로 변경)
    rerender(<FormationPlayerList {...defaultProps} targetPosition="CDM" />);
    expect(screen.getByTestId("player-filter")).toHaveTextContent(
      "현재 탭: MF",
    );
  });
});
