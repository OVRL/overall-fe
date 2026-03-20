import { render, screen, fireEvent } from "@testing-library/react";
import { HamburgerMenuContent } from "../HamburgerMenuContent";

const mockSetSelectedTeamId = jest.fn();
const mockRefresh = jest.fn();
const mockOnClose = jest.fn();

jest.mock("@/components/providers/SelectedTeamProvider", () => ({
  useSelectedTeamId: () => ({
    selectedTeamId: null,
    setSelectedTeamId: mockSetSelectedTeamId,
    isSoloTeam: false,
  }),
}));

jest.mock("@/hooks/useUserId", () => ({
  useUserId: () => 1,
}));

jest.mock("../useFindTeamMemberForHeaderQuery", () => ({
  useFindTeamMemberForHeader: () => [
    {
      id: 10,
      teamId: 1,
      team: {
        id: "TeamModel:1",
        name: "테스트팀",
        emblem: "/default.png",
      },
    },
  ],
}));

jest.mock("@/hooks/bridge/useBridgeRouter", () => ({
  useBridgeRouter: () => ({
    refresh: mockRefresh,
  }),
}));

jest.mock("@/components/ui/Icon", () => {
  return function MockIcon() {
    return <span data-testid="icon" />;
  };
});

jest.mock("@/components/ui/EmblemImage", () => ({
  EmblemImage: ({ src, alt }: { src: string; alt: string }) => (
    <img data-testid="team-emblem" src={src} alt={alt} />
  ),
}));

jest.mock("@/components/Link", () => {
  return function MockLink({
    href,
    children,
    onClick,
    "aria-label": ariaLabel,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    "aria-label"?: string;
  }) {
    return (
      <a href={href} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </a>
    );
  };
});

jest.mock("../LogoutButton", () => ({
  LogoutButton: ({ onClose }: { onClose?: () => void }) => (
    <button type="button" onClick={onClose}>
      로그아웃
    </button>
  ),
}));

describe("HamburgerMenuContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("내 정보 링크가 /profile로 렌더링된다", () => {
    render(<HamburgerMenuContent onClose={mockOnClose} />);
    const link = screen.getByRole("link", { name: /내 정보/i });
    expect(link).toHaveAttribute("href", "/profile");
  });

  it("내 정보 클릭 시 onClose가 호출된다", () => {
    render(<HamburgerMenuContent onClose={mockOnClose} />);
    fireEvent.click(screen.getByRole("link", { name: /내 정보/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("팀 목록이 있으면 팀 선택 섹션과 팀 행이 렌더링된다", () => {
    render(<HamburgerMenuContent onClose={mockOnClose} />);
    expect(screen.getByText("팀 선택")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /테스트팀/i })).toBeInTheDocument();
  });

  it("팀 행 클릭 시 setSelectedTeamId(팀 id, 숫자 id, 이름, 이미지), onClose, router.refresh가 호출된다", () => {
    render(<HamburgerMenuContent onClose={mockOnClose} />);
    fireEvent.click(screen.getByRole("button", { name: /테스트팀/i }));
    expect(mockSetSelectedTeamId).toHaveBeenCalledWith(
      "TeamModel:1",
      1,
      "테스트팀",
      "/default.png",
    );
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it("팀 만들기 링크가 /create-team로 렌더링된다", () => {
    render(<HamburgerMenuContent onClose={mockOnClose} />);
    const link = screen.getByRole("link", { name: /팀 만들기/i });
    expect(link).toHaveAttribute("href", "/create-team");
  });
});
