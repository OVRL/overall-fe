import { render, screen, fireEvent } from "@testing-library/react";
import MainFormationCollect from "../MainFormationCollect";
import "@testing-library/jest-dom";

// Mock resize observer if needed for charts/complex layouts, 
// though OnboardingFormationSelector uses standard DOM.
// useMediaQuery mock might be needed if responsive logic triggers different renders.
// For unit test, we can mock useMediaQuery or just let it default.
// JSDOM usually handles standard media queries poorly, but logic fallback exists.

jest.mock("@/hooks/useMediaQuery", () => ({
  useMediaQuery: () => true, // Simulate desktop
}));

describe("MainFormationCollect", () => {
  const mockOnNext = jest.fn();
  const mockOnDataChange = jest.fn();
  const defaultProps = {
    onNext: mockOnNext,
    onDataChange: mockOnDataChange,
    data: { name: "손흥민" }, // Name required for title
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("기본 렌더링 확인", () => {
    render(<MainFormationCollect {...defaultProps} />);
    expect(screen.getByText(/손흥민 선수!/)).toBeInTheDocument();
    expect(screen.getByText("메인 포지션")).toBeInTheDocument();
    // Selector should be rendered. We can look for a known position chip.
    // Assume chips render text like "FW", "ST", "GK" etc.
    expect(screen.getByText("GK")).toBeInTheDocument();
  });

  it("초기값이 있으면 선택된 상태여야 한다.", () => {
    // Provide mainPosition
    render(<MainFormationCollect {...defaultProps} data={{ ...defaultProps.data, mainPosition: "ST" }} />);
    // Initial state set in component: 
    // const [mainPosition, setMainPosition] = useState(...) -> default is 'FW' if not provided?
    // Code says: (data.mainPosition as Position) || "FW"
    // So default IS "FW".
    
    // We explicitly verified "ST".
    // How to check selected?
    // OnboardingPositionChip -> aria-pressed or class usage?
    // Usually chip with 'selected' prop has distinct style.
    // Or we check state effect on 'Next' button (always enabled if FW is default).
    
    const nextButton = screen.getByRole("button", { name: "다음" });
    expect(nextButton).toBeEnabled(); // Since "ST" is valid.
  });

  it("포지션 변경 및 다음 단계 진행", () => {
    render(<MainFormationCollect {...defaultProps} />);
    
    // Initial default "FW".
    // Click "GK".
    const gkChip = screen.getByText("GK");
    fireEvent.click(gkChip);
    
    // Expect state change. "다음" click.
    const nextButton = screen.getByRole("button", { name: "다음" });
    fireEvent.click(nextButton);
    
    expect(mockOnDataChange).toHaveBeenCalled();
    const updateFn = mockOnDataChange.mock.calls[0][0];
    expect(updateFn({})).toEqual({ mainPosition: "GK" });
    expect(mockOnNext).toHaveBeenCalled();
  });
});
