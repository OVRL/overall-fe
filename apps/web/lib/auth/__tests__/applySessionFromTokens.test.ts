import { applySessionFromTokens } from "@/lib/auth/applySessionFromTokens";

describe("applySessionFromTokens", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("성공 시 예외 없음", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });

    await expect(
      applySessionFromTokens({
        accessToken: "at",
        refreshToken: "rt",
        userId: 42,
      }),
    ).resolves.toBeUndefined();

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/auth/set-session",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          accessToken: "at",
          refreshToken: "rt",
          userId: 42,
        }),
      }),
    );
  });

  it("실패 시 응답 error 또는 HTTP 코드", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: "세션 실패" }),
    });

    await expect(
      applySessionFromTokens({ accessToken: "a", userId: 1 }),
    ).rejects.toThrow("세션 실패");
  });
});
