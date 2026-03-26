import { renderHook, act, waitFor } from "@testing-library/react";
import { useMediaQuery } from "../useMediaQuery";

describe("useMediaQuery", () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query === "(max-width: 1px)",
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
  });

  it("초기에는 null이었다가 클라이언트에서 매칭 결과로 갱신된다", async () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 1px)"));

    expect(result.current).toBeNull();

    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
