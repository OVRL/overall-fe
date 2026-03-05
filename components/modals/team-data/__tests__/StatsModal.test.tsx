import { render, screen, fireEvent } from "@testing-library/react";
import StatsModal from "../StatsModal";
import { Player } from "@/app/(main)/team-data/_types/player";

// 모킹
const mockHideModal = jest.fn();
jest.mock("@/hooks/useModal", () => ({
  __esModule: true,
  default: () => ({
    hideModal: mockHideModal,
  }),
}));

jest.mock("@/components/PositionChip", () => ({
  __esModule: true,
  default: ({ position }: { position: string }) => (
    <div data-testid="position-chip">{position}</div>
  ),
}));

jest.mock("../_components/StatsPlayerRow", () => ({
  __esModule: true,
  default: ({
    player,
    index,
    onPlayerClick,
  }: {
    player: Player;
    index: number;
    onPlayerClick?: (player: Player) => void;
  }) => (
    <div
      data-testid="stats-player-row"
      className="cursor-pointer"
      onClick={() => onPlayerClick?.(player)}
    >
      <span>{index + 1}. </span>
      <span>{player.name}</span>
    </div>
  ),
}));

describe("StatsModal 컴포넌트", () => {
  const mockPlayers: Player[] = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `선수${i + 1}`,
    value: i + 1, // 1~15까지의 값
    position: "FW",
    team: "팀",
    backNumber: i + 1,
    ovr: 80 + i,
    stats: {
      출장: 10,
      오버롤: 80 + i,
      골: i + 1,
      어시: 0,
      기점: 0,
      클린시트: 0,
      주발: "R",
      승률: "50%",
    },
  })) as Player[];

  const mockOnPlayerClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("카테고리 제목과 상위 10명의 선수를 내림차순으로 렌더링해야 한다", () => {
    render(
      <StatsModal
        category="득점"
        players={mockPlayers}
        onPlayerClick={mockOnPlayerClick}
      />,
    );

    expect(screen.getByText("득점")).toBeInTheDocument();

    // 10명만 렌더링되어야 함
    const rows = screen.getAllByTestId("stats-player-row");
    expect(rows).toHaveLength(10);

    // 순서 확인 (15가 가장 큰 값이라 1등)
    expect(rows[0]).toHaveTextContent("1. 선수15");

    // 값이 가장 큰 '선수15'가 1등이어야 함 (내림차순 정렬)
    expect(screen.getByText("선수15")).toBeInTheDocument();
    expect(screen.queryByText("선수1")).not.toBeInTheDocument(); // 1은 하위권이라 잘림
  });

  it("선수 행 클릭 시 onPlayerClick 콜백이 호출되어야 한다", () => {
    render(
      <StatsModal
        category="득점"
        players={mockPlayers}
        onPlayerClick={mockOnPlayerClick}
      />,
    );

    const firstPlayerRow = screen.getByText("선수15").closest("div");
    fireEvent.click(firstPlayerRow!);

    expect(mockOnPlayerClick).toHaveBeenCalledWith(
      expect.objectContaining({ name: "선수15" }),
    );
  });

  it("닫기 버튼 클릭 시 hideModal이 호출되어야 한다", () => {
    render(<StatsModal category="득점" players={mockPlayers} />);

    const closeBtn = screen.getByAltText("close");
    fireEvent.click(closeBtn);

    expect(mockHideModal).toHaveBeenCalledTimes(1);
  });
});
