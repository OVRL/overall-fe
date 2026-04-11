import { render, screen, fireEvent } from "@testing-library/react";
import { LogoutButton } from "../LogoutButton";

jest.mock("@/components/Link", () => {
  return function MockLink({
    href,
    children,
    onClick,
    "aria-label": ariaLabel,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    "aria-label"?: string;
    className?: string;
  }) {
    return (
      <a href={href} onClick={onClick} aria-label={ariaLabel} className={className}>
        {children}
      </a>
    );
  };
});

describe("LogoutButton", () => {
  it("로그아웃 링크가 올바른 href와 텍스트로 렌더링된다", () => {
    render(<LogoutButton />);
    const link = screen.getByRole("link", { name: /로그아웃/i });
    expect(link).toHaveAttribute("href", "/api/auth/logout?redirect=/login/social");
    expect(link).toHaveTextContent("로그아웃");
  });

  it("클릭 시 onClose가 호출된다", () => {
    const onClose = jest.fn();
    render(<LogoutButton onClose={onClose} />);
    fireEvent.click(screen.getByRole("link", { name: /로그아웃/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("className이 적용된다", () => {
    render(<LogoutButton className="custom-class" />);
    const link = screen.getByRole("link");
    expect(link).toHaveClass("custom-class");
  });
});
