import { fireEvent, render, screen } from "@testing-library/react";
import type { Player } from "../../_types/player";
import TeamDataDashboard from "../TeamDataDashboard";

const mockInitialPlayers: Player[] = [];

// 모킹
const mockOpenModal = jest.fn();
jest.mock("@/hooks/useModal", () => ({
  __esModule: true,
  default: (modalType: string) => ({
    openModal: (props: any) => mockOpenModal(modalType, props),
  }),
}));

jest.mock("../season-record/RankingCarousel", () => ({
  __esModule: true,
  default: ({ onMoreClick, onPlayerClick }: any) => (
    <div data-testid="ranking-carousel">
      <button onClick={() => onMoreClick("득점", [])}>더보기 클릭</button>
      <button onClick={() => onPlayerClick({ id: 1, name: "손흥민" })}>
        선수 클릭
      </button>
    </div>
  ),
}));

jest.mock("../season-record/PlayerListBoard", () => ({
  __esModule: true,
  default: ({ onPlayerClick }: any) => (
    <div data-testid="player-list-board">
      <button onClick={() => onPlayerClick({ id: 2, name: "이강인" })}>
        보드 선수 클릭
      </button>
    </div>
  ),
}));

jest.mock("@/components/ui/Dropdown", () => ({
  __esModule: true,
  default: ({ value, onChange, options }: any) => (
    <select
      data-testid="dropdown"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

describe("TeamDataDashboard 컴포넌트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("제목과 하위 컴포넌트들을 정상적으로 렌더링해야 한다", () => {
    render(<TeamDataDashboard initialPlayers={mockInitialPlayers} />);

    expect(screen.getByText("팀 데이터")).toBeInTheDocument();
    expect(screen.getByTestId("ranking-carousel")).toBeInTheDocument();
    expect(screen.getByTestId("player-list-board")).toBeInTheDocument();
  });

  it("명예의 전당 탭 선택 시 기간 드롭다운이 보여야 한다", () => {
    render(<TeamDataDashboard initialPlayers={mockInitialPlayers} />);

    fireEvent.click(screen.getByRole("tab", { name: "명예의 전당" }));

    expect(screen.getByTestId("dropdown")).toBeInTheDocument();
  });

  it("선수 클릭 시 상세 모달이 열려야 한다", () => {
    render(<TeamDataDashboard initialPlayers={mockInitialPlayers} />);

    const playerClickBtn = screen.getByText("선수 클릭");
    fireEvent.click(playerClickBtn);

    expect(mockOpenModal).toHaveBeenCalledWith("TEAM_DATA_PLAYER_DETAIL", {
      player: { id: 1, name: "손흥민" },
    });
  });

  it("더보기 클릭 시 통계 모달이 열려야 한다", () => {
    render(<TeamDataDashboard initialPlayers={mockInitialPlayers} />);

    const moreClickBtn = screen.getByText("더보기 클릭");
    fireEvent.click(moreClickBtn);

    expect(mockOpenModal).toHaveBeenCalledWith(
      "TEAM_DATA_STAT_RANKING",
      expect.objectContaining({
        category: "득점",
        players: [],
      }),
    );
  });

  it("명예의 전당 기간 드롭다운 변경 시 상태가 업데이트되어야 한다", () => {
    render(<TeamDataDashboard initialPlayers={mockInitialPlayers} />);

    fireEvent.click(screen.getByRole("tab", { name: "명예의 전당" }));

    const dropdown = screen.getByTestId("dropdown");
    fireEvent.change(dropdown, { target: { value: "2026 시즌" } });

    expect(dropdown).toHaveValue("2026 시즌");
  });
});
