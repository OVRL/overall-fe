import type { Player } from "@/types/formation";

/** 라인업 후보: 참석 확정 팀원 뒤에 경기 용병을 둡니다. */
export function mergeAttendingMembersAndMercenaries(
  attendingTeamMembers: readonly Player[],
  mercenaries: readonly Player[],
): Player[] {
  return [...attendingTeamMembers, ...mercenaries];
}
