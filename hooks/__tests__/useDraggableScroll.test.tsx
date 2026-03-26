import type { MutableRefObject } from "react";
import { renderHook, act } from "@testing-library/react";
import { useDraggableScroll } from "../useDraggableScroll";

describe("useDraggableScroll", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("scroll(right) 호출 시 컨테이너 scrollBy를 호출한다", () => {
    const scrollBy = jest.fn();
    const { result } = renderHook(() => useDraggableScroll());

    const div = document.createElement("div");
    div.scrollBy = scrollBy;
    Object.defineProperty(div, "scrollLeft", { value: 0, writable: true });
    Object.defineProperty(div, "scrollWidth", { value: 1000, configurable: true });
    Object.defineProperty(div, "clientWidth", { value: 100, configurable: true });

    (
      result.current.scrollContainerRef as MutableRefObject<HTMLDivElement | null>
    ).current = div;

    act(() => {
      result.current.scroll("right");
    });

    expect(scrollBy).toHaveBeenCalledWith({
      left: 340,
      behavior: "smooth",
    });
  });
});
