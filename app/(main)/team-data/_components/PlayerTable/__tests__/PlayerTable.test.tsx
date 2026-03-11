import { render, screen } from "@testing-library/react";
import PlayerTable from "../PlayerTable";
import { Player } from "../../../_types/player";

// 하위 컴포넌트 모킹
jest.mock("../PlayerTableHeader", () => ({
  __esModule: true,
  default: ({ sortConfig }: { sortConfig: any }) => (
    <thead>
      <tr>
        <th data-testid="mock-header">
          Header {sortConfig?.key} {sortConfig?.direction}
        </th>
      </tr>
    </thead>
  ),
}));

jest.mock("../PlayerTableRow", () => ({
  __esModule: true,
  default: ({
    player,
    index,
    getCellClass,
  }: {
    player: Player;
    index: number;
    getCellClass: (key: string) => string;
  }) => (
    <tr data-testid="mock-row">
      <td>
        {index + 1}. {player.name}
      </td>
      <td data-testid="cell-class">{getCellClass("OVR")}</td>
    </tr>
  ),
}));

describe("PlayerTable 컴포넌트", () => {
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
  ];

  it("헤더와 입력된 선수들만큼의 행을 렌더링해야 한다", () => {
    render(<PlayerTable players={mockPlayers} />);

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();

    const rows = screen.getAllByTestId("mock-row");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("손흥민");
    expect(rows[1]).toHaveTextContent("이강인");
  });

  it("sortConfig에 따라 헤더에 올바른 설정을 전달해야 한다", () => {
    render(
      <PlayerTable
        players={mockPlayers}
        sortConfig={{ key: "득점", direction: "desc" }}
      />,
    );

    expect(screen.getByTestId("mock-header")).toHaveTextContent(
      "Header 득점 desc",
    );
  });

  it("getCellClass 로직이 정렬 상태에 따라 올바른 클래스를 반환해야 한다 (OVR 기본값 등)", () => {
    // 1. 정렬이 없을 때 OVR 하이라이트 확인
    const { rerender } = render(
      <PlayerTable players={mockPlayers} sortConfig={null} />,
    );
    // getCellClass 내 로직: !sortConfig && colKey === "OVR" => "text-primary font-bold"
    expect(screen.getAllByTestId("cell-class")[0]).toHaveTextContent(
      "text-primary font-bold",
    );

    // 2. 다른 키로 정렬 중일 때 확인
    rerender(
      <PlayerTable
        players={mockPlayers}
        sortConfig={{ key: "득점", direction: "asc" }}
      />,
    );
    expect(screen.getAllByTestId("cell-class")[0]).toHaveTextContent(
      "text-gray-300",
    );
  });
});
