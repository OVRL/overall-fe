import { renderHook, act } from "@testing-library/react";
import { useCreateInviteCodeMutation } from "../useCreateInviteCodeMutation";

const mockCommit = jest.fn();
jest.mock("react-relay", () => ({
  useMutation: () => [mockCommit, false],
  graphql: () => ({}),
}));

describe("useCreateInviteCodeMutation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("executeMutation과 isInFlight를 반환한다", () => {
    const { result } = renderHook(() => useCreateInviteCodeMutation());

    expect(typeof result.current.executeMutation).toBe("function");
    expect(result.current.isInFlight).toBe(false);
  });

  describe("executeMutation 호출 시", () => {
    it("commit에 variables.teamId와 onCompleted·onError 콜백이 전달된다", () => {
      const { result } = renderHook(() => useCreateInviteCodeMutation());
      const onCompleted = jest.fn();
      const onError = jest.fn();

      act(() => {
        result.current.executeMutation({
          variables: { teamId: 42 },
          onCompleted,
          onError,
        });
      });

      expect(mockCommit).toHaveBeenCalledTimes(1);
      expect(mockCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { teamId: 42 },
          onCompleted,
          onError,
        }),
      );
    });
  });
});
