import { renderHook, waitFor } from "@testing-library/react";
import { useOAuthRedirectUri } from "@/hooks/useOAuthRedirectUri";

describe("useOAuthRedirectUri", () => {
  it("마운트 후 origin + 경로로 채워짐", async () => {
    const { result } = renderHook(() =>
      useOAuthRedirectUri("/social/kakao/callback"),
    );

    await waitFor(() => {
      expect(result.current).toBe(
        `${window.location.origin}/social/kakao/callback`,
      );
    });
  });

  it("선행 슬래시 없으면 보정", async () => {
    const { result } = renderHook(() =>
      useOAuthRedirectUri("social/naver/callback"),
    );

    await waitFor(() => {
      expect(result.current).toBe(
        `${window.location.origin}/social/naver/callback`,
      );
    });
  });
});
