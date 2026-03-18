import { renderHook, act, waitFor } from "@testing-library/react";
import { useTeamInviteCode } from "../useTeamInviteCode";

const mockExecuteMutation = jest.fn();
const mockToastError = jest.fn();
const mockToastSuccess = jest.fn();

jest.mock("../useCreateInviteCodeMutation", () => ({
  useCreateInviteCodeMutation: () => ({
    executeMutation: mockExecuteMutation,
    isInFlight: false,
  }),
}));

jest.mock("../fetchInviteCodeByTeam", () => ({
  fetchInviteCodeByTeam: jest.fn(() => Promise.resolve(null)),
}));

jest.mock("../isAlreadyExistsInviteCodeError", () => ({
  isAlreadyExistsInviteCodeError: jest.fn(() => false),
}));

jest.mock("@/lib/toast", () => ({
  toast: {
    error: (...args: unknown[]) => mockToastError(...args),
    success: (...args: unknown[]) => mockToastSuccess(...args),
  },
}));

describe("useTeamInviteCode", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("초기값으로 inviteCode null, firstLoadFailed false, isInFlight false를 반환한다", () => {
    const { result } = renderHook(() => useTeamInviteCode(1));

    expect(result.current.inviteCode).toBeNull();
    expect(result.current.firstLoadFailed).toBe(false);
    expect(result.current.isInFlight).toBe(false);
    expect(typeof result.current.requestInviteCode).toBe("function");
    expect(typeof result.current.copyCode).toBe("function");
  });

  describe("teamId가 null인 경우", () => {
    it("마운트 후 firstLoadFailed가 true가 된다", async () => {
      const { result } = renderHook(() => useTeamInviteCode(null));

      await act(async () => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(result.current.firstLoadFailed).toBe(true);
      });
    });

    it("requestInviteCode 호출 시 팀 정보 토스트를 띄운다", () => {
      const { result } = renderHook(() => useTeamInviteCode(null));

      act(() => {
        result.current.requestInviteCode();
      });

      expect(mockToastError).toHaveBeenCalledWith("팀 정보를 불러올 수 없습니다.");
      expect(mockExecuteMutation).not.toHaveBeenCalled();
    });
  });

  describe("requestInviteCode 호출 시 (teamId 존재)", () => {
    it("executeMutation이 variables.teamId로 호출된다", () => {
      const { result } = renderHook(() => useTeamInviteCode(10));

      act(() => {
        result.current.requestInviteCode();
      });

      expect(mockExecuteMutation).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { teamId: 10 },
        }),
      );
    });

    it("mutation 실패 시 초대 코드 생성 실패 토스트를 띄운다", () => {
      let capturedOnError: () => void = () => {};
      mockExecuteMutation.mockImplementation((config: { onError?: (err: unknown) => void }) => {
        capturedOnError = config.onError ?? (() => {});
      });

      const { result } = renderHook(() => useTeamInviteCode(10));

      act(() => {
        result.current.requestInviteCode();
      });

      act(() => {
        capturedOnError();
      });

      expect(mockToastError).toHaveBeenCalledWith("초대 코드 생성에 실패했습니다.");
    });
  });

  describe("copyCode 호출 시", () => {
    it("inviteCode가 null이면 아무 동작도 하지 않는다", async () => {
      const writeText = jest.fn();
      Object.assign(navigator, { clipboard: { writeText } });

      const { result } = renderHook(() => useTeamInviteCode(1));

      act(() => {
        result.current.copyCode();
      });

      expect(writeText).not.toHaveBeenCalled();
      expect(mockToastSuccess).not.toHaveBeenCalled();
    });

    it("inviteCode가 있으면 클립보드에 복사 후 성공 토스트를 띄운다", async () => {
      const writeText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, { clipboard: { writeText } });

      mockExecuteMutation.mockImplementation((config: { onCompleted?: (data: { createInviteCode?: { code?: string } }) => void }) => {
        if (config.onCompleted) {
          config.onCompleted({ createInviteCode: { code: "ABC-123" } });
        }
      });

      const { result } = renderHook(() => useTeamInviteCode(1));

      await waitFor(() => {
        expect(result.current.inviteCode).toBe("ABC-123");
      });

      await act(async () => {
        result.current.copyCode();
      });

      expect(writeText).toHaveBeenCalledWith("ABC-123");
      expect(mockToastSuccess).toHaveBeenCalledWith("코드가 복사되었습니다.");
    });
  });
});
