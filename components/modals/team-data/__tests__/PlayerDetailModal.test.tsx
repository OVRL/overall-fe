import { render, screen, fireEvent } from "@testing-library/react";
import PlayerDetailModal from "../PlayerDetailModal";
import { Player } from "@/app/(main)/team-data/_types/player";

// 모킹
const mockHideModal = jest.fn();
jest.mock("@/hooks/useModal", () => ({
  __esModule: true,
  default: () => ({
    hideModal: mockHideModal,
  }),
}));

jest.mock("@/components/ui/MainProfileCard", () => ({
  __esModule: true,
  default: ({ playerName, backNumber }: any) => (
    <div data-testid="profile-card">
      {playerName} ({backNumber})
    </div>
  ),
}));

jest.mock("@/app/(main)/team-data/_components/FootIcon", () => ({
  __esModule: true,
  default: ({ foot }: any) => <div data-testid="foot-icon">{foot}</div>,
}));

describe("PlayerDetailModal 컴포넌트", () => {
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
      골: 5,
    },
    cumulativeStats: {
      출장: 100,
      골: 50,
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("선수 기본 정보와 시즌 기록을 초기에 렌더링해야 한다", () => {
    render(<PlayerDetailModal player={mockPlayer} />);

    expect(screen.getByTestId("profile-card")).toHaveTextContent("손흥민 (7)");
    expect(screen.getByText("시즌기록")).toHaveClass(
      "text-Label-AccentPrimary",
    ); // 활성 탭

    // 시즌 기록 값 확인
    expect(screen.getByText("10")).toBeInTheDocument(); // 출장
    expect(screen.getByText("5")).toBeInTheDocument(); // 골
  });

  it("탭 클릭 시 누적기록으로 전환되어야 한다", () => {
    render(<PlayerDetailModal player={mockPlayer} />);

    const cumulativeTab = screen.getByText("누적기록");
    fireEvent.click(cumulativeTab);

    expect(cumulativeTab).toHaveClass("text-Label-AccentPrimary");

    // 통산 기록 값 확인
    expect(screen.getByText("100")).toBeInTheDocument(); // 출장
    expect(screen.getByText("50")).toBeInTheDocument(); // 골
  });

  it("닫기 버튼 클릭 시 hideModal이 호출되어야 한다", () => {
    render(<PlayerDetailModal player={mockPlayer} />);

    const closeBtn = screen.getByLabelText("close");
    fireEvent.click(closeBtn);

    expect(mockHideModal).toHaveBeenCalledTimes(1);
  });

  it("player가 없을 경우 아무것도 렌더링하지 않아야 한다", () => {
    const { container } = render(<PlayerDetailModal player={null} />);
    expect(container.firstChild).toBeNull();
  });
});
