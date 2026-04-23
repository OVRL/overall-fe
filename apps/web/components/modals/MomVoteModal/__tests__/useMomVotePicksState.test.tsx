import { renderHook, act } from "@testing-library/react";
import type { momVoteModalQuery } from "@/__generated__/momVoteModalQuery.graphql";
import { useMomVotePicksState } from "../useMomVotePicksState";

type Row = momVoteModalQuery["response"]["findMyMatchMom"][number];

function row(partial: Partial<Row>): Row {
  return {
    id: 1,
    matchId: 1,
    teamId: 1,
    voterUserId: 9,
    candidateUserId: 11,
    candidateMercenaryId: null,
    createdAt: "2024-01-02T00:00:00.000Z",
    candidateUser: { name: "A" },
    candidateMercenary: null,
    ...partial,
  } as Row;
}

describe("useMomVotePicksState", () => {
  it("투표가 없으면 hasVoted=false이고 슬롯은 비어 있다", () => {
    const { result } = renderHook(() =>
      useMomVotePicksState({ myVotes: [], refreshKey: 0 }),
    );
    expect(result.current.hasVoted).toBe(false);
    expect(result.current.top1).toBeUndefined();
    expect(result.current.picksDisabled).toBe(false);
  });

  it("서버 투표가 있으면 hasVoted=true이고 드롭다운은 잠긴다", () => {
    const votes = [
      row({
        id: 1,
        createdAt: "2024-01-01T00:00:00.000Z",
        candidateUserId: 10,
      }),
      row({
        id: 2,
        createdAt: "2024-01-01T01:00:00.000Z",
        candidateUserId: 20,
      }),
      row({
        id: 3,
        createdAt: "2024-01-01T02:00:00.000Z",
        candidateUserId: 30,
      }),
    ];
    const { result } = renderHook(() =>
      useMomVotePicksState({ myVotes: votes, refreshKey: 0 }),
    );
    expect(result.current.hasVoted).toBe(true);
    expect(result.current.top1).toBe("10");
    expect(result.current.top2).toBe("20");
    expect(result.current.top3).toBe("30");
    expect(result.current.picksDisabled).toBe(true);
  });

  it("beginRevoteEditing 호출 시 편집 모드로 전환된다", () => {
    const votes = [
      row({ id: 1, createdAt: "2024-01-01T00:00:00.000Z", candidateUserId: 1 }),
      row({ id: 2, createdAt: "2024-01-01T01:00:00.000Z", candidateUserId: 2 }),
      row({ id: 3, createdAt: "2024-01-01T02:00:00.000Z", candidateUserId: 3 }),
    ];
    const { result } = renderHook(() =>
      useMomVotePicksState({ myVotes: votes, refreshKey: 0 }),
    );
    act(() => {
      result.current.beginRevoteEditing();
    });
    expect(result.current.picksDisabled).toBe(false);
  });

  it("refreshKey가 바뀌면 서버 스냅샷으로 되돌아간다", () => {
    const votes = [
      row({ id: 1, createdAt: "2024-01-01T00:00:00.000Z", candidateUserId: 1 }),
      row({ id: 2, createdAt: "2024-01-01T01:00:00.000Z", candidateUserId: 2 }),
      row({ id: 3, createdAt: "2024-01-01T02:00:00.000Z", candidateUserId: 3 }),
    ];
    const { result, rerender } = renderHook(
      ({ refreshKey }) =>
        useMomVotePicksState({ myVotes: votes, refreshKey }),
      { initialProps: { refreshKey: 0 } },
    );
    act(() => {
      result.current.beginRevoteEditing();
    });
    expect(result.current.picksDisabled).toBe(false);

    rerender({ refreshKey: 1 });
    expect(result.current.picksDisabled).toBe(true);
  });
});
