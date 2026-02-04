import { render, screen, fireEvent } from "@testing-library/react";
import BirthDayCollect from "../BirthDayCollect";
import "@testing-library/jest-dom";

describe("BirthDayCollect", () => {
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

  it("기본 렌더링 확인", () => {
    render(<BirthDayCollect {...defaultProps} data={{ name: "홍길동" }} />);
    expect(screen.getByText(/홍길동 선수!/)).toBeInTheDocument();
    expect(screen.getByText(/생년월일을 알려주세요/)).toBeInTheDocument();
  });

  it("생년월일 입력 및 유효성 검사", () => {
    render(<BirthDayCollect {...defaultProps} />);
    
    const input = screen.getByLabelText("생년월일");
    const nextButton = screen.getByRole("button", { name: "다음" }); // 텍스트 "다음" 가정

    expect(nextButton).toBeDisabled();

    // 유효하지 않은 입력
    fireEvent.change(input, { target: { value: "199" } });
    expect(nextButton).toBeDisabled();

    // 유효한 입력 (BirthDayTextField가 "19990101" -> "1999-01-01" 포맷팅 수행)
    fireEvent.change(input, { target: { value: "19990101" } });
    expect(input).toHaveValue("1999-01-01");
    expect(nextButton).toBeEnabled();

    fireEvent.click(nextButton);
    expect(mockOnDataChange).toHaveBeenCalled();
    expect(mockOnNext).toHaveBeenCalled();
    
    // Check saved data
    const updateFn = mockOnDataChange.mock.calls[0][0];
    const newData = updateFn({});
    expect(newData).toEqual({ birthDate: "1999-01-01" });
  });
});
