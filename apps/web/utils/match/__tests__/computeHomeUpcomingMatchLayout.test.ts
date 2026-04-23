import type { MatchForUpcomingDisplay } from "@/components/home/UpcomingMatch/upcomingMatchDisplay";
import { computeHomeUpcomingMatchLayout } from "../computeHomeUpcomingMatchLayout";
import {
  MOM_NEXT_MATCH_OVERLAP_GAP_MS,
  MOM_VOTE_WINDOW_MS,
} from "../computeHomeUpcomingMatchLayout";

function m(
  partial: Partial<MatchForUpcomingDisplay> & {
    matchDate: string;
    startTime: string;
    endTime: string;
    id: string;
  },
): MatchForUpcomingDisplay {
  return {
    matchType: "MATCH",
    quarterCount: 4,
    createdTeam: { name: "우리팀", emblem: "/a.png" },
    opponentTeam: { name: "상대", emblem: "/b.png" },
    voteDeadline: partial.voteDeadline ?? null,
    isFormationDraft: partial.isFormationDraft ?? null,
    ...partial,
  };
}

describe("computeHomeUpcomingMatchLayout", () => {
  it("빈 배열이면 empty", () => {
    expect(computeHomeUpcomingMatchLayout([], 0)).toEqual({ kind: "empty" });
  });

  it("종료된 경기만 있고 MOM 기간이 지났으면 copy_only", () => {
    const ended = m({
      id: "1",
      matchDate: "2025-03-01",
      startTime: "10:00:00",
      endTime: "12:00:00",
      voteDeadline: "2025-02-28T00:00:00.000Z",
    });
    const now = new Date(2025, 2, 10, 12, 0, 0, 0).getTime();
    expect(computeHomeUpcomingMatchLayout([ended], now)).toEqual({
      kind: "copy_only",
    });
  });

  it("아직 종료 전인 경기가 있으면 참석 투표가 우선(마감 전)", () => {
    const live = m({
      id: "2",
      matchDate: "2025-03-20",
      startTime: "10:00:00",
      endTime: "12:00:00",
      voteDeadline: "2025-03-25T00:00:00.000Z",
    });
    const now = new Date(2025, 2, 20, 11, 0, 0, 0).getTime();
    const r = computeHomeUpcomingMatchLayout([live], now);
    expect(r.kind).toBe("single");
    if (r.kind === "single") {
      expect(r.primary.kind).toBe("attendance");
      expect(r.sectionTitle).toBe("다가오는 경기");
    }
  });

  it("참석 마감 후 isFormationDraft이면 준비 중", () => {
    const live = m({
      id: "2",
      matchDate: "2025-03-20",
      startTime: "10:00:00",
      endTime: "23:00:00",
      voteDeadline: "2025-03-19T00:00:00.000Z",
      isFormationDraft: true,
    });
    const now = new Date(2025, 2, 20, 11, 0, 0, 0).getTime();
    const r = computeHomeUpcomingMatchLayout([live], now);
    expect(r.kind).toBe("single");
    if (r.kind === "single") {
      expect(r.primary.kind).toBe("formation_preparing");
    }
  });

  it("참석 마감 후 드래프트 아니면 포메이션 확인", () => {
    const live = m({
      id: "2",
      matchDate: "2025-03-20",
      startTime: "10:00:00",
      endTime: "23:00:00",
      voteDeadline: "2025-03-19T00:00:00.000Z",
      isFormationDraft: false,
    });
    const now = new Date(2025, 2, 20, 11, 0, 0, 0).getTime();
    const r = computeHomeUpcomingMatchLayout([live], now);
    expect(r.kind).toBe("single");
    if (r.kind === "single") {
      expect(r.primary.kind).toBe("formation_confirm");
      if (r.primary.kind === "formation_confirm") {
        expect(r.primary.matchId).toBe(2);
      }
    }
  });

  it("MOM 기간이고 다음 경기가 36h 이내면 split", () => {
    const prev = m({
      id: "p",
      matchDate: "2025-03-14",
      startTime: "20:00:00",
      endTime: "22:00:00",
      voteDeadline: "2025-03-13T00:00:00.000Z",
      isFormationDraft: false,
    });
    const next = m({
      id: "n",
      matchDate: "2025-03-15",
      startTime: "08:00:00",
      endTime: "10:00:00",
      voteDeadline: "2025-03-20T00:00:00.000Z",
    });
    const endPrev = new Date(2025, 2, 14, 22, 0, 0, 0).getTime();
    const now = endPrev + 60 * 60 * 1000;
    const gap =
      new Date(2025, 2, 15, 8, 0, 0, 0).getTime() -
      new Date(2025, 2, 14, 22, 0, 0, 0).getTime();
    expect(gap).toBeLessThan(MOM_NEXT_MATCH_OVERLAP_GAP_MS);
    expect(now - endPrev).toBeLessThan(MOM_VOTE_WINDOW_MS);

    const r = computeHomeUpcomingMatchLayout([prev, next], now);
    expect(r.kind).toBe("split");
    if (r.kind === "split") {
      expect(r.topMom.momHref).toContain("/team-management/mom");
      expect(r.bottom.primary.kind).toBe("attendance");
    }
  });
});
