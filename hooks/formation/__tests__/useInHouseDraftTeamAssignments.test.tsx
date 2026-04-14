import { renderHook, act } from "@testing-library/react";
import type { Player } from "@/types/formation";
import { useInHouseDraftTeamAssignments } from "../useInHouseDraftTeamAssignments";

describe("useInHouseDraftTeamAssignments", () => {
  const player = {
    id: 1,
    name: "테스트",
    position: "ST",
    number: 9,
    overall: 70,
  } as Player;

  it("setDraftTeam으로 A를 넣으면 getDraftTeam이 A를 반환한다", () => {
    const { result } = renderHook(() => useInHouseDraftTeamAssignments());
    act(() => {
      result.current.setDraftTeam(player, "A");
    });
    expect(result.current.getDraftTeam(player)).toBe("A");
  });

  it("배정을 B로 바꾸면 getDraftTeam이 B를 반환한다", () => {
    const { result } = renderHook(() => useInHouseDraftTeamAssignments());
    act(() => {
      result.current.setDraftTeam(player, "A");
      result.current.setDraftTeam(player, "B");
    });
    expect(result.current.getDraftTeam(player)).toBe("B");
  });

  it("setDraftTeam(..., null)이면 해당 키가 제거되어 getDraftTeam이 null이다", () => {
    const { result } = renderHook(() => useInHouseDraftTeamAssignments());
    act(() => {
      result.current.setDraftTeam(player, "A");
      result.current.setDraftTeam(player, null);
    });
    expect(result.current.getDraftTeam(player)).toBeNull();
  });

  it("resetDraftAssignments면 전부 초기화된다", () => {
    const { result } = renderHook(() => useInHouseDraftTeamAssignments());
    act(() => {
      result.current.setDraftTeam(player, "A");
      result.current.resetDraftAssignments();
    });
    expect(result.current.getDraftTeam(player)).toBeNull();
    expect(result.current.draftTeamByKey).toEqual({});
  });

  it("같은 팀을 두 번 배정해도 getDraftTeam 값은 올바르다", () => {
    const { result } = renderHook(() => useInHouseDraftTeamAssignments());
    act(() => {
      result.current.setDraftTeam(player, "A");
      result.current.setDraftTeam(player, "A");
    });
    expect(result.current.getDraftTeam(player)).toBe("A");
  });
});
