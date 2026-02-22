import { render, screen, fireEvent } from "@testing-library/react";
import FormationPlayerGroupList from "../FormationPlayerGroupList";

jest.mock("../FormationPlayerRow", () => {
  return function MockFormationPlayerRow(props: any) {
    return (
      <div
        data-testid="player-row"
        onClick={() => props.onSelect(props.player)}
        onContextMenu={(e) => {
          e.preventDefault();
          props.onRemove(e, props.player);
        }}
      >
        {props.player.name} - Quarters: {props.activeQuarters.join(",")}
      </div>
    );
  };
});

describe("FormationPlayerGroupList 컴포넌트", () => {
  const mockOnSelectPlayer = jest.fn();
  const mockOnRemovePlayer = jest.fn();

  const mockPlayer1: any = {
    id: 1,
    name: "Player 1",
    position: "FW",
    overall: 90,
    number: 10,
  };
  const mockPlayer2: any = {
    id: 2,
    name: "Player 2",
    position: "MF",
    overall: 85,
    number: 8,
  };

  const defaultProps = {
    filteredPlayers: [mockPlayer1, mockPlayer2],
    currentQuarterLineups: [
      { 0: mockPlayer1 }, // 1Q
      { 1: mockPlayer2 }, // 2Q
    ] as any,
    selectedPlayer: null,
    onSelectPlayer: mockOnSelectPlayer,
    onRemovePlayer: mockOnRemovePlayer,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn().mockImplementation(() => true);
  });

  it("전달받은 filteredPlayers 수만큼 FormationPlayerRow를 렌더링해야 한다", () => {
    render(<FormationPlayerGroupList {...defaultProps} />);
    const rows = screen.getAllByTestId("player-row");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("Player 1");
    expect(rows[1]).toHaveTextContent("Player 2");
  });

  it("각 선수가 포함된 쿼터 정보(activeQuarters)를 올바르게 계산하여 전달다", () => {
    render(<FormationPlayerGroupList {...defaultProps} />);
    const rows = screen.getAllByTestId("player-row");

    // Player 1은 1Q 라인업에만 있음
    expect(rows[0]).toHaveTextContent("Quarters: 1");
    // Player 2는 2Q 라인업에만 있음
    expect(rows[1]).toHaveTextContent("Quarters: 2");
  });

  it("선수 배열이 비어있을 경우 '선수가 없습니다.' 텍스트를 출력해야 한다", () => {
    render(<FormationPlayerGroupList {...defaultProps} filteredPlayers={[]} />);
    expect(screen.getByText("선수가 없습니다.")).toBeInTheDocument();
  });

  it("선수 로우 클릭 시 onSelectPlayer가 호출되어야 한다", () => {
    render(<FormationPlayerGroupList {...defaultProps} />);
    const rows = screen.getAllByTestId("player-row");

    fireEvent.click(rows[0]);
    expect(mockOnSelectPlayer).toHaveBeenCalledWith(mockPlayer1);
  });

  it("선수 삭제 액션 발생 시 confirm을 띄운 뒤 onRemovePlayer가 호출되어야 한다", () => {
    render(<FormationPlayerGroupList {...defaultProps} />);
    const rows = screen.getAllByTestId("player-row");

    // 모킹에서 contextMenu 이벤트를 삭제 액션 핸들러 트리거로 연결함
    fireEvent.contextMenu(rows[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnRemovePlayer).toHaveBeenCalledWith(mockPlayer1.id);
  });
});
