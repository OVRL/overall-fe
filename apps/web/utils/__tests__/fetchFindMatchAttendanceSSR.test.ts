import { fetchFindMatchAttendanceSSR } from "@/utils/fetchFindMatchAttendanceSSR";
import { postBackendSSR } from "@/utils/ssrBackendFetch";

jest.mock("@/lib/env", () => ({
  env: {
    BACKEND_URL: "https://backend.example.com",
  },
}));

jest.mock("@/utils/ssrBackendFetch", () => ({
  postBackendSSR: jest.fn(),
}));

const mockedPost = postBackendSSR as jest.MockedFunction<typeof postBackendSSR>;

describe("fetchFindMatchAttendanceSSR", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GraphQL data가 있으면 findMatchAttendance 배열을 반환한다", async () => {
    const rows = [
      {
        attendanceStatus: "ATTEND" as const,
        teamMember: {
          id: 1,
          foot: null,
          preferredNumber: 9,
          preferredPosition: "ST",
          profileImg: null,
          overall: { ovr: 80 },
          user: null,
        },
      },
    ];
    mockedPost.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({ data: { findMatchAttendance: rows } }),
    });

    const result = await fetchFindMatchAttendanceSSR(10, 20, "token-abc");

    expect(result).toEqual(rows);
    expect(mockedPost).toHaveBeenCalledWith(
      "https://backend.example.com/graphql",
      {
        "Content-Type": "application/json",
        Authorization: "Bearer token-abc",
      },
      expect.stringContaining('"matchId":10'),
    );
    const body = mockedPost.mock.calls[0][2] as string;
    expect(body).toContain('"teamId":20');
  });

  it("HTTP 실패 시 빈 배열을 반환한다", async () => {
    mockedPost.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "ERR",
      json: async () => ({}),
    });

    await expect(
      fetchFindMatchAttendanceSSR(1, 1, "t"),
    ).resolves.toEqual([]);
  });

  it("GraphQL errors가 있으면 빈 배열을 반환한다", async () => {
    mockedPost.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({
        errors: [{ message: "fail" }],
        data: null,
      }),
    });

    await expect(
      fetchFindMatchAttendanceSSR(1, 1, "t"),
    ).resolves.toEqual([]);
  });

  it("postBackendSSR가 예외를 던지면 빈 배열을 반환한다", async () => {
    mockedPost.mockRejectedValue(new Error("network"));

    await expect(
      fetchFindMatchAttendanceSSR(1, 1, "t"),
    ).resolves.toEqual([]);
  });

  it("data가 없으면 빈 배열을 반환한다", async () => {
    mockedPost.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({ data: {} }),
    });

    await expect(
      fetchFindMatchAttendanceSSR(1, 1, "t"),
    ).resolves.toEqual([]);
  });
});
