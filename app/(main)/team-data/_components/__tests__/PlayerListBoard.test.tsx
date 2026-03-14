import { render, screen, fireEvent } from "@testing-library/react";
import PlayerListBoard from "../season-record/PlayerListBoard";
import { Player } from "../../_types/player";

jest.mock("../season-record/PlayerTable", () => ({
  __esModule: true,
  default: ({ players, onSort, sortConfig }: any) => (
    <div data-testid="mock-player-table">
      <button onClick={() => onSort("OVR")}>정렬 버튼</button>
      <div data-testid="player-count">{players.length}</div>
      <div data-testid="first-player">{players[0]?.name}</div>
      <div data-testid="sort-info">
        {sortConfig?.key} {sortConfig?.direction}
      </div>
    </div>
  ),
}));

describe("PlayerListBoard 컴포넌트", () => {
  const mockPlayers: Player[] = [
    {
      id: 1,
      name: "손흥민",
      team: "토트넘",
      value: "100",
      position: "FW",
      backNumber: 7,
      ovr: 90,
    },
    {
      id: 2,
      name: "이강인",
      team: "PSG",
      value: "80",
      position: "MF",
      backNumber: 10,
      ovr: 85,
    },
    {
      id: 3,
      name: "김민재",
      team: "뮌헨",
      value: "90",
      position: "DF",
      backNumber: 3,
      ovr: 88,
    },
  ];

  const mockOnPlayerClick = jest.fn();

  it("초기 선수 리스트가 렌더링되어야 한다", () => {
    render(
      <PlayerListBoard
        initialPlayers={mockPlayers}
        onPlayerClick={mockOnPlayerClick}
      />,
    );
    expect(screen.getByTestId("player-count")).toHaveTextContent("3");
  });

  it("검색어 입력 시 리스트가 필터링되어야 한다", () => {
    render(
      <PlayerListBoard
        initialPlayers={mockPlayers}
        onPlayerClick={mockOnPlayerClick}
      />,
    );

    const searchInput = screen.getByLabelText("선수명 검색");
    fireEvent.change(searchInput, { target: { value: "손흥민" } });

    expect(screen.getByTestId("player-count")).toHaveTextContent("1");
    expect(screen.getByTestId("first-player")).toHaveTextContent("손흥민");
  });

  it("정렬 버튼 클릭 시 정렬 상태가 업데이트되고 리스트가 정렬되어야 한다", () => {
    render(
      <PlayerListBoard
        initialPlayers={mockPlayers}
        onPlayerClick={mockOnPlayerClick}
      />,
    );

    const sortButton = screen.getByText("정렬 버튼");

    // 1. 첫 클릭 (기본 desc)
    fireEvent.click(sortButton);
    expect(screen.getByTestId("sort-info")).toHaveTextContent("OVR desc");
    expect(screen.getByTestId("first-player")).toHaveTextContent("손흥민"); // 90이 가장 높음

    // 2. 두 번째 클릭 (asc)
    fireEvent.click(sortButton);
    expect(screen.getByTestId("sort-info")).toHaveTextContent("OVR asc");
    expect(screen.getByTestId("first-player")).toHaveTextContent("이강인"); // 85가 가장 낮음
  });

  it("검색어 입력 후 엔터 키를 누르면 검색된 선수의 클릭 이벤트가 발생해야 한다", () => {
    render(
      <PlayerListBoard
        initialPlayers={mockPlayers}
        onPlayerClick={mockOnPlayerClick}
      />,
    );

    const searchInput = screen.getByLabelText("선수명 검색");
    fireEvent.change(searchInput, { target: { value: "이강인" } });
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter" });

    expect(mockOnPlayerClick).toHaveBeenCalledWith(mockPlayers[1]);
  });
});
