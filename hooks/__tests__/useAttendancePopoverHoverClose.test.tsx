import { useState } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  useAttendancePopoverHoverClose,
  type AttendancePopoverOpenKind,
} from "../useAttendancePopoverHoverClose";

function HoverHarness() {
  const [kind, setKind] = useState<AttendancePopoverOpenKind>("attend");
  const { scheduleClose, cancelClose } =
    useAttendancePopoverHoverClose(setKind);

  return (
    <div>
      <span data-testid="kind">{kind === null ? "null" : kind}</span>
      <button type="button" data-testid="schedule" onClick={scheduleClose}>
        지연 닫기
      </button>
      <button type="button" data-testid="cancel" onClick={cancelClose}>
        취소
      </button>
    </div>
  );
}

describe("useAttendancePopoverHoverClose", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("scheduleClose 후 HOVER_CLOSE_MS 지나면 null로 닫힌다", () => {
    render(<HoverHarness />);
    expect(screen.getByTestId("kind")).toHaveTextContent("attend");

    fireEvent.click(screen.getByTestId("schedule"));

    act(() => {
      jest.advanceTimersByTime(139);
    });
    expect(screen.getByTestId("kind")).toHaveTextContent("attend");

    act(() => {
      jest.advanceTimersByTime(2);
    });
    expect(screen.getByTestId("kind")).toHaveTextContent("null");
  });

  it("닫기 전 cancelClose 하면 닫히지 않는다", () => {
    render(<HoverHarness />);

    fireEvent.click(screen.getByTestId("schedule"));
    act(() => {
      jest.advanceTimersByTime(50);
    });
    fireEvent.click(screen.getByTestId("cancel"));
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByTestId("kind")).toHaveTextContent("attend");
  });
});
