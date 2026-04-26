import type { AttendanceStatus } from "@/__generated__/momVoteModalQuery.graphql";

export type MomVoteCandidateOption = { label: string; value: string };

/**
 * `buildMomVoteCandidateOptions`가 읽는 필드만 정의합니다.
 * `findMatchAttendance`를 여러 쿼리에서 다르게 선택해도(예: `match` 중첩 없음) 호환됩니다.
 */
export type MomVoteAttendanceRow = {
  readonly attendanceStatus: AttendanceStatus;
  readonly matchId: number;
  readonly userId: number;
  readonly user: {
    readonly name: string | null | undefined;
  } | null | undefined;
};

/**
 * MOM 후보 목록: 해당 경기에서 참석(ATTEND)으로 확정된 팀원만 (용병은 드롭다운에 포함하지 않음).
 * - 후보 value는 `userId` 문자열(createMatchMom의 candidateUserId와 대응).
 * - 표시 이름(`label`) 기준 오름차순 정렬(한국어 로케일).
 */
export type BuildMomVoteCandidateOptionsParams = {
  /** 투표 후보에서 제외할 로그인 유저(본인은 자기 자신에게 투표 불가) */
  excludeUserId?: number | null;
};

export function buildMomVoteCandidateOptions(
  rows: readonly MomVoteAttendanceRow[],
  expectedMatchId: number,
  params?: BuildMomVoteCandidateOptionsParams,
): MomVoteCandidateOption[] {
  const seen = new Set<string>();
  const out: MomVoteCandidateOption[] = [];
  const excludeUserId = params?.excludeUserId;

  for (const row of rows) {
    if (row.attendanceStatus !== "ATTEND") continue;
    if (row.matchId !== expectedMatchId) continue;
    if (excludeUserId != null && row.userId === excludeUserId) continue;
    const name = row.user?.name?.trim();
    if (!name) continue;
    const value = String(row.userId);
    if (seen.has(value)) continue;
    seen.add(value);
    out.push({ label: name, value });
  }

  out.sort((a, b) => a.label.localeCompare(b.label, "ko"));
  return out;
}

/** 드롭다운 value → 단일 후보 파싱 (표시·서버 단일 행 대응용) */
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

/**
 * TOP1~3 선택값 → API `candidateUserIds` (팀원 userId만; `m:` 용병 값은 후보에 없으므로 무시).
 */
export function picksToCandidateUserIds(
  top1: string | undefined,
  top2: string | undefined,
  top3: string | undefined,
): number[] {
  const candidateUserIds: number[] = [];
  for (const top of [top1, top2, top3]) {
    if (top == null || top === "") continue;
    const parsed = parseMomVoteSelectionToCandidateInput(top);
    if (parsed.candidateUserId != null) {
      candidateUserIds.push(parsed.candidateUserId);
    }
  }
  return candidateUserIds;
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

/** 드롭다운 옵션 목록에 현재 선택값이 없을 때(예: 레거시 데이터) 표시용으로 항목을 한 줄 보강 */
export function withOptionForValue(
  options: MomVoteCandidateOption[],
  value: string | undefined,
  labelFallback: string,
): MomVoteCandidateOption[] {
  if (value == null || value === "") return options;
  if (options.some((o) => o.value === value)) return options;
  return [...options, { label: labelFallback, value }];
}
