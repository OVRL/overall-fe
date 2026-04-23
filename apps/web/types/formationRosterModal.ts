import type { Player } from "@/types/formation";

export type RosterModalAttendanceStatus = "ATTEND" | "ABSENT";

/** 팀원 검색 행 — 참석 토글 대상 */
export type PendingTeamMemberRow = Player & {
  teamMemberId: number;
  userId: number;
  originalStatus?: RosterModalAttendanceStatus | null;
  currentStatus: RosterModalAttendanceStatus | null;
};

/** 검색어와 일치하는 팀원이 없을 때 표시하는 용병 등록 후보 */
export type MercenaryDraftRow = {
  readonly kind: "MERCENARY_DRAFT";
  /** `createMatchMercenary`에 넘길 이름(접미사 없음) */
  readonly registerName: string;
  /** 목록 표시용 */
  readonly displayName: string;
  readonly willRegister: boolean;
};

/** 서버에 이미 있는 경기 용병 */
export type MercenaryExistingRow = {
  readonly kind: "MERCENARY_EXISTING";
  readonly mercenaryId: number;
  readonly name: string;
  /** true면 완료 시 `deleteMatchMercenary` 호출 */
  readonly pendingRemove: boolean;
};
