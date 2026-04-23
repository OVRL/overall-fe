import { render, screen } from "@testing-library/react";
import AddressListSection from "../AddressListSection";
import "@testing-library/jest-dom";

// Mock child components
jest.mock("../SearchResultList", () => {
  return function MockSearchResultList({ keyword }: { keyword: string }) {
    return <div data-testid="search-result-list">Search Logic: {keyword}</div>;
  };
});

jest.mock("../DefaultAddressList", () => {
  return function MockDefaultAddressList() {
    return <div data-testid="default-address-list">Default List</div>;
  };
});

describe("AddressListSection 컴포넌트", () => {
  const mockOnSelect = jest.fn();
  const defaultProps = {
    onSelect: mockOnSelect,
    selectedCode: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("keyword가 없을 때 DefaultAddressList를 렌더링해야 한다", () => {
    render(<AddressListSection {...defaultProps} keyword="" />);

    expect(screen.getByText("추천")).toBeInTheDocument();
    expect(screen.getByTestId("default-address-list")).toBeInTheDocument();
    expect(screen.queryByTestId("search-result-list")).not.toBeInTheDocument();
  });

  it("keyword가 있을 때 SearchResultList를 렌더링해야 한다", () => {
    render(<AddressListSection {...defaultProps} keyword="강남" />);

    expect(screen.getByText("검색 결과")).toBeInTheDocument();
    expect(screen.getByTestId("search-result-list")).toBeInTheDocument();
    expect(screen.getByText("Search Logic: 강남")).toBeInTheDocument();
    expect(
      screen.queryByTestId("default-address-list"),
    ).not.toBeInTheDocument();
  });
});
