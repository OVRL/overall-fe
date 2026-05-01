import { safeFetchJson } from "@/lib/social/safeFetchJson";

describe("safeFetchJson", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("성공 시 ok·data 반환", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '{"a":1}',
    });

    const r = await safeFetchJson("https://example.com/x");

    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toEqual({ a: 1 });
  });

  it("HTTP 오류 시 kind http", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => '{"error":"nope"}',
    });

    const r = await safeFetchJson("https://example.com/x");

    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.kind).toBe("http");
      if (r.error.kind === "http") {
        expect(r.error.status).toBe(401);
        expect(r.error.body).toEqual({ error: "nope" });
      }
    }
  });

  it("fetch 예외 시 kind network", async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError("fetch failed"));

    const r = await safeFetchJson("https://example.com/x");

    expect(r.ok).toBe(false);
    if (!r.ok && r.error.kind === "network") {
      expect(r.error.message).toContain("fetch failed");
    }
  });

  it("cause가 있으면 network 오류에 포함", async () => {
    const inner = new Error("ECONNREFUSED");
    const outer = new Error("fetch failed");
    (outer as Error & { cause?: unknown }).cause = inner;

    global.fetch = jest.fn().mockRejectedValue(outer);

    const r = await safeFetchJson("https://example.com/x");

    expect(r.ok).toBe(false);
    if (!r.ok && r.error.kind === "network") {
      expect(r.error.cause).toBeDefined();
    }
  });
});
