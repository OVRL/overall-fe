import { render, screen, fireEvent } from "@testing-library/react";
import SearchInputSection from "../SearchInputSection";
import "@testing-library/jest-dom";

// Mock the Icon component and SVG import
jest.mock("@/components/ui/Icon", () => {
  return function MockIcon() {
    return <div data-testid="mock-icon" />;
  };
});
jest.mock("@/public/icons/search.svg", () => "search.svg");

describe("SearchInputSection 컴포넌트", () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    id: "search-input",
    value: "",
    onChange: mockOnChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("초기 빈 값으로 올바르게 렌더링되어야 한다", () => {
    render(<SearchInputSection {...defaultProps} />);
    const input = screen.getByPlaceholderText("지역이나 동네로 검색하기");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("입력 변경 시 onChange 핸들러가 호출되어야 한다", () => {
    render(<SearchInputSection {...defaultProps} />);
    const input = screen.getByPlaceholderText("지역이나 동네로 검색하기");
    fireEvent.change(input, { target: { value: "강남" } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("강남");
  });

  it("제공된 값으로 렌더링되어야 한다", () => {
    render(<SearchInputSection {...defaultProps} value="역삼" />);
    const input = screen.getByPlaceholderText("지역이나 동네로 검색하기");
    expect(input).toHaveValue("역삼");
  });
});
