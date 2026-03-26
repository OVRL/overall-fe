import type { ReactNode, PropsWithChildren } from "react";
import { renderHook, act } from "@testing-library/react";

jest.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
  motion: {
    div: ({
      children,
      ...rest
    }: PropsWithChildren<Record<string, unknown>>) => (
      <div {...rest}>{children}</div>
    ),
  },
}));

import { useFunnel } from "../useFunnel";

describe("useFunnel", () => {
  it("setStep으로 히스토리가 쌓이고 goBack으로 이전 단계로 돌아간다", () => {
    const { result } = renderHook(() =>
      useFunnel<"one" | "two" | "three">("one"),
    );

    expect(result.current.step).toBe("one");
    expect(result.current.history).toEqual(["one"]);

    act(() => {
      result.current.setStep("two");
    });
    expect(result.current.step).toBe("two");
    expect(result.current.history).toEqual(["one", "two"]);

    act(() => {
      result.current.goBack();
    });
    expect(result.current.step).toBe("one");
    expect(result.current.history).toEqual(["one"]);
  });

  it("히스토리가 한 단계일 때 goBack은 변화 없음", () => {
    const { result } = renderHook(() => useFunnel<"a" | "b">("a"));

    act(() => {
      result.current.goBack();
    });
    expect(result.current.history).toEqual(["a"]);
  });
});
