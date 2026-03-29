import { renderHook, act } from "@testing-library/react";
import { usePlayerSearch, PendingPlayerItem } from "../usePlayerSearch";
import { useLazyLoadQuery } from "react-relay";

jest.mock("react-relay", () => {
  const mockEnv = {};
  return {
    useRelayEnvironment: jest.fn(() => mockEnv),
    useLazyLoadQuery: jest.fn(),
    fetchQuery: jest.fn(() => ({
      toPromise: jest.fn().mockResolvedValue({ searchTeamMember: [] }),
    })),
    commitMutation: jest.fn(),
  };
});

jest.mock("@/hooks/useModal", () => ({
  __esModule: true,
  default: () => ({ hideModal: jest.fn() }),
}));

jest.mock("@toss/react", () => ({
  useDebounce: (fn: any) => {
    const { useCallback } = require("react");
    return useCallback(fn, []);
  },
}));

describe("usePlayerSearch 훅", () => {
  const matchId = 1;
  const teamId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    (useLazyLoadQuery as jest.Mock).mockReturnValue({
      findMatchAttendance: [
        {
          id: "100",
          attendanceStatus: "ATTEND",
          memberType: "MEMBER",
          teamMember: { id: 1 },
        },
      ],
    });
  });

  it("초기 상태가 올바르게 설정되어야 한다", () => {
    const { result } = renderHook(() => usePlayerSearch({ matchId, teamId }));

    expect(result.current.inputValue).toBe("");
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.pendingChanges.size).toBe(0);
    expect(result.current.mercenaryPlayer).toBeNull();
  });

  it("입력값이 변경되면 inputValue와 debouncedKeyword가 동기화되어야 한다", () => {
    const { result } = renderHook(() => usePlayerSearch({ matchId, teamId }));

    act(() => {
      result.current.setInputValue("손흥민");
    });

    expect(result.current.inputValue).toBe("손흥민");
    // useDebounce가 즉시 실행되도록 모킹했으므로 debouncedKeyword도 즉각 반영됨
    expect(result.current.debouncedKeyword).toBe("손흥민");
  });

  it("handleToggleAttendance를 호출하면 pendingChanges에 상태가 추가/토글되어야 한다", () => {
    const { result } = renderHook(() => usePlayerSearch({ matchId, teamId }));

    const dummyPlayer: PendingPlayerItem = {
      id: 2,
      teamMemberId: 2,
      userId: 2,
      name: "테스트선수",
      memberType: "MEMBER",
      number: 10,
      overall: 80,
      position: "FW",
      currentStatus: null,
      originalStatus: null,
    };

    act(() => {
      // 첫 토글 (상태 없음 -> ATTEND)
      result.current.handleToggleAttendance(dummyPlayer);
    });

    expect(result.current.pendingChanges.has(2)).toBe(true);
    expect(result.current.pendingChanges.get(2)?.currentStatus).toBe("ATTEND");

    act(() => {
      // 두 번째 토글 (ATTEND -> ABSENT)
      // originalStatus가 null이므로 ABSENT로 가면 pendingChanges에서 삭제(Revert)됨
      result.current.handleToggleAttendance({
        ...dummyPlayer,
        currentStatus: "ATTEND",
      });
    });

    expect(result.current.pendingChanges.has(2)).toBe(false);
  });

  it("검색 결과가 없을 경우 (용병) 접미사가 붙은 용병 객체가 반환되어야 한다", () => {
    const { result } = renderHook(() => usePlayerSearch({ matchId, teamId }));

    act(() => {
      result.current.setInputValue("새로운선수");
    });

    expect(result.current.mercenaryPlayer).not.toBeNull();
    expect(result.current.mercenaryPlayer?.name).toBe("새로운선수 (용병)");
    expect(result.current.mercenaryPlayer?.memberType).toBe("MERCENARY");
  });
});
