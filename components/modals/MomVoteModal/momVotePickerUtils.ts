import type { findMatchAttendanceQuery } from "@/__generated__/findMatchAttendanceQuery.graphql";

export type MomVoteCandidateOption = { label: string; value: string };

/**
 * MOM 후보 목록: 해당 경기에서 참석(ATTEND)으로 확정된 팀원 + 그 경기 용병.
 * - 팀원 후보 value는 `userId` 문자열(createMatchMomVote.candidateUserId와 대응).
 * - 용병은 `m:{용병id}` 형태(createMatchMomVote.candidateMercenaryId와 대응).
 */
export function buildMomVoteCandidateOptions(
  rows: findMatchAttendanceQuery["response"]["findMatchAttendance"],
  mercenaries: findMatchAttendanceQuery["response"]["matchMercenaries"],
  expectedMatchId: number,
): MomVoteCandidateOption[] {
  const seen = new Set<string>();
  const out: MomVoteCandidateOption[] = [];

  for (const row of rows) {
    if (row.attendanceStatus !== "ATTEND") continue;
    if (row.matchId !== expectedMatchId) continue;
    const name = row.user?.name?.trim();
    if (!name) continue;
    const value = String(row.userId);
    if (seen.has(value)) continue;
    seen.add(value);
    out.push({ label: name, value });
  }

  for (const m of mercenaries) {
    if (m.matchId !== expectedMatchId) continue;
    const name = m.name?.trim();
    if (!name) continue;
    const value = `m:${m.id}`;
    if (seen.has(value)) continue;
    seen.add(value);
    out.push({ label: name, value });
  }

  return out;
}

/** 드롭다운 value → createMatchMomVote / updateMatchMomVote 입력 필드 */
export function parseMomVoteSelectionToCandidateInput(value: string): {
  candidateUserId?: number;
  candidateMercenaryId?: number;
} {
  const trimmed = value.trim();
  if (trimmed.startsWith("m:")) {
    const n = Number(trimmed.slice(2));
    if (!Number.isFinite(n)) return {};
    return { candidateMercenaryId: n };
  }
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return {};
  return { candidateUserId: n };
}

export function optionsExcludingOthers(
  all: { label: string; value: string }[],
  current: string | undefined,
  others: (string | undefined)[],
): { label: string; value: string }[] {
  const blocked = new Set(
    others.filter((v): v is string => v != null && v !== ""),
  );
  return all.filter((o) => o.value === current || !blocked.has(o.value));
}
