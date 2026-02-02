import { render, screen, fireEvent } from "@testing-library/react";
import PlayerNameCollect from "../PlayerNameCollect";
import "@testing-library/jest-dom";

describe("PlayerNameCollect", () => {
  const mockOnNext = jest.fn();
  const mockOnDataChange = jest.fn();
  const defaultProps = {
    onNext: mockOnNext,
    onDataChange: mockOnDataChange,
    data: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("기본 렌더링 및 초기값(data.name) 확인", () => {
    render(<PlayerNameCollect {...defaultProps} data={{ name: "손흥민" }} />);
    // "반갑습니다"와 "선수 이름을 입력해주세요"가 분리되어 있을 수 있음.
    expect(screen.getByText(/선수 이름을 입력해주세요/)).toBeInTheDocument();
    
    expect(screen.getByLabelText("선수 이름")).toHaveValue("손흥민");
    const nextButton = screen.getByRole("button", { name: "다음" });
    expect(nextButton).toBeEnabled();
  });

  it("이름 입력 시 버튼 활성화 및 동작 확인", () => {
    render(<PlayerNameCollect {...defaultProps} />);
    const input = screen.getByLabelText("선수 이름");
    const nextButton = screen.getByRole("button", { name: "다음" });

    expect(nextButton).toBeDisabled();

    fireEvent.change(input, { target: { value: "이강인" } });
    expect(input).toHaveValue("이강인");
    expect(nextButton).toBeEnabled();

    fireEvent.click(nextButton);
    expect(mockOnDataChange).toHaveBeenCalled();
    const updateFn = mockOnDataChange.mock.calls[0][0];
    expect(updateFn({})).toEqual({ name: "이강인" });
    
    expect(mockOnNext).toHaveBeenCalled();
  });
});
