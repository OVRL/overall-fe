import { render, screen, fireEvent } from "@testing-library/react";
import PlayerTableRow from "../PlayerTableRow";
import { Player } from "../../../../_types/player";

jest.mock("@/components/PositionChip", () => ({
  __esModule: true,
  default: ({ position }: { position: string }) => (
    <div data-testid="position-chip">{position}</div>
  ),
}));

jest.mock("../PlayerNameCell", () => ({
  __esModule: true,
  default: ({ name }: { name: string }) => (
    <div data-testid="player-name-cell">{name}</div>
  ),
}));

jest.mock("../StatsCell", () => ({
  __esModule: true,
  default: ({ value, highlight }: any) => (
    <td data-testid="stats-cell" data-highlight={highlight}>
      {value}
    </td>
  ),
}));

describe("PlayerTableRow 컴포넌트", () => {
  const mockPlayer: Player = {
    id: 1,
    name: "손흥민",
    team: "토트넘",
    value: "100",
    position: "FW",
    backNumber: 7,
    ovr: 90,
    stats: {
      출장: 10,
      오버롤: 90,
      골: 20,
      어시: 10,
      기점: 5,
      클린시트: 0,
      주발: "R",
      승률: "60%",
      득점: 20,
      도움: 10,
    },
  };

  const mockOnPlayerClick = jest.fn();
  const mockGetCellClass = jest.fn((key: string) =>
    key === "OVR" ? "text-primary" : "",
  );

  it("선수 데이터를 각 셀에 올바르게 매핑하여 렌더링해야 한다", () => {
    render(
      <table>
        <tbody>
          <PlayerTableRow
            player={mockPlayer}
            index={0}
            onPlayerClick={mockOnPlayerClick}
            getCellClass={mockGetCellClass}
          />
        </tbody>
      </table>,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByTestId("position-chip")).toHaveTextContent("FW");
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByTestId("player-name-cell")).toHaveTextContent("손흥민");

    const statsCells = screen.getAllByTestId("stats-cell");
    const ovrCell = statsCells.find((cell) => cell.textContent === "90");
    expect(ovrCell).toBeInTheDocument();
    expect(ovrCell?.getAttribute("data-highlight")).toBe("true");
  });

  it("행 클릭 시 onPlayerClick 콜백이 호출되어야 한다", () => {
    render(
      <table>
        <tbody>
          <PlayerTableRow
            player={mockPlayer}
            index={0}
            onPlayerClick={mockOnPlayerClick}
            getCellClass={mockGetCellClass}
          />
        </tbody>
      </table>,
    );

    fireEvent.click(screen.getByRole("row"));
    expect(mockOnPlayerClick).toHaveBeenCalledWith(mockPlayer);
  });
});
