import { render, screen, fireEvent } from "@testing-library/react";
import DefaultAddressList from "../DefaultAddressList";
import "@testing-library/jest-dom";

// Mock AddressItem since we already tested it
jest.mock("../AddressItem", () => {
  return function MockAddressItem({
    address,
    onClick,
    selected,
  }: {
    address: string;
    onClick: () => void;
    selected?: boolean;
  }) {
    return (
      <li data-testid="address-item" data-selected={selected} onClick={onClick}>
        {address}
      </li>
    );
  };
});

describe("DefaultAddressList 컴포넌트", () => {
  const mockOnSelect = jest.fn();
  const defaultProps = {
    onSelect: mockOnSelect,
    selectedCode: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("기본 주소 목록이 올바르게 렌더링되어야 한다", () => {
    render(<DefaultAddressList {...defaultProps} />);
    const items = screen.getAllByTestId("address-item");
    expect(items).toHaveLength(3);

    expect(screen.getByText("서울특별시 강남구 역삼동")).toBeInTheDocument();
    expect(screen.getByText("서울특별시 중구 광희동")).toBeInTheDocument();
    expect(screen.getByText("서울특별시 강서구 가양동")).toBeInTheDocument();
  });

  it("항목 클릭 시 올바른 인자와 함께 onSelect가 호출되어야 한다", () => {
    render(<DefaultAddressList {...defaultProps} />);

    const yeoksam = screen.getByText("서울특별시 강남구 역삼동");
    fireEvent.click(yeoksam);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(
      "서울특별시 강남구 역삼동",
      "1168010100",
    );
  });

  it("AddressItem에 selected prop이 올바르게 전달되어야 한다", () => {
    render(<DefaultAddressList {...defaultProps} selectedCode="1168010100" />);

    const items = screen.getAllByTestId("address-item");

    // Yeoksam should be selected
    expect(items[0]).toHaveAttribute("data-selected", "true");
    // Others should not
    expect(items[1]).toHaveAttribute("data-selected", "false");
    expect(items[2]).toHaveAttribute("data-selected", "false");
  });
});
