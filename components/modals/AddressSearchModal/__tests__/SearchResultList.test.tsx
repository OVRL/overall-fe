import { render, screen, fireEvent, act } from "@testing-library/react";
import { RelayEnvironmentProvider } from "react-relay";
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils";
import SearchResultList from "../SearchResultList";
import { Suspense } from "react";
import "@testing-library/jest-dom";

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

// Mock AddressItem
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

describe("SearchResultList 컴포넌트", () => {
  let environment: any; // Type inference issue with mock env
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    environment = createMockEnvironment();
    jest.clearAllMocks();
  });

  const TestWrapper = ({ keyword = "test", selectedCode = null }: any) => (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResultList
          keyword={keyword}
          onSelect={mockOnSelect}
          selectedCode={selectedCode}
        />
      </Suspense>
    </RelayEnvironmentProvider>
  );

  it("초기 로딩 상태가 렌더링되어야 한다", () => {
    render(<TestWrapper />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("쿼리가 완료되면 아이템 목록이 렌더링되어야 한다", async () => {
    render(<TestWrapper />);

    act(() => {
      environment.mock.resolveMostRecentOperation((operation: any) =>
        MockPayloadGenerator.generate(operation, {
          RegionSearch: () => ({
            items: [
              {
                code: "111",
                sidoName: "Seoul",
                siggName: "Gangnam",
                dongName: "Yeoksam",
                riName: null,
                name: "Yeoksam-dong",
              },
            ],
            hasNextPage: false,
          }),
        }),
      );
    });

    expect(
      await screen.findByText("Seoul Gangnam Yeoksam"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("결과가 없을 때 빈 상태가 렌더링되어야 한다", async () => {
    render(<TestWrapper />);

    act(() => {
      environment.mock.resolveMostRecentOperation((operation: any) =>
        MockPayloadGenerator.generate(operation, {
          RegionSearch: () => ({
            items: [],
            hasNextPage: false,
          }),
        }),
      );
    });

    expect(
      await screen.findByText("검색 결과가 없습니다."),
    ).toBeInTheDocument();
  });

  it("아이템 선택이 동작해야 한다", async () => {
    render(<TestWrapper />);

    act(() => {
      environment.mock.resolveMostRecentOperation((operation: any) =>
        MockPayloadGenerator.generate(operation, {
          RegionSearch: () => ({
            items: [
              {
                code: "111",
                sidoName: "Seoul",
                siggName: "Gangnam",
                dongName: "Yeoksam",
                riName: null,
                name: "Yeoksam-dong",
              },
            ],
            hasNextPage: false,
          }),
        }),
      );
    });

    const item = await screen.findByTestId("address-item");
    fireEvent.click(item);

    expect(mockOnSelect).toHaveBeenCalledWith("Seoul Gangnam Yeoksam", "111");
  });

  it("선택된 아이템이 올바르게 하이라이트되어야 한다", async () => {
    render(<TestWrapper selectedCode="111" />);

    act(() => {
      environment.mock.resolveMostRecentOperation((operation: any) =>
        MockPayloadGenerator.generate(operation, {
          RegionSearch: () => ({
            items: [
              {
                code: "111",
                sidoName: "Seoul",
                siggName: "Gangnam",
                dongName: "Yeoksam",
                riName: null,
                name: "Yeoksam-dong",
              },
              {
                code: "222",
                sidoName: "Seoul",
                siggName: "Seocho",
                dongName: "Seocho",
                riName: null,
                name: "Seocho-dong",
              },
            ],
            hasNextPage: false,
          }),
        }),
      );
    });

    const items = await screen.findAllByTestId("address-item");
    expect(items[0]).toHaveAttribute("data-selected", "true");
    expect(items[1]).toHaveAttribute("data-selected", "false");
  });
});
