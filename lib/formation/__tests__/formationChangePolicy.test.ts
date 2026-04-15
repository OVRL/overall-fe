import {
  applyFormationChangeDecision,
  getCurrentFormationForScope,
  hasOccupiedSlots,
  needsFormationChangeConfirm,
} from "../formationChangePolicy";
import type { Player, QuarterData } from "@/types/formation";

const p: Player = {
  id: 1,
  name: "테스트",
  position: "CM",
  number: 8,
  overall: 80,
};

describe("formationChangePolicy", () => {
  describe("hasOccupiedSlots", () => {
    it("빈 객체·undefined면 false", () => {
      expect(hasOccupiedSlots(undefined)).toBe(false);
      expect(hasOccupiedSlots({})).toBe(false);
    });
    it("선수가 하나라도 있으면 true", () => {
      expect(hasOccupiedSlots({ 1: p })).toBe(true);
    });
  });

  describe("getCurrentFormationForScope", () => {
    it("MATCHING은 formation만 본다", () => {
      const q: QuarterData = {
        id: 1,
        type: "MATCHING",
        formation: "4-4-2",
        matchup: { home: "A", away: "B" },
        lineup: {},
      };
      expect(getCurrentFormationForScope(q, { kind: "MATCHING" })).toBe(
        "4-4-2",
      );
    });
    it("IN_HOUSE는 팀별 필드를 본다", () => {
      const q: QuarterData = {
        id: 1,
        type: "IN_HOUSE",
        formation: "4-3-3",
        formationTeamA: "4-3-3",
        formationTeamB: "3-5-2",
        matchup: { home: "A", away: "B" },
        lineup: {},
      };
      expect(getCurrentFormationForScope(q, { kind: "IN_HOUSE", team: "B" })).toBe(
        "3-5-2",
      );
    });
  });

  describe("needsFormationChangeConfirm", () => {
    it("해당 범위 슬롯이 비어 있으면 false", () => {
      const q: QuarterData = {
        id: 1,
        type: "MATCHING",
        formation: "4-3-3",
        matchup: { home: "A", away: "B" },
        lineup: {},
      };
      expect(needsFormationChangeConfirm(q, { kind: "MATCHING" })).toBe(false);
    });
    it("IN_HOUSE A에 선수가 있으면 true", () => {
      const q: QuarterData = {
        id: 1,
        type: "IN_HOUSE",
        formation: "4-3-3",
        matchup: { home: "A", away: "B" },
        teamA: { 1: p },
        lineup: {},
      };
      expect(
        needsFormationChangeConfirm(q, { kind: "IN_HOUSE", team: "A" }),
      ).toBe(true);
    });
  });

  describe("applyFormationChangeDecision", () => {
    it("MATCHING + keep는 formation만", () => {
      const q: QuarterData = {
        id: 1,
        type: "MATCHING",
        formation: "4-3-3",
        matchup: { home: "A", away: "B" },
        lineup: { 1: p },
      };
      const out = applyFormationChangeDecision(q, "4-4-2", "keep", {
        kind: "MATCHING",
      });
      expect(out.formation).toBe("4-4-2");
      expect(out.lineup?.[1]).toEqual(p);
    });
    it("MATCHING + clear는 lineup 비움", () => {
      const q: QuarterData = {
        id: 1,
        type: "MATCHING",
        formation: "4-3-3",
        matchup: { home: "A", away: "B" },
        lineup: { 1: p },
      };
      const out = applyFormationChangeDecision(q, "4-4-2", "clear", {
        kind: "MATCHING",
      });
      expect(out.formation).toBe("4-4-2");
      expect(out.lineup).toEqual({});
    });
    it("IN_HOUSE B + clear는 teamB·lineup 비움", () => {
      const q: QuarterData = {
        id: 1,
        type: "IN_HOUSE",
        formation: "4-3-3",
        formationTeamB: "4-3-3",
        matchup: { home: "A", away: "B" },
        teamB: { 2: p },
        lineup: { 2: p },
      };
      const out = applyFormationChangeDecision(q, "3-5-2", "clear", {
        kind: "IN_HOUSE",
        team: "B",
      });
      expect(out.formationTeamB).toBe("3-5-2");
      expect(out.formation).toBe("3-5-2");
      expect(out.teamB).toEqual({});
      expect(out.lineup).toEqual({});
    });
  });
});
