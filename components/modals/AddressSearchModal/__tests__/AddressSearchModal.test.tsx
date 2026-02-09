import { render, screen, fireEvent, act } from "@testing-library/react";
import AddressSearchModal from "../AddressSearchModal";
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils";
import "@testing-library/jest-dom";

// Mock environment
const mockEnvironment = createMockEnvironment();
jest.mock("@/lib/relay/environment", () => ({
  getClientEnvironment: () => mockEnvironment,
}));

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    observe() {
      return null;
    }
    disconnect() {
      return null;
    }
    unobserve() {
      return null;
    }
  } as any;
});

// Mock Icon to avoid SVG issues
jest.mock("@/components/Icon", () => () => <div data-testid="mock-icon" />);
jest.mock("@/public/icons/search.svg", () => "search.svg");
jest.mock("@/public/icons/check.svg", () => "check.svg");

// Mock useModal
const mockHideModal = jest.fn();
jest.mock("@/hooks/useModal", () => ({
  __esModule: true,
  default: () => ({
    hideModal: mockHideModal,
  }),
}));

describe("AddressSearchModal 컴포넌트", () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockEnvironment.mockClear();
  });

  it("기본 주소 목록과 함께 올바르게 렌더링되어야 한다", () => {
    render(<AddressSearchModal onComplete={mockOnComplete} />);

    expect(screen.getByText("활동 지역")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("지역이나 동네로 검색하기"),
    ).toBeInTheDocument();
    expect(screen.getByText("추천")).toBeInTheDocument();
    // Default items
    expect(screen.getByText("서울특별시 강남구 역삼동")).toBeInTheDocument();
    // Complete button disabled initially
    expect(screen.getByText("완료")).toBeDisabled();
  });

  it("기본 주소 선택 시 완료 버튼이 활성화되어야 한다", () => {
    render(<AddressSearchModal onComplete={mockOnComplete} />);

    const item = screen.getByText("서울특별시 강남구 역삼동");
    fireEvent.click(item);

    const button = screen.getByText("완료");
    expect(button).toBeEnabled();

    fireEvent.click(button);
    expect(mockOnComplete).toHaveBeenCalledWith({
      address: "서울특별시 강남구 역삼동",
      code: "1168010100",
    });
    expect(mockHideModal).toHaveBeenCalled();
  });

  it("주소 검색 및 선택이 동작해야 한다", async () => {
    jest.useFakeTimers();
    render(<AddressSearchModal onComplete={mockOnComplete} />);

    const input = screen.getByPlaceholderText("지역이나 동네로 검색하기");
    fireEvent.change(input, { target: { value: "강남" } });

    // Advance timers for debounce
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByText("검색 중...")).toBeInTheDocument();

    // Resolve Relay query
    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation((operation: any) =>
        MockPayloadGenerator.generate(operation, {
          RegionSearch: () => ({
            items: [
              {
                code: "999",
                sidoName: "Seoul",
                siggName: "Gangnam",
                dongName: "Test",
                riName: null,
                name: "Test-dong",
              },
            ],
            hasNextPage: false,
          }),
        }),
      );
    });

    // Wait for items
    const item = await screen.findByText("Seoul Gangnam Test");
    fireEvent.click(item);

    const button = screen.getByText("완료");
    expect(button).toBeEnabled();

    fireEvent.click(button);
    expect(mockOnComplete).toHaveBeenCalledWith({
      address: "Seoul Gangnam Test",
      code: "999",
    });

    jest.useRealTimers();
  });
});
