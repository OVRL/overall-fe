import { SELECTED_TEAM_ID_COOKIE_KEY } from "@/lib/cookie/selectedTeamId";
import { fetchFindMatchSSR } from "@/utils/fetchFindMatchSSR";
import { fetchFindTeamMemberSSR } from "@/utils/fetchFindTeamMemberSSR";
import { verifyFormationMatchAccessSSR } from "@/utils/verifyFormationMatchAccessSSR";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("@/utils/fetchFindTeamMemberSSR", () => ({
  fetchFindTeamMemberSSR: jest.fn(),
}));

jest.mock("@/utils/fetchFindMatchSSR", () => ({
  fetchFindMatchSSR: jest.fn(),
}));

const cookies = jest.requireMock("next/headers")
  .cookies as jest.MockedFunction<() => Promise<{ get: (k: string) => { value: string } | undefined }>>;

const mockedMembers = fetchFindTeamMemberSSR as jest.MockedFunction<
  typeof fetchFindTeamMemberSSR
>;
const mockedMatches = fetchFindMatchSSR as jest.MockedFunction<
  typeof fetchFindMatchSSR
>;

function mockCookieStore(map: Record<string, string | undefined>) {
  cookies.mockResolvedValue({
    get: (key: string) => {
      const v = map[key];
      return v !== undefined ? { value: v } : undefined;
    },
  });
}

describe("verifyFormationMatchAccessSSR", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("빈 문자열이면 ok: false", async () => {
    await expect(verifyFormationMatchAccessSSR("   ")).resolves.toEqual({
      ok: false,
    });
    expect(mockedMembers).not.toHaveBeenCalled();
  });

  it("accessToken 또는 userId 쿠키가 없으면 ok: false", async () => {
    mockCookieStore({ accessToken: "t" });
    await expect(verifyFormationMatchAccessSSR("1")).resolves.toEqual({
      ok: false,
    });

    mockCookieStore({ userId: "1" });
    await expect(verifyFormationMatchAccessSSR("1")).resolves.toEqual({
      ok: false,
    });
  });

  it("userId가 숫자가 아니면 ok: false", async () => {
    mockCookieStore({
      accessToken: "t",
      userId: "abc",
    });
    await expect(verifyFormationMatchAccessSSR("1")).resolves.toEqual({
      ok: false,
    });
  });

  it("팀을 특정할 수 없으면 ok: false", async () => {
    mockCookieStore({
      accessToken: "t",
      userId: "42",
      [SELECTED_TEAM_ID_COOKIE_KEY]: "TeamModel:9",
    });
    mockedMembers.mockResolvedValue([
      {
        id: 1,
        teamId: 1,
        team: null,
      },
    ]);

    await expect(verifyFormationMatchAccessSSR("MatchModel:5")).resolves.toEqual({
      ok: false,
    });
  });

  it("findMatch 목록에 경기가 없으면 ok: false", async () => {
    mockCookieStore({
      accessToken: "t",
      userId: "42",
    });
    mockedMembers.mockResolvedValue([
      {
        id: 12,
        teamId: 7,
        team: { id: 7, name: "T", emblem: null },
      },
    ]);
    mockedMatches.mockResolvedValue([
      {
        id: 1,
        matchDate: "2025-01-01",
        startTime: "10:00",
        endTime: "12:00",
        matchType: "MATCH",
        quarterCount: 2,
        quarterDuration: 45,
        createdTeam: null,
        opponentTeam: null,
        venue: { address: "", latitude: 0, longitude: 0 },
      },
    ]);

    await expect(verifyFormationMatchAccessSSR("99")).resolves.toEqual({
      ok: false,
    });
  });

  it("성공 시 match, createdTeamId, accessToken을 반환한다 (Relay id 매칭)", async () => {
    mockCookieStore({
      accessToken: "t",
      userId: "42",
    });
    mockedMembers.mockResolvedValue([
      {
        id: 11,
        teamId: 7,
        team: { id: 7, name: "T", emblem: null },
      },
    ]);

    const match = {
      id: 15,
      matchDate: "2025-03-01",
      startTime: "10:00",
      endTime: "12:00",
      matchType: "MATCH" as const,
      quarterCount: 4,
      quarterDuration: 45,
      createdTeam: { id: 7, name: "T", emblem: null },
      opponentTeam: null,
      venue: { address: "서울", latitude: 37, longitude: 127 },
    };
    mockedMatches.mockResolvedValue([match]);

    const result = await verifyFormationMatchAccessSSR("15");

    expect(result).toEqual({
      ok: true,
      match,
      createdTeamId: 7,
      accessToken: "t",
    });
  });
});
