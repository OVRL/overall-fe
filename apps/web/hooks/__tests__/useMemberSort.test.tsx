import { renderHook, act } from "@testing-library/react";
import type { RosterMember } from "@/components/home/Roster/useFindManyTeamMemberQuery";
import { useMemberSort } from "../useMemberSort";

describe("useMemberSort", () => {
  const members = [
    {
      id: 1,
      preferredPosition: "ST",
      preferredNumber: 2,
      user: { name: "나" },
      overall: { ovr: 70 },
    },
    {
      id: 2,
      preferredPosition: "ST",
      preferredNumber: 1,
      user: { name: "가" },
      overall: { ovr: 70 },
    },
  ] as unknown as RosterMember[];

  it("다른 키로 handleSort 시 direction은 desc로 시작", () => {
    const { result } = renderHook(() => useMemberSort(members));

    act(() => {
      result.current.handleSort("name");
    });
    expect(result.current.sortConfig).toEqual({
      key: "name",
      direction: "desc",
    });
  });

  it("이름 desc 후 asc 토글로 정렬 순서가 바뀐다", () => {
    const { result } = renderHook(() => useMemberSort(members));

    act(() => {
      result.current.handleSort("name");
    });
    expect(
      result.current.sortedMembers.map((m) => m.user?.name ?? ""),
    ).toEqual(["나", "가"]);

    act(() => {
      result.current.handleSort("name");
    });
    expect(
      result.current.sortedMembers.map((m) => m.user?.name ?? ""),
    ).toEqual(["가", "나"]);
  });
});
