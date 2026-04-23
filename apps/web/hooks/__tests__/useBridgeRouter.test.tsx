import { renderHook } from "@testing-library/react";
import { useBridgeRouter } from "../bridge/useBridgeRouter";

const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn() };

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

describe("useBridgeRouter", () => {
  it("Next useRouter 인스턴스를 그대로 반환한다", () => {
    const { result } = renderHook(() => useBridgeRouter());
    expect(result.current).toBe(mockRouter);
  });
});
