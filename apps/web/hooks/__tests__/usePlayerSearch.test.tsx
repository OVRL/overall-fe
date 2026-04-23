import { renderHook, act, waitFor } from "@testing-library/react";
import { usePlayerSearch } from "../usePlayerSearch";
import type { PendingTeamMemberRow } from "@/types/formationRosterModal";
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
  useDebounce: (fn: (value: string) => void) => {
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
          teamMember: { id: 1 },
        },
      ],
      matchMercenaries: [],
    });
  });

  it("초기 상태가 올바르게 설정되어야 한다", () => {
    const { result } = renderHook(() => usePlayerSearch({ matchId, teamId }));

    expect(result.current.inputValue).toBe("");
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.pendingTeamMembers.size).toBe(0);
    expect(result.current.mercenaryDraft).toBeNull();
    expect(result.current.pendingMercenaryCreates.size).toBe(0);
    expect(result.current.pendingMercenaryDeletes.size).toBe(0);
  });

  it("입력값이 변경되면 inputValue와 debouncedKeyword가 동기화되어야 한다", async () => {
    const { result } = renderHook(() => usePlayerSearch({ matchId, teamId }));

    act(() => {
      result.current.setInputValue("손흥민");
    });

    expect(result.current.inputValue).toBe("손흥민");
    await waitFor(() => {
      expect(result.current.debouncedKeyword).toBe("손흥민");
    });
  });

  it("toggleTeamMemberAttendance를 호출하면 pendingTeamMembers에 상태가 추가/토글되어야 한다", () => {
    const { result } = renderHook(() => usePlayerSearch({ matchId, teamId }));

    const dummyPlayer: PendingTeamMemberRow = {
      id: 2,
      teamMemberId: 2,
      userId: 2,
      rosterKind: "TEAM_MEMBER",
      name: "테스트선수",
      number: 10,
      overall: 80,
      position: "FW",
      currentStatus: null,
      originalStatus: null,
    };

    act(() => {
      result.current.toggleTeamMemberAttendance(dummyPlayer);
    });

    expect(result.current.pendingTeamMembers.has(2)).toBe(true);
    expect(result.current.pendingTeamMembers.get(2)?.currentStatus).toBe(
      "ATTEND",
    );

    act(() => {
      result.current.toggleTeamMemberAttendance({
        ...dummyPlayer,
        currentStatus: "ATTEND",
      });
    });

    expect(result.current.pendingTeamMembers.has(2)).toBe(false);
  });

  it("검색 결과가 없을 경우 용병 초안(표시명 접미사)이 반환되어야 한다", async () => {
    const { result } = renderHook(() => usePlayerSearch({ matchId, teamId }));

    act(() => {
      result.current.setInputValue("새로운선수");
    });

    await waitFor(() => {
      expect(result.current.mercenaryDraft).not.toBeNull();
    });
    expect(result.current.mercenaryDraft?.displayName).toBe("새로운선수 (용병)");
    expect(result.current.mercenaryDraft?.registerName).toBe("새로운선수");
    expect(result.current.mercenaryDraft?.willRegister).toBe(false);
  });
});
