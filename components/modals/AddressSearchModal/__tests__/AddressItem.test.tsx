import { render, screen, fireEvent } from "@testing-library/react";
import AddressItem from "../AddressItem";
import "@testing-library/jest-dom";

// Mock the Icon component and SVG import
jest.mock("@/components/ui/Icon", () => {
  return function MockIcon() {
    return <div data-testid="mock-icon" />;
  };
});
jest.mock("@/public/icons/check.svg", () => "check.svg");

describe("AddressItem 컴포넌트", () => {
  const mockOnClick = jest.fn();
  const defaultProps = {
    address: "서울특별시 강남구 역삼동",
    onClick: mockOnClick,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("주소 텍스트가 올바르게 렌더링되어야 한다", () => {
    render(<AddressItem {...defaultProps} />);
    expect(screen.getByText("서울특별시 강남구 역삼동")).toBeInTheDocument();
  });

  it("클릭 시 onClick 핸들러가 호출되어야 한다", () => {
    render(<AddressItem {...defaultProps} />);
    const item = screen.getByText("서울특별시 강남구 역삼동").closest("li");
    fireEvent.click(item!);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("선택되지 않았을 때 기본 스타일이 적용되어야 한다", () => {
    render(<AddressItem {...defaultProps} />);
    const item = screen.getByText("서울특별시 강남구 역삼동").closest("li");
    expect(item).toHaveClass("text-Label-Tertiary");
    expect(item).not.toHaveClass("text-Label-AccentPrimary");
    expect(screen.queryByTestId("mock-icon")).not.toBeInTheDocument();
  });

  it("선택되었을 때 선택 스타일이 적용되고 체크 아이콘이 보여야 한다", () => {
    render(<AddressItem {...defaultProps} selected={true} />);
    const item = screen.getByText("서울특별시 강남구 역삼동").closest("li");
    expect(item).toHaveClass("text-Label-AccentPrimary");
    expect(item).not.toHaveClass("text-Label-Tertiary");
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });
});
