import { render, screen, fireEvent } from "@testing-library/react";
import { MobileNavDropdown } from "../MobileNavDropdown";

jest.mock("@/components/GlobalPortal/GlobalPortal", () => ({
  GlobalPortalConsumer: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock("../RegisterGameButton", () => {
  return function MockRegisterGameButton() {
    return <li data-testid="register-game-button">경기 등록하기</li>;
  };
});

jest.mock("@/components/Link", () => {
  return function MockLink({
    href,
    children,
    onClick,
    "aria-current": ariaCurrent,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    "aria-current"?: "page" | undefined;
  }) {
    return (
      <a href={href} onClick={onClick} aria-current={ariaCurrent}>
        {children}
      </a>
    );
  };
});

describe("MobileNavDropdown", () => {
  const defaultProps = {
    menuItems: [
      { label: "팀 관리", href: "/team-management" },
      { label: "선수 기록", href: "/team-data" },
    ],
    currentPathname: "/",
    onLinkClick: jest.fn(),
    id: "mobile-dropdown-menu",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("nav가 id와 aria-label로 렌더링된다", () => {
    render(<MobileNavDropdown {...defaultProps} />);
    const nav = screen.getByRole("navigation", { name: /모바일 전체 메뉴/i });
    expect(nav).toHaveAttribute("id", "mobile-dropdown-menu");
  });

  it("메뉴 항목들이 링크로 렌더링된다", () => {
    render(<MobileNavDropdown {...defaultProps} />);
    expect(screen.getByRole("link", { name: "팀 관리" })).toHaveAttribute(
      "href",
      "/team-management",
    );
    expect(screen.getByRole("link", { name: "선수 기록" })).toHaveAttribute(
      "href",
      "/team-data",
    );
  });

  it("현재 경로와 일치하는 링크에 aria-current=page가 설정된다", () => {
    render(
      <MobileNavDropdown {...defaultProps} currentPathname="/team-data" />,
    );
    const activeLink = screen.getByRole("link", { name: "선수 기록" });
    expect(activeLink).toHaveAttribute("aria-current", "page");
  });

  it("링크 클릭 시 onLinkClick이 호출된다", () => {
    render(<MobileNavDropdown {...defaultProps} />);
    fireEvent.click(screen.getByRole("link", { name: "팀 관리" }));
    expect(defaultProps.onLinkClick).toHaveBeenCalledTimes(1);
  });

  it("RegisterGameButton이 포함된다", () => {
    render(<MobileNavDropdown {...defaultProps} />);
    expect(screen.getByTestId("register-game-button")).toBeInTheDocument();
  });

  it("showRegisterGame=false이면 RegisterGameButton이 없다", () => {
    render(<MobileNavDropdown {...defaultProps} showRegisterGame={false} />);
    expect(
      screen.queryByTestId("register-game-button"),
    ).not.toBeInTheDocument();
  });
});
