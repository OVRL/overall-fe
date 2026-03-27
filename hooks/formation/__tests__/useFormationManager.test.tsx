import { renderHook, act } from "@testing-library/react";
import { useFormationManager } from "../useFormationManager";
import { Player, QuarterData } from "@/types/formation";

describe("useFormationManager", () => {
  const mockPlayerA = { id: 1, name: "선수 A" } as Player;
  const mockPlayerB = { id: 2, name: "선수 B" } as Player;

  it("빈 포지션에 선수를 배치할 수 있어야 한다", () => {
    const { result } = renderHook(() => useFormationManager());

    act(() => {
      // 기본 초기화된 1쿼터(ID: 1)에 배치한다고 가정
      result.current.assignPlayer(1, 0, mockPlayerA);
    });

    const quarter = result.current.quarters.find((q) => q.id === 1);
    expect(quarter?.lineup?.[0]).toEqual(mockPlayerA);
  });

  it("이미 쿼터에 배치된 선수를 빈 포지션으로 이동시키면 기존 위치에서 제거되어야 한다", () => {
    const { result } = renderHook(() => useFormationManager());

    // 먼저 선수 A를 0번 위치에 배치
    act(() => {
      result.current.assignPlayer(1, 0, mockPlayerA);
    });

    // 선수 A를 1번 위치로 이동
    act(() => {
      result.current.assignPlayer(1, 1, mockPlayerA);
    });

    const quarter = result.current.quarters.find((q) => q.id === 1);
    expect(quarter?.lineup?.[0]).toBeUndefined();
    expect(quarter?.lineup?.[1]).toEqual(mockPlayerA);
  });

  it("같은 쿼터 내에서 선수가 있는 위치로 드래그하면 두 선수의 위치가 서로 바뀌어야 한다(Swap)", () => {
    const { result } = renderHook(() => useFormationManager());

    // 선수 A를 0번, 선수 B를 1번에 배치
    act(() => {
      result.current.assignPlayer(1, 0, mockPlayerA);
      result.current.assignPlayer(1, 1, mockPlayerB);
    });

    let quarter = result.current.quarters.find((q) => q.id === 1);
    expect(quarter?.lineup?.[0]).toEqual(mockPlayerA);
    expect(quarter?.lineup?.[1]).toEqual(mockPlayerB);

    // 0번 위치의 선수 A를 1번 위치(선수 B가 있는 곳)로 드랍하여 스왑 실행
    act(() => {
      result.current.assignPlayer(1, 1, mockPlayerA);
    });

    quarter = result.current.quarters.find((q) => q.id === 1);
    // 스왑 후: 0번 위치에는 선수 B가, 1번 위치에는 선수 A가 있어야 함
    expect(quarter?.lineup?.[0]).toEqual(mockPlayerB);
    expect(quarter?.lineup?.[1]).toEqual(mockPlayerA);
  });

  it("resetQuarters를 호출하면 초기 상태로 되돌아가야 한다", () => {
    // 임의의 초기 상태 설정
    const initialQuarters: QuarterData[] = [{
      id: 1, type: "IN_HOUSE", formation: "4-3-3", matchup: { home: "A", away: "B" }, lineup: {}
    }];

    const { result } = renderHook(() => useFormationManager(initialQuarters));

    // 선수를 배치하여 상태를 변경
    act(() => {
      result.current.assignPlayer(1, 0, mockPlayerA);
      result.current.assignPlayer(1, 1, mockPlayerB);
    });

    expect(result.current.quarters[0].lineup?.[0]).toEqual(mockPlayerA);

    // 초기화 함수 호출
    act(() => {
      result.current.resetQuarters();
    });

    // 라인업이 모두 비워져야(초기 상태) 한다
    expect(result.current.quarters[0].lineup).toEqual({});
  });
});
