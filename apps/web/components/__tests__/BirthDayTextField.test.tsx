import { render, screen, fireEvent } from "@testing-library/react";
import BirthDayTextField from "../onboarding/BirthDayTextField";

describe("BirthDayTextField 컴포넌트", () => {
  it("기본 props로 올바르게 렌더링 되어야 한다", () => {
    render(<BirthDayTextField value="" onChange={jest.fn()} />);
    expect(screen.getByLabelText("생년월일")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("YYYY-MM-DD")).toBeInTheDocument();
  });

  it("입력 시 YYYY-MM-DD 형식으로 포맷팅되어야 한다", () => {
    const handleChange = jest.fn();
    render(<BirthDayTextField value="" onChange={handleChange} />);
    const input = screen.getByPlaceholderText("YYYY-MM-DD");

    // 20000101 입력
    fireEvent.change(input, { target: { value: "20000101" } });

    const event = handleChange.mock.calls[0][0];
    expect(event.target.value).toBe("2000-01-01");
  });

  it("중간 입력 상태에서도 포맷팅이 적용되어야 한다", () => {
    const handleChange = jest.fn();
    render(<BirthDayTextField value="" onChange={handleChange} />);
    const input = screen.getByPlaceholderText("YYYY-MM-DD");

    // 200001
    fireEvent.change(input, { target: { value: "200001" } });
    const event = handleChange.mock.calls[0][0];
    expect(event.target.value).toBe("2000-01");
  });
});
