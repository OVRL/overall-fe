import { render, screen, fireEvent } from "@testing-library/react";
import RankingCard from "../RankingCard";
import { Player } from "../../_types/player";

// 하위 컴포넌트 모킹
jest.mock("../RankCardRow", () => ({
  __esModule: true,
  default: ({ player, index }: { player: Player; index: number }) => (
    <div data-testid="rank-card-row">
      {index + 1}. {player.name}
    </div>
  ),
}));

jest.mock("@/components/ui/Button", () => ({
  __esModule: true,
  default: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
}));

jest.mock("@/components/ui/ProfileAvatar", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => (
    <div data-testid="profile-avatar">{alt}</div>
  ),
}));

jest.mock("@/components/ui/Icon", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <div data-testid="icon">{alt}</div>,
}));

describe("RankingCard 컴포넌트", () => {
  const mockPlayers: Player[] = [
    {
      id: 1,
      name: "선수1",
      team: "팀1",
      value: "10",
      position: "FW",
      backNumber: 1,
      ovr: 80,
    },
    {
      id: 2,
      name: "선수2",
      team: "팀1",
      value: "8",
      position: "MF",
      backNumber: 2,
      ovr: 80,
    },
    {
      id: 3,
      name: "선수3",
      team: "팀1",
      value: "6",
      position: "DF",
      backNumber: 3,
      ovr: 80,
    },
    {
      id: 4,
      name: "선수4",
      team: "팀1",
      value: "4",
      position: "GK",
      backNumber: 4,
      ovr: 80,
    },
    {
      id: 5,
      name: "선수5",
      team: "팀1",
      value: "2",
      position: "FW",
      backNumber: 5,
      ovr: 80,
    },
  ];

  it("제목과 상위 4명의 선수 리스트를 렌더링해야 한다", () => {
    render(<RankingCard title="득점 유닛" players={mockPlayers} />);

    expect(screen.getAllByText("득점 유닛")).toHaveLength(2); // 헤더와 아바타 밑 텍스트

    const rows = screen.getAllByTestId("rank-card-row");
    expect(rows).toHaveLength(4);
    expect(rows[0]).toHaveTextContent("1. 선수1");
    expect(rows[3]).toHaveTextContent("4. 선수4");

    // 5위는 렌더링되지 않아야 함
    expect(screen.queryByText("5. 선수5")).not.toBeInTheDocument();
  });

  it("'더보기' 버튼 클릭 시 onMoreClick 콜백이 호출되어야 한다", () => {
    const mockOnMoreClick = jest.fn();
    render(
      <RankingCard
        title="테스트"
        players={mockPlayers}
        onMoreClick={mockOnMoreClick}
      />,
    );

    fireEvent.click(screen.getByText("더보기"));
    expect(mockOnMoreClick).toHaveBeenCalledTimes(1);
  });
});
