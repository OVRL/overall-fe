import { render, screen, fireEvent } from "@testing-library/react";
import SubFormationCollect from "../SubFormationCollect";
import "@testing-library/jest-dom";

jest.mock("@/hooks/useMediaQuery", () => ({
  useMediaQuery: () => true,
}));

describe("SubFormationCollect", () => {
  const mockOnNext = jest.fn();
  const mockOnDataChange = jest.fn();
  const defaultProps = {
    onNext: mockOnNext,
    onDataChange: mockOnDataChange,
    data: { name: "손흥민", mainPosition: "ST" }, // mainPosition used for disabled logic
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("기본 렌더링 확인", () => {
    render(<SubFormationCollect {...defaultProps} />);
    expect(screen.getByText("서브 포지션")).toBeInTheDocument();
    
    // 메인 포지션(ST)은 비활성화되어 있어야 함 (선택 불가 style or disabled)
    // OnboardingPositionChip disabled verification might be tricky via generic 'disabled' attribute on div?
    // Usually button disabled attribute.
    // Let's assume chip is a button.
    // Try click ST
    const stChip = screen.getByRole("button", { name: "ST" }); // or getByText("ST") parent
    // If it's a button and disabled prop is passed, standard matcher works.
    expect(stChip).toBeDisabled(); 
  });

  it("서브 포지션 2개 선택 시 다음 버튼 활성화", () => {
    render(<SubFormationCollect {...defaultProps} />);
    
    const nextButton = screen.getByRole("button", { name: "다음" });
    expect(nextButton).toBeDisabled(); // 0 selected
    
    // 1st selection: LW
    const lwChip = screen.getByRole("button", { name: "LW" });
    fireEvent.click(lwChip);
    expect(nextButton).toBeDisabled(); // 1 selected
    
    // 2nd selection: RW
    const rwChip = screen.getByRole("button", { name: "RW" });
    fireEvent.click(rwChip);
    expect(nextButton).toBeEnabled(); // 2 selected (Complete)
    
    fireEvent.click(nextButton);
    expect(mockOnDataChange).toHaveBeenCalled();
    const updateFn = mockOnDataChange.mock.calls[0][0];
    const newData = updateFn({});
    // Should include subPositions array
    // Note: mockOnDataChange updates are usually merged.
    // Verify result contains subPositions with 2 items.
    expect(newData.subPositions.sort()).toEqual(["LW", "RW"].sort());
  });

  it("서브 포지션 3개 이상 선택 불가 확인", () => {
    render(<SubFormationCollect {...defaultProps} />);
    
    fireEvent.click(screen.getByRole("button", { name: "LW" }));
    fireEvent.click(screen.getByRole("button", { name: "RW" }));
    
    // 3rd selection: CM
    const cmChip = screen.getByRole("button", { name: "CM" });
    fireEvent.click(cmChip);
    
    // Should verify state didn't change (still 2).
    // Logic: if (newPositions.length <= 2) setSubPositions(...)
    // If we click unselected one, newPositions length becomes 3 -> Not set.
    
    const nextButton = screen.getByRole("button", { name: "다음" });
    fireEvent.click(nextButton);
    
    const updateFn = mockOnDataChange.mock.calls[0][0];
    const newData = updateFn({});
    expect(newData.subPositions).toHaveLength(2);
    expect(newData.subPositions).not.toContain("CM");
  });
});
