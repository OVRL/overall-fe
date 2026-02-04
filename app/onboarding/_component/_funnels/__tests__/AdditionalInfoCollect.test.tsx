import { render, screen, fireEvent } from "@testing-library/react";
import AdditionalInfoCollect from "../AdditionalInfoCollect";
import "@testing-library/jest-dom";

// Mock SelectMainFoot if it's complex, or just use it.
// Assuming SelectMainFoot is simple enough or we inspect it.
// "SelectMainFoot" usually has buttons for L/R.
// Let's assume we can interact with it via text "왼발" / "오른발" or similar, or assume "R" is default?
// Looking at AdditionalInfoCollect.tsx code:
// const [info, setInfo] = useState({ ..., mainFoot: ... || "R", ... })
// So "R" is default.
// Fields: activityArea (empty), preferredNumber (empty), favoritePlayer (empty).
// All must be filled for button to enable.

describe("AdditionalInfoCollect", () => {
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

  it("기본 렌더링 및 유효성 검사 (버튼 비활성화)", () => {
    render(<AdditionalInfoCollect {...defaultProps} />);
    expect(screen.getByText(/추가 정보를/)).toBeInTheDocument();
    
    const nextButton = screen.getByRole("button", { name: "다음" });
    expect(nextButton).toBeDisabled(); // fields empty
  });

  it("모든 정보 입력 시 다음 버튼 활성화", () => {
    render(<AdditionalInfoCollect {...defaultProps} />);
    
    const nextButton = screen.getByRole("button", { name: "다음" });
    
    // 1. 활동지역
    const areaInput = screen.getByLabelText("활동지역");
    fireEvent.change(areaInput, { target: { value: "서울" } });
    expect(nextButton).toBeDisabled();
    
    // 2. 주발 (Default R, but let's change to L to test interaction if possible, or leave as R)
    // MainFoot default is R. So it's valid already.
    
    // 3. 선호하는 등번호
    const numInput = screen.getByLabelText("선호하는 등번호");
    fireEvent.change(numInput, { target: { value: "7" } });
    expect(nextButton).toBeDisabled();
    
    // 4. 좋아하는 선수
    const playerInput = screen.getByLabelText("좋아하는 선수");
    fireEvent.change(playerInput, { target: { value: "손흥민" } });
    
    // Now all filled?
    expect(nextButton).toBeEnabled();
    
    fireEvent.click(nextButton);
    expect(mockOnDataChange).toHaveBeenCalled();
    const updateFn = mockOnDataChange.mock.calls[0][0];
    const newData = updateFn({});
    expect(newData.additionalInfo).toEqual({
      activityArea: "서울",
      mainFoot: "R",
      preferredNumber: 7,
      favoritePlayer: "손흥민"
    });
    expect(mockOnNext).toHaveBeenCalled();
  });
});
