const mockObservableToPromise = jest.fn();

jest.mock("@/lib/relay/queries/findInviteCodeByTeamQuery", () => ({
  FindInviteCodeByTeamQuery: {},
}));
jest.mock("@/lib/relay/environment", () => ({
  getClientEnvironment: jest.fn(() => ({})),
}));
jest.mock("relay-runtime", () => ({
  fetchQuery: jest.fn(() => ({ subscribe: jest.fn() })),
}));
jest.mock("@/lib/relay/observableToPromise", () => ({
  observableToPromise: (obs: unknown) => mockObservableToPromise(obs),
}));

import { fetchInviteCodeByTeam } from "@/lib/inviteCode/fetchInviteCodeByTeam";

describe("fetchInviteCodeByTeam", () => {
  const teamId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("조회 성공 시", () => {
    it("code·expiredAt가 있으면 스냅샷을 반환한다", async () => {
      mockObservableToPromise.mockResolvedValue({
        findInviteCodeByTeam: {
          code: "TEAM-OVR-2026-ABCD",
          expiredAt: "2026-12-31 23:59:59",
        },
      });

      const result = await fetchInviteCodeByTeam(teamId);

      expect(result).toEqual({
        code: "TEAM-OVR-2026-ABCD",
        expiredAt: "2026-12-31 23:59:59",
      });
    });

    it("expiredAt가 없으면 null", async () => {
      mockObservableToPromise.mockResolvedValue({
        findInviteCodeByTeam: { code: "X" },
      });

      const result = await fetchInviteCodeByTeam(teamId);

      expect(result).toBeNull();
    });

    it("code가 빈 문자열이면 null", async () => {
      mockObservableToPromise.mockResolvedValue({
        findInviteCodeByTeam: { code: "", expiredAt: "2026-12-31 23:59:59" },
      });

      const result = await fetchInviteCodeByTeam(teamId);

      expect(result).toBeNull();
    });
  });

  describe("조회 실패 또는 데이터 없음 시", () => {
    it("findInviteCodeByTeam가 null이면 null을 반환한다", async () => {
      mockObservableToPromise.mockResolvedValue({
        findInviteCodeByTeam: null,
      });

      const result = await fetchInviteCodeByTeam(teamId);

      expect(result).toBeNull();
    });

    it("observableToPromise가 예외를 던지면 null을 반환한다", async () => {
      mockObservableToPromise.mockRejectedValue(new Error("네트워크 오류"));

      const result = await fetchInviteCodeByTeam(teamId);

      expect(result).toBeNull();
    });

    it("data가 undefined여도 null을 반환한다", async () => {
      mockObservableToPromise.mockResolvedValue(undefined);

      const result = await fetchInviteCodeByTeam(teamId);

      expect(result).toBeNull();
    });
  });
});
