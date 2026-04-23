import { renderHook } from "@testing-library/react";
import { useScrollLock } from "../useScrollLock";

describe("useScrollLock", () => {
  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("isLocked true이면 body overflow hidden", () => {
    renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("isLocked false이면 unset", () => {
    const { rerender } = renderHook(
      ({ locked }: { locked: boolean }) => useScrollLock(locked),
      { initialProps: { locked: true } },
    );
    expect(document.body.style.overflow).toBe("hidden");

    rerender({ locked: false });
    expect(document.body.style.overflow).toBe("unset");
  });

  it("언마운트 시 overflow를 복구한다", () => {
    const { unmount } = renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("unset");
  });
});
