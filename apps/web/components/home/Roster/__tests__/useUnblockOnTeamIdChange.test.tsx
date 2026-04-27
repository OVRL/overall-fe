import { renderHook } from "@testing-library/react";
import { useUnblockOnTeamIdChange } from "../useUnblockOnTeamIdChange";

describe("useUnblockOnTeamIdChange", () => {
  it("팀이 계속 null이면 false", () => {
    const { result, rerender } = renderHook(
      ({ id }: { id: number | null }) => useUnblockOnTeamIdChange(id),
      { initialProps: { id: null as number | null } },
    );
    expect(result.current).toBe(false);
    rerender({ id: null });
    expect(result.current).toBe(false);
  });

  it("첫 숫자 팀만 설정되면 false", () => {
    const { result } = renderHook(() => useUnblockOnTeamIdChange(1));
    expect(result.current).toBe(false);
  });

  it("숫자 팀에서 다른 숫자 팀으로 바뀌면 true", () => {
    const { result, rerender } = renderHook(
      ({ id }: { id: number | null }) => useUnblockOnTeamIdChange(id),
      { initialProps: { id: 1 as number | null } },
    );
    expect(result.current).toBe(false);
    rerender({ id: 2 });
    expect(result.current).toBe(true);
  });

  it("팀에서 null로 바뀌어도 true로 바뀌지 않음", () => {
    const { result, rerender } = renderHook(
      ({ id }: { id: number | null }) => useUnblockOnTeamIdChange(id),
      { initialProps: { id: 1 as number | null } },
    );
    rerender({ id: null });
    expect(result.current).toBe(false);
  });
});
