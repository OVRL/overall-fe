import {
  createOAuthState,
  postOAuthState,
} from "@/lib/social/oauthStateClient";

describe("oauthStateClient", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("createOAuthState", () => {
    it("crypto.randomUUID 가 있으면 UUID 형태 문자열", () => {
      const v = createOAuthState();
      expect(v).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe("postOAuthState", () => {
    it("res.ok 이면 예외 없음", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await expect(
        postOAuthState({ provider: "kakao", state: "s1" }),
      ).resolves.toBeUndefined();

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/auth/oauth/state",
        expect.objectContaining({
          method: "POST",
          credentials: "same-origin",
          body: JSON.stringify({ provider: "kakao", state: "s1" }),
        }),
      );
    });

    it("res.ok 가 아니면 Error", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: "bad" }),
      });

      await expect(postOAuthState({ provider: "naver", state: "x" })).rejects.toThrow(
        "bad",
      );
    });

    it("본문 파싱 실패 시 HTTP 상태로 메시지", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => {
          throw new Error("parse");
        },
      });

      await expect(postOAuthState({})).rejects.toThrow("HTTP 503");
    });
  });
});
