import { render, act } from "@testing-library/react";
import { useHorizontalScroll } from "../useHorizontalScroll";

function ScrollHarness() {
  const ref = useHorizontalScroll();
  return (
    <div
      ref={ref}
      data-testid="scroll"
      style={{ overflow: "auto", width: 100, height: 40 }}
    />
  );
}

describe("useHorizontalScroll", () => {
  it("세로 휠(deltaY)을 scrollLeft 증가로 변환한다", async () => {
    const { getByTestId } = render(<ScrollHarness />);
    const el = getByTestId("scroll");

    Object.defineProperty(el, "scrollLeft", {
      writable: true,
      configurable: true,
      value: 0,
    });
    const scrollTo = jest.fn();
    el.scrollTo = scrollTo;

    await act(async () => {
      await Promise.resolve();
    });

    const wheel = new WheelEvent("wheel", {
      deltaY: 40,
      bubbles: true,
      cancelable: true,
    });
    el.dispatchEvent(wheel);

    expect(scrollTo).toHaveBeenCalledWith({
      left: 40,
      behavior: "auto",
    });
  });
});
