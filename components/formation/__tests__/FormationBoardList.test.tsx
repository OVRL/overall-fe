import { render, screen } from "@testing-library/react";
import FormationBoardList from "../FormationBoardList";

jest.mock("../QuarterFormationBoard", () => {
  return function MockQuarterFormationBoard({
    quarter,
    isSelected,
    hasSelection,
  }: any) {
    return (
      <div data-testid="quarter-board">
        Board {quarter.id} - selected: {String(isSelected)} - hasSelection:{" "}
        {String(hasSelection)}
      </div>
    );
  };
});

describe("FormationBoardList 컴포넌트", () => {
  const mockSetQuarters = jest.fn();
  const mockOnPositionRemove = jest.fn();
  const mockSetCurrentQuarterId = jest.fn();

  const mockQuarters: any[] = [
    { id: 1, formation: "4-3-3", lineup: {}, type: "match", matchup: "home" },
    { id: 2, formation: "4-4-2", lineup: {}, type: "match", matchup: "home" },
  ];

  const defaultProps = {
    quarters: mockQuarters,
    selectedPlayer: null,
    setQuarters: mockSetQuarters,
    onPositionRemove: mockOnPositionRemove,
    currentQuarterId: null,
    setCurrentQuarterId: mockSetCurrentQuarterId,
  };

  it("각 쿼터 데이터에 맞춰 여러 개의 보드(QuarterFormationBoard)를 렌더링해야 한다", () => {
    render(<FormationBoardList {...defaultProps} />);
    const boards = screen.getAllByTestId("quarter-board");

    expect(boards).toHaveLength(2);
    expect(boards[0]).toHaveTextContent("Board 1");
    expect(boards[1]).toHaveTextContent("Board 2");
  });

  it("currentQuarterId가 null일 경우, 모든 보드에 대해 hasSelection이 false로 올바르게 전달되어야 한다", () => {
    render(<FormationBoardList {...defaultProps} currentQuarterId={null} />);
    const boards = screen.getAllByTestId("quarter-board");

    expect(boards[0]).toHaveTextContent(
      "selected: false - hasSelection: false",
    );
    expect(boards[1]).toHaveTextContent(
      "selected: false - hasSelection: false",
    );
  });

  it("currentQuarterId가 특정 쿼터 ID와 일치할 경우, 선택 상태(isSelected, hasSelection)가 해당 쿼터 보드에 올바르게 반영되어야 한다", () => {
    render(<FormationBoardList {...defaultProps} currentQuarterId={2} />);
    const boards = screen.getAllByTestId("quarter-board");

    // 1번 보드는 선택 안됨
    expect(boards[0]).toHaveTextContent("selected: false - hasSelection: true");
    // 2번 보드는 선택됨
    expect(boards[1]).toHaveTextContent("selected: true - hasSelection: true");
  });
});
