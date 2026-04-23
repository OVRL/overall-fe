import { render, screen, fireEvent } from "@testing-library/react";
import Toggle from "../Toggle";

describe("Toggle 컴포넌트", () => {
  it("기본 상태(Unchecked)로 올바르게 렌더링 되어야 한다", () => {
    render(<Toggle />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(toggle).toHaveClass("bg-[#555]/40"); // Unchecked 배경색 (최근 유저 수정 반영)
  });

  it("defaultChecked={true}일 때 On 상태로 렌더링 되어야 한다", () => {
    render(<Toggle defaultChecked={true} />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(toggle).toHaveClass("bg-Fill_AccentPrimary");
  });

  it("클릭 시 상태가 토글되어야 한다 (Uncontrolled)", () => {
    render(<Toggle />);
    const toggle = screen.getByRole("switch");
    
    expect(toggle).toHaveAttribute("aria-checked", "false");
    
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("클릭 시 onChange 콜백이 호출되어야 한다", () => {
    const handleChange = jest.fn();
    render(<Toggle onChange={handleChange} />);
    const toggle = screen.getByRole("switch");
    
    fireEvent.click(toggle);
    expect(handleChange).toHaveBeenCalledWith(true);
    
    fireEvent.click(toggle);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it("controlled 모드에서 checked prop을 따라야 한다", () => {
    const { rerender } = render(<Toggle checked={false} />);
    const toggle = screen.getByRole("switch");
    
    expect(toggle).toHaveAttribute("aria-checked", "false");
    
    // 클릭해도 내부 상태만 바뀌거나 prop이 우선되어야 함 
    // (컴포넌트 구현상 checked가 있으면 그 값을 쓰도록 되어있음)
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
    
    rerender(<Toggle checked={true} />);
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("disabled 상태일 때 클릭해도 상태가 변하지 않아야 한다", () => {
    const handleChange = jest.fn();
    render(<Toggle disabled onChange={handleChange} />);
    const toggle = screen.getByRole("switch");
    
    expect(toggle).toBeDisabled();
    expect(toggle).toHaveAttribute("aria-checked", "false");
    
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("ref가 올바르게 전달되어야 한다", () => {
    const ref = { current: null };
    render(<Toggle ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
