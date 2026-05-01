import { renderHook, act, waitFor } from "@testing-library/react";
import { toast } from "@/lib/toast";
import {
  SOCIAL_OAUTH_CONNECTING_LABEL,
  useSocialOAuthStart,
} from "@/hooks/useSocialOAuthStart";

describe("useSocialOAuthStart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("SOCIAL_OAUTH_CONNECTING_LABEL 고정 문구", () => {
    expect(SOCIAL_OAUTH_CONNECTING_LABEL).toBe("연결 중…");
  });

  it("run 성공 시 pending 은 true 로 유지(다음 화면 이동 전제)", async () => {
    const { result } = renderHook(() =>
      useSocialOAuthStart({ errorTitle: "테스트 오류" }),
    );

    await act(async () => {
      await result.current.run(async () => {
        /* noop */
      });
    });

    expect(result.current.pending).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("run 실패 시 pending 해제 및 toast.error", async () => {
    const { result } = renderHook(() =>
      useSocialOAuthStart({ errorTitle: "시작 실패" }),
    );

    await act(async () => {
      await result.current.run(async () => {
        throw new Error("네트워크");
      });
    });

    await waitFor(() => {
      expect(result.current.pending).toBe(false);
    });

    expect(toast.error).toHaveBeenCalledWith("시작 실패", {
      description: "네트워크",
    });
  });
});
