import type { Player } from "@/types/formation";
import { buildSubTeamDraftLineupOrderedPlayers } from "../buildSubTeamDraftLineup";

describe("buildSubTeamDraftLineupOrderedPlayers", () => {
  const team = (partial: Partial<Player> & Pick<Player, "id" | "name">): Player =>
    ({
      position: "ST",
      number: partial.id,
      overall: 70,
      rosterKind: "TEAM_MEMBER",
      ...partial,
    }) as Player;

  it("해당 subTeam에 배정된 선수만 포함한다", () => {
    const aOnly = team({ id: 1, name: "A", position: "ST" });
    const bOnly = team({ id: 2, name: "B", position: "ST" });
    const draft = { "t:1": "A" as const, "t:2": "B" as const };
    expect(
      buildSubTeamDraftLineupOrderedPlayers([aOnly, bOnly], draft, "A"),
    ).toEqual([aOnly]);
    expect(
      buildSubTeamDraftLineupOrderedPlayers([aOnly, bOnly], draft, "B"),
    ).toEqual([bOnly]);
  });

  it("FW → MF → DF → GK 순으로 정렬한다", () => {
    const fw = team({ id: 1, name: "FW", position: "ST" });
    const mf = team({ id: 2, name: "MF", position: "CM" });
    const df = team({ id: 3, name: "DF", position: "CB" });
    const gk = team({ id: 4, name: "GK", position: "GK" });
    const players = [gk, df, mf, fw];
    const draft = {
      "t:1": "A" as const,
      "t:2": "A" as const,
      "t:3": "A" as const,
      "t:4": "A" as const,
    };
    expect(buildSubTeamDraftLineupOrderedPlayers(players, draft, "A")).toEqual([
      fw,
      mf,
      df,
      gk,
    ]);
  });

  it("같은 메인 포지션 그룹 안에서는 원래 명단 순서를 유지한다", () => {
    const fwFirst = team({ id: 1, name: "FW1", position: "ST" });
    const fwSecond = team({ id: 2, name: "FW2", position: "CF" });
    const players = [fwFirst, fwSecond];
    const draft = { "t:1": "A" as const, "t:2": "A" as const };
    expect(buildSubTeamDraftLineupOrderedPlayers(players, draft, "A")).toEqual([
      fwFirst,
      fwSecond,
    ]);
  });

  it("getMainPositionFromRole이 전체인 역할은 제외한다", () => {
    const valid = team({ id: 1, name: "OK", position: "ST" });
    const unknownRole = team({
      id: 2,
      name: "전체포지션",
      position: "UNKNOWN_ROLE_FOR_TEST",
    });
    const draft = { "t:1": "A" as const, "t:2": "A" as const };
    expect(
      buildSubTeamDraftLineupOrderedPlayers([valid, unknownRole], draft, "A"),
    ).toEqual([valid]);
  });

  it("용병 포지션 문자열은 MF로 묶이고 MF 그룹에 포함된다", () => {
    const fw = team({ id: 1, name: "FW", position: "ST" });
    const merc = {
      id: 100,
      name: "용병",
      position: "용병",
      number: 100,
      overall: 70,
      rosterKind: "MERCENARY" as const,
      mercenaryId: 200,
    } as Player;
    const mfAfter = team({ id: 3, name: "CM", position: "CM" });
    const players = [fw, merc, mfAfter];
    const draft = {
      "t:1": "A" as const,
      "m:200": "A" as const,
      "t:3": "A" as const,
    };
    expect(buildSubTeamDraftLineupOrderedPlayers(players, draft, "A")).toEqual([
      fw,
      merc,
      mfAfter,
    ]);
  });
});
