import type { Player } from "@/types/formation";
import { validateInHouseListToBoardDnD } from "../validateInHouseListToBoardDnD";

const p = (id: number): Player =>
  ({
    id,
    name: `p${id}`,
    position: "ST",
    number: id,
    overall: 70,
  }) as Player;

describe("validateInHouseListToBoardDnD", () => {
  const getDraft = (player: Player) =>
    player.id === 1 ? ("A" as const) : player.id === 2 ? ("B" as const) : null;

  it("BoardPlayer 소스면 항상 허용한다", () => {
    expect(
      validateInHouseListToBoardDnD("INTERNAL", "A", "BoardPlayer", p(99), getDraft),
    ).toEqual({ allowed: true });
  });

  it("MATCH 타입이면 명단 드롭은 허용한다", () => {
    expect(
      validateInHouseListToBoardDnD("MATCH", "A", "Player", p(2), getDraft),
    ).toEqual({ allowed: true });
  });

  it("draft 모드면 검증을 적용하지 않는다", () => {
    expect(
      validateInHouseListToBoardDnD("INTERNAL", "draft", "Player", p(2), getDraft),
    ).toEqual({ allowed: true });
  });

  it("소속이 현재 탭과 같으면 허용한다", () => {
    expect(
      validateInHouseListToBoardDnD("INTERNAL", "A", "Player", p(1), getDraft),
    ).toEqual({ allowed: true });
  });

  it("미배정이면 거부한다", () => {
    const r = validateInHouseListToBoardDnD(
      "INTERNAL",
      "A",
      "Player",
      p(3),
      getDraft,
    );
    expect(r.allowed).toBe(false);
    if (!r.allowed) expect(r.message).toContain("소속");
  });

  it("반대 팀이면 거부한다", () => {
    const r = validateInHouseListToBoardDnD(
      "INTERNAL",
      "A",
      "Player",
      p(2),
      getDraft,
    );
    expect(r.allowed).toBe(false);
    if (!r.allowed) expect(r.message).toContain("맞지 않");
  });
});
