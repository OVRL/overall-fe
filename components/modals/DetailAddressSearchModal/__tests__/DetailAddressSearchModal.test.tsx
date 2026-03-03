import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DetailAddressSearchModal from "../DetailAddressSearchModal";
import { useNaverAddressSearch } from "@/hooks/useNaverAddressSearch";
import "@testing-library/jest-dom";

const mockHideModal = jest.fn();
jest.mock("@/hooks/useModal", () => ({
  __esModule: true,
  default: () => ({ hideModal: mockHideModal }),
}));

jest.mock("@/public/icons/search.svg", () => "search.svg");
jest.mock("@/public/icons/close.svg", () => "close.svg");
jest.mock("@/components/ui/Icon", () => ({
  __esModule: true,
  default: ({ alt }: { alt?: string }) => <span role="img" aria-label={alt ?? "icon"} />,
}));

// Mock hook
jest.mock("@/hooks/useNaverAddressSearch");
const mockUseNaverAddressSearch = useNaverAddressSearch as jest.MockedFunction<
  typeof useNaverAddressSearch
>;

describe("DetailAddressSearchModal 컴포넌트", () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setupMock = (overrides = {}) => {
    mockUseNaverAddressSearch.mockReturnValue({
      inputValue: "",
      setInputValue: jest.fn(),
      searchResults: [],
      selectedAddress: null,
      isLoading: false,
      handleSelect: jest.fn(),
      handleComplete: jest.fn(),
      ...overrides,
    });
  };

  it("초기 상태에서 빈 결과 안내 메시지가 표시되어야 한다", () => {
    setupMock({ inputValue: "" });
    render(<DetailAddressSearchModal onComplete={mockOnComplete} />);

    expect(screen.getByText("상세 위치 검색")).toBeInTheDocument();
    expect(screen.getByText("검색된 지역이 없습니다.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "확인" })).toBeDisabled();
  });

  it("검색 결과가 없을 때 일치하는 주소가 없다는 메시지가 표시되어야 한다", () => {
    setupMock({ inputValue: "없는주소" });
    render(<DetailAddressSearchModal onComplete={mockOnComplete} />);

    expect(screen.getByText("일치하는 주소가 없습니다.")).toBeInTheDocument();
  });

  it("검색 결과가 있을 때 목록이 올바르게 렌더링되어야 한다", () => {
    const searchResults = [
      {
        address: "서울특별시 강남구 테헤란로 1",
        latitude: 37.1,
        longitude: 127.1,
      },
      {
        address: "서울특별시 서초구 서초대로 1",
        latitude: 37.2,
        longitude: 127.2,
      },
    ];
    setupMock({ searchResults });

    render(<DetailAddressSearchModal onComplete={mockOnComplete} />);

    expect(
      screen.getByText("서울특별시 강남구 테헤란로 1"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("서울특별시 서초구 서초대로 1"),
    ).toBeInTheDocument();
  });

  it("주소를 선택하고 확인 버튼 클릭 시 handleSelect·handleComplete가 호출된다", () => {
    const searchResults = [
      {
        address: "서울특별시 강남구 역삼동",
        latitude: 37.123,
        longitude: 127.123,
      },
    ];
    const mockHandleSelect = jest.fn();
    const mockHandleComplete = jest.fn();

    setupMock({
      searchResults,
      handleSelect: mockHandleSelect,
      handleComplete: mockHandleComplete,
    });

    const { rerender } = render(
      <DetailAddressSearchModal onComplete={mockOnComplete} />,
    );

    fireEvent.click(screen.getByText("서울특별시 강남구 역삼동"));
    expect(mockHandleSelect).toHaveBeenCalledWith(searchResults[0]);

    setupMock({
      searchResults,
      selectedAddress: searchResults[0],
      handleComplete: mockHandleComplete,
    });
    rerender(<DetailAddressSearchModal onComplete={mockOnComplete} />);

    const confirmButton = screen.getByRole("button", { name: "확인" });
    expect(confirmButton).toBeEnabled();

    fireEvent.click(confirmButton);
    expect(mockHandleComplete).toHaveBeenCalled();
  });

  it("로딩 중일 때 검색 결과 영역에 로딩 UI가 표시된다", () => {
    setupMock({ isLoading: true });
    render(<DetailAddressSearchModal onComplete={mockOnComplete} />);

    expect(screen.getByText("상세 위치 검색")).toBeInTheDocument();
    expect(screen.getByText("검색 결과")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "확인" })).toBeDisabled();
  });
});
