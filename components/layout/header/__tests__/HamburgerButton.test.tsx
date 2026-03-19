import { render, screen, fireEvent, within } from "@testing-library/react";
import { HamburgerButton } from "../HamburgerButton";

jest.mock("@/hooks/useMediaQuery", () => ({
  useMediaQuery: jest.fn(),
}));

jest.mock("@/hooks/useClickOutside", () => ({
  useClickOutside: jest.fn(),
}));

jest.mock("@/components/ui/Icon", () => {
  return function MockIcon({ alt }: { alt?: string }) {
    return <span data-testid="icon">{alt ?? "icon"}</span>;
  };
});

jest.mock("../HamburgerMenuContent", () => ({
  HamburgerMenuContent: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="hamburger-menu-content">
      <button type="button" onClick={onClose}>
        닫기
      </button>
    </div>
  ),
}));

const useMediaQuery = jest.requireMock("@/hooks/useMediaQuery").useMediaQuery;

describe("HamburgerButton", () => {
  const defaultProps = {
    isMenuOpen: false,
    onToggle: jest.fn(),
    ariaControlsId: "mobile-dropdown-menu",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useMediaQuery.mockReturnValue(null); // SSR/초기값
  });

  it("버튼이 렌더링되고 aria-label이 메뉴 열기로 표시된다", () => {
    render(<HamburgerButton {...defaultProps} />);
    const button = screen.getByRole("button", { name: /메뉴 열기/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("모바일(null/미디어미결정)에서 클릭 시 onToggle이 호출된다", () => {
    useMediaQuery.mockReturnValue(null);
    render(<HamburgerButton {...defaultProps} />);
    fireEvent.click(screen.getByRole("button"));
    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
  });

  it("모바일(false)에서 클릭 시 onToggle이 호출된다", () => {
    useMediaQuery.mockReturnValue(false);
    render(<HamburgerButton {...defaultProps} />);
    fireEvent.click(screen.getByRole("button"));
    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
  });

  it("PC(데스크톱)에서 클릭 시 onToggle 없이 툴팁 틀이 토글된다", () => {
    useMediaQuery.mockReturnValue(true);
    render(<HamburgerButton {...defaultProps} />);

    expect(screen.queryByTestId("hamburger-menu-content")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("hamburger-menu-content")).toBeInTheDocument();
    expect(defaultProps.onToggle).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /메뉴 닫기/i }));
    expect(screen.queryByTestId("hamburger-menu-content")).not.toBeInTheDocument();
  });

  it("메뉴가 열려 있을 때 aria-label이 메뉴 닫기로 바뀐다", () => {
    useMediaQuery.mockReturnValue(false);
    render(<HamburgerButton {...defaultProps} isMenuOpen />);
    expect(screen.getByRole("button", { name: /메뉴 닫기/i })).toBeInTheDocument();
  });

  it("PC에서 툴팁 내 닫기 클릭 시 툴팁이 사라진다", () => {
    useMediaQuery.mockReturnValue(true);
    render(<HamburgerButton {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /메뉴 열기/i }));
    const content = screen.getByTestId("hamburger-menu-content");
    fireEvent.click(within(content).getByRole("button", { name: /닫기/i }));
    expect(screen.queryByTestId("hamburger-menu-content")).not.toBeInTheDocument();
  });
});
