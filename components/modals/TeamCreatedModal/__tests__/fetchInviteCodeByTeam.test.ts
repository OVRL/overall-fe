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

import { fetchInviteCodeByTeam } from "../fetchInviteCodeByTeam";

describe("fetchInviteCodeByTeam", () => {
  const teamId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("조회 성공 시", () => {
    it("findInviteCodeByTeam.code가 있으면 해당 코드 문자열을 반환한다", async () => {
      mockObservableToPromise.mockResolvedValue({
        findInviteCodeByTeam: { code: "TEAM-OVR-2026-ABCD" },
      });

      const result = await fetchInviteCodeByTeam(teamId);

      expect(result).toBe("TEAM-OVR-2026-ABCD");
    });

    it("code가 빈 문자열이면 빈 문자열을 반환한다", async () => {
      mockObservableToPromise.mockResolvedValue({
        findInviteCodeByTeam: { code: "" },
      });

      const result = await fetchInviteCodeByTeam(teamId);

      expect(result).toBe("");
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
