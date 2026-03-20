import { fireEvent, render, screen } from "@testing-library/react";
import { mapTeamMembersToPlayers } from "../../_lib/mapTeamMemberToPlayer";
import PlayerListBoard from "../season-record/PlayerListBoard";
import type { Player } from "../../_types/player";

/** findManyTeamMember 쿼리와 동일한 형태의 목 멤버 (mapTeamMembersToPlayers로 Player 변환용) */
const MOCK_MEMBERS = [
  {
    __typename: "TeamMemberModel" as const,
    id: 1,
    position: "FW",
    backNumber: 7,
    joinedAt: "2023-09-03T00:00:00Z",
    profileImg: null,
    user: {
      __typename: "UserModel" as const,
      id: "u1",
      name: "손흥민",
      profileImage: null,
      birthDate: null,
      subPositions: [],
    },
    overall: {
      __typename: "OverallModel" as const,
      ovr: 90,
      appearances: 10,
      goals: 5,
      assists: 3,
      keyPasses: 2,
      attackPoints: 8,
      cleanSheets: 0,
      mom3: 1,
      mom8: 0,
      winRate: 70,
    },
  },
  {
    __typename: "TeamMemberModel" as const,
    id: 2,
    position: "MF",
    backNumber: 10,
    joinedAt: "2023-09-03T00:00:00Z",
    profileImg: null,
    user: {
      __typename: "UserModel" as const,
      id: "u2",
      name: "이강인",
      profileImage: null,
      birthDate: null,
      subPositions: [],
    },
    overall: {
      __typename: "OverallModel" as const,
      ovr: 85,
      appearances: 8,
      goals: 2,
      assists: 4,
      keyPasses: 3,
      attackPoints: 6,
      cleanSheets: 0,
      mom3: 0,
      mom8: 0,
      winRate: 60,
    },
  },
  {
    __typename: "TeamMemberModel" as const,
    id: 3,
    position: "DF",
    backNumber: 3,
    joinedAt: "2023-09-03T00:00:00Z",
    profileImg: null,
    user: {
      __typename: "UserModel" as const,
      id: "u3",
      name: "김민재",
      profileImage: null,
      birthDate: null,
      subPositions: [],
    },
    overall: {
      __typename: "OverallModel" as const,
      ovr: 88,
      appearances: 12,
      goals: 0,
      assists: 0,
      keyPasses: 1,
      attackPoints: 1,
      cleanSheets: 5,
      mom3: 2,
      mom8: 0,
      winRate: 75,
    },
  },
];

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
  const mockPlayers: Player[] = mapTeamMembersToPlayers(MOCK_MEMBERS);
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

    fireEvent.click(sortButton);
    expect(screen.getByTestId("sort-info")).toHaveTextContent("OVR desc");
    expect(screen.getByTestId("first-player")).toHaveTextContent("손흥민");

    fireEvent.click(sortButton);
    expect(screen.getByTestId("sort-info")).toHaveTextContent("OVR asc");
    expect(screen.getByTestId("first-player")).toHaveTextContent("이강인");
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

    expect(mockOnPlayerClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 2, name: "이강인" }),
    );
  });
});
