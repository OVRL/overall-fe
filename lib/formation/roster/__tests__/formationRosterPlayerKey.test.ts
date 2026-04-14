import type { Player } from "@/types/formation";
import {
  getFormationRosterPlayerKey,
  isSameFormationRosterPlayer,
} from "../formationRosterPlayerKey";

describe("getFormationRosterPlayerKey", () => {
  it("TEAM_MEMBER이면 t:{id} 형태다", () => {
    const p = {
      id: 42,
      rosterKind: "TEAM_MEMBER" as const,
    } as Player;
    expect(getFormationRosterPlayerKey(p)).toBe("t:42");
  });

  it("rosterKind가 없으면 팀원으로 간주해 t:{id}다", () => {
    const p = { id: 7 } as Player;
    expect(getFormationRosterPlayerKey(p)).toBe("t:7");
  });

  it("MERCENARY이고 mercenaryId가 있으면 m:{mercenaryId}다", () => {
    const p = {
      id: 1,
      rosterKind: "MERCENARY" as const,
      mercenaryId: 99,
    } as Player;
    expect(getFormationRosterPlayerKey(p)).toBe("m:99");
  });

  it("MERCENARY인데 mercenaryId가 없으면 id로 폴백해 m:{id}다", () => {
    const p = {
      id: 5,
      rosterKind: "MERCENARY" as const,
    } as Player;
    expect(getFormationRosterPlayerKey(p)).toBe("m:5");
  });
});

describe("isSameFormationRosterPlayer", () => {
  it("동일 키면 true다", () => {
    const a = { id: 10, rosterKind: "TEAM_MEMBER" as const } as Player;
    const b = { id: 10, rosterKind: "TEAM_MEMBER" as const } as Player;
    expect(isSameFormationRosterPlayer(a, b)).toBe(true);
  });

  it("팀원 id 5와 용병 id 5는 서로 다른 키라 false다", () => {
    const teamMember = {
      id: 5,
      rosterKind: "TEAM_MEMBER" as const,
    } as Player;
    const mercenary = {
      id: 5,
      rosterKind: "MERCENARY" as const,
    } as Player;
    expect(isSameFormationRosterPlayer(teamMember, mercenary)).toBe(false);
  });
});
