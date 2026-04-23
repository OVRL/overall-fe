import { renderHook, act } from "@testing-library/react";

const confettiMock = jest.fn();

jest.mock("canvas-confetti", () => ({
  __esModule: true,
  default: (...args: unknown[]) => confettiMock(...args),
}));

import { useCelebrationConfetti } from "../useCelebrationConfetti";

describe("useCelebrationConfetti", () => {
  beforeEach(() => {
    confettiMock.mockClear();
    jest.useFakeTimers();
    jest.spyOn(Date, "now").mockReturnValue(0);
    jest.spyOn(global, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("마운트 시 confetti를 호출한다", () => {
    renderHook(() => useCelebrationConfetti({ durationMs: 0 }));

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(confettiMock).toHaveBeenCalled();
  });
});
