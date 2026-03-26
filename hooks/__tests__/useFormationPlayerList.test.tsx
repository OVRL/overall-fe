import { renderHook, act } from "@testing-library/react";
import type { Player } from "@/types/formation";
import { useFormationPlayerList } from "../formation/useFormationPlayerList";

const p = (overrides: Partial<Player> & Pick<Player, "id" | "name">): Player =>
  ({
    position: "ST",
    number: 9,
    overall: 80,
    image: "",
    season: "24-25",
    ...overrides,
  }) as Player;

describe("useFormationPlayerList", () => {
  const players: Player[] = [
    p({ id: 1, name: "김공격", position: "ST" }),
    p({ id: 2, name: "이수비", position: "CB" }),
  ];

  it("검색어가 이름에 포함된 선수만 남긴다", () => {
    const { result } = renderHook(() =>
      useFormationPlayerList({ players, targetPosition: null }),
    );

    act(() => {
      result.current.setSearchTerm("김");
    });

    expect(result.current.filteredPlayers).toHaveLength(1);
    expect(result.current.filteredPlayers[0].name).toBe("김공격");
  });

  it("전체 탭이면 검색만 통과한 모든 선수를 반환한다", () => {
    const { result } = renderHook(() =>
      useFormationPlayerList({ players, targetPosition: null }),
    );

    expect(result.current.activePosTab).toBe("전체");
    expect(result.current.filteredPlayers).toHaveLength(2);
  });
});
