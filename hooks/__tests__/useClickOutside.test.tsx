import { useRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useClickOutside } from "../useClickOutside";

function Harness({ handler }: { handler: jest.Mock }) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, handler);
  return (
    <div ref={ref} data-testid="inside">
      <button type="button">내부</button>
    </div>
  );
}

describe("useClickOutside", () => {
  it("참조 요소 밖 mousedown 시 handler를 호출한다", () => {
    const handler = jest.fn();
    render(
      <>
        <Harness handler={handler} />
        <button type="button" data-testid="outside">
          바깥
        </button>
      </>,
    );

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("참조 요소 안쪽 클릭 시 handler를 호출하지 않는다", () => {
    const handler = jest.fn();
    render(<Harness handler={handler} />);

    fireEvent.mouseDown(screen.getByRole("button", { name: "내부" }));
    expect(handler).not.toHaveBeenCalled();
  });
});
