import type { findTeamByInviteCodeQuery$data } from "@/__generated__/findTeamByInviteCodeQuery.graphql";
import {
  findPendingJoinRequestIdForTeam,
  formatFoundedLabel,
} from "../teamInfoModalUtils";

type JoinRequestList = findTeamByInviteCodeQuery$data["findMyJoinRequest"];

describe("findPendingJoinRequestIdForTeam", () => {
  it("빈 배열이면 null", () => {
    expect(findPendingJoinRequestIdForTeam([] as JoinRequestList, 1)).toBeNull();
  });

  it("해당 teamId에 PENDING이 있으면 그 id", () => {
    const rows = [
      { id: 10, status: "APPROVED" as const, teamId: 2 },
      { id: 20, status: "PENDING" as const, teamId: 1 },
    ] as JoinRequestList;
    expect(findPendingJoinRequestIdForTeam(rows, 1)).toBe(20);
  });

  it("같은 팀이어도 PENDING이 아니면 null", () => {
    const rows = [
      { id: 5, status: "REJECTED" as const, teamId: 1 },
    ] as JoinRequestList;
    expect(findPendingJoinRequestIdForTeam(rows, 1)).toBeNull();
  });

  it("teamId가 다르면 null", () => {
    const rows = [
      { id: 7, status: "PENDING" as const, teamId: 99 },
    ] as JoinRequestList;
    expect(findPendingJoinRequestIdForTeam(rows, 1)).toBeNull();
  });

  it("여러 건 중 첫 번째 매칭 PENDING id를 반환", () => {
    const rows = [
      { id: 1, status: "PENDING" as const, teamId: 1 },
      { id: 2, status: "PENDING" as const, teamId: 1 },
    ] as JoinRequestList;
    expect(findPendingJoinRequestIdForTeam(rows, 1)).toBe(1);
  });
});

describe("formatFoundedLabel", () => {
  it("null/undefined면 —", () => {
    expect(formatFoundedLabel(null)).toBe("—");
    expect(formatFoundedLabel(undefined)).toBe("—");
  });

  it("Invalid Date면 —", () => {
    expect(formatFoundedLabel("not-a-date")).toBe("—");
  });

  it("유효한 ISO 문자열이면 ko-KR 날짜 문자열", () => {
    const s = formatFoundedLabel("2026-02-10T00:00:00.000Z");
    expect(s).not.toBe("—");
    expect(s).toMatch(/2026/);
  });

  it("Date 인스턴스도 처리", () => {
    const s = formatFoundedLabel(new Date("2026-03-15"));
    expect(s).not.toBe("—");
  });
});
