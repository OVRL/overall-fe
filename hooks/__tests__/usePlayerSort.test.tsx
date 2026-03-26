import { renderHook, act } from "@testing-library/react";
import type { Player } from "@/types/player";
import { usePlayerSort } from "../usePlayerSort";

function makePlayer(
  overrides: Partial<Player> & Pick<Player, "id" | "name" | "position" | "overall">,
): Player {
  return {
    shooting: 0,
    passing: 0,
    dribbling: 0,
    defending: 0,
    physical: 0,
    pace: 0,
    number: 10,
    ...overrides,
  };
}

describe("usePlayerSort", () => {
  const players: Player[] = [
    makePlayer({
      id: 1,
      name: "B",
      position: "GK",
      overall: 70,
      number: 1,
    }),
    makePlayer({
      id: 2,
      name: "A",
      position: "ST",
      overall: 80,
      number: 9,
    }),
  ];

  it("기본 정렬은 포지션 오름차순(FW 먼저 등)", () => {
    const { result } = renderHook(() => usePlayerSort(players));
    expect(result.current.sortConfig?.key).toBe("position");
    expect(result.current.sortedPlayers[0].position).toBe("ST");
    expect(result.current.sortedPlayers[1].position).toBe("GK");
  });

  it("같은 키로 handleSort 호출 시 방향이 토글된다", () => {
    const { result } = renderHook(() => usePlayerSort(players));

    act(() => {
      result.current.handleSort("name");
    });
    expect(result.current.sortConfig).toEqual({
      key: "name",
      direction: "desc",
    });

    act(() => {
      result.current.handleSort("name");
    });
    expect(result.current.sortConfig).toEqual({
      key: "name",
      direction: "asc",
    });
  });

  it("이름 asc 정렬 시 localeCompare 순서", () => {
    const { result } = renderHook(() => usePlayerSort(players));

    act(() => {
      result.current.handleSort("name");
    });
    act(() => {
      result.current.handleSort("name");
    });

    expect(result.current.sortedPlayers.map((p) => p.name)).toEqual(["A", "B"]);
  });
});
