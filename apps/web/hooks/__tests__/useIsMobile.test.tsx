import { renderHook } from "@testing-library/react";
import { useIsMobile } from "../useIsMobile";

function mockMatchMedia(matches: boolean) {
  const mql = {
    matches,
    media: "",
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
  window.matchMedia = jest.fn().mockReturnValue(mql);
  return mql;
}

describe("useIsMobile", () => {
  it("뷰포트가 maxWidth 이하이면 true", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useIsMobile(767));
    expect(result.current).toBe(true);
  });

  it("뷰포트가 maxWidth 초과이면 false", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useIsMobile(767));
    expect(result.current).toBe(false);
  });
});
