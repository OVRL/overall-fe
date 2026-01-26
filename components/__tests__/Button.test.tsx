import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../ui/Button";

describe("Button 컴포넌트", () => {
  it("기본 props로 올바르게 렌더링 되어야 한다", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-Fill_AccentPrimary");
  });

  it("ghost 변형(variant)을 렌더링 되어야 한다", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole("button", { name: /ghost/i });
    expect(button).toHaveClass("bg-fill-quaternary");
  });

  it("line 변형(variant)을 렌더링 되어야 한다", () => {
    render(<Button variant="line">Line</Button>);
    const button = screen.getByRole("button", { name: /line/i });
    expect(button).toHaveClass("bg-transparent");
  });

  it("커스텀 className이 적용되어야 한다", () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole("button", { name: /custom/i });
    expect(button).toHaveClass("custom-class");
  });

  it("leftIcon을 렌더링하고 gap을 적용되어야 한다", () => {
    render(<Button leftIcon={<span data-testid="icon">Icon</span>}>With Icon</Button>);
    const button = screen.getByRole("button", { name: /with icon/i });
    const icon = screen.getByTestId("icon");
    expect(button).toContainElement(icon);
    expect(button).toHaveClass("gap-2.5");
  });

  it("ref가 올바르게 전달되어야 한다", () => { 
    const ref = { current: null };
    render(<Button ref={ref}>Ref Me</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("onClick 이벤트를 처리되어야 한다", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disabled prop 전달 시 비활성화되어야 한다", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
  });
});
