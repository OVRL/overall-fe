import { renderHook, act } from "@testing-library/react";
import { useDebouncedDraftSaveAfterLineupChange } from "../useDebouncedDraftSaveAfterLineupChange";

describe("useDebouncedDraftSaveAfterLineupChange", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("enabled일 때 schedule 후 debounceMs 뒤에 saveDraft를 호출한다", () => {
    const saveDraft = jest.fn();
    const { result } = renderHook(() =>
      useDebouncedDraftSaveAfterLineupChange({
        enabled: true,
        saveDraft,
        debounceMs: 300,
      }),
    );

    act(() => {
      result.current.schedule();
    });
    expect(saveDraft).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(saveDraft).toHaveBeenCalledTimes(1);
  });

  it("연속 schedule 시 마지막 호출 기준으로 한 번만 실행한다", () => {
    const saveDraft = jest.fn();
    const { result } = renderHook(() =>
      useDebouncedDraftSaveAfterLineupChange({
        enabled: true,
        saveDraft,
        debounceMs: 200,
      }),
    );

    act(() => {
      result.current.schedule();
      jest.advanceTimersByTime(100);
      result.current.schedule();
      jest.advanceTimersByTime(200);
    });
    expect(saveDraft).toHaveBeenCalledTimes(1);
  });

  it("enabled가 false면 saveDraft를 호출하지 않는다", () => {
    const saveDraft = jest.fn();
    const { result } = renderHook(() =>
      useDebouncedDraftSaveAfterLineupChange({
        enabled: false,
        saveDraft,
        debounceMs: 100,
      }),
    );

    act(() => {
      result.current.schedule();
      jest.advanceTimersByTime(500);
    });
    expect(saveDraft).not.toHaveBeenCalled();
  });
});
