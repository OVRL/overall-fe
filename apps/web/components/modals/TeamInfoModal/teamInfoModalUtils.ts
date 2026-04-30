/**
 * 팀 정보 모달 표시용 순수 함수 (Relay/UI와 분리해 테스트 가능)
 */

import type { findTeamByInviteCodeQuery$data } from "@/__generated__/findTeamByInviteCodeQuery.graphql";

/** findMyJoinRequest 한 행 (쿼리 응답과 동일) */
export type JoinRequestRowForPending =
  findTeamByInviteCodeQuery$data["findMyJoinRequest"][number];

/** Relay useLazyLoadQuery 추론 타입과의 호환을 위해 status는 string으로 둠 */
type JoinRequestListInput = ReadonlyArray<{
  readonly id: number;
  readonly status: string;
  readonly teamId: number;
}>;

/** 현재 조회 중인 팀에 대해 내가 PENDING인 가입 신청 id (없으면 null) */
export function findPendingJoinRequestIdForTeam(
  joinRequests: JoinRequestListInput,
  teamId: number,
): number | null {
  const row = joinRequests.find(
    (r) => r.teamId === teamId && r.status === "PENDING",
  );
  return row?.id ?? null;
}

export type JoinRequestListWithReason = ReadonlyArray<{
  readonly id: number;
  readonly status: string;
  readonly teamId: number;
  readonly rejectedReason?: string | null | undefined;
}>;

/** 현재 조회 중인 팀에 대해 내가 REJECTED된 가입 신청의 거절 사유 (없으면 null) */
export function findRejectedReasonForTeam(
  joinRequests: JoinRequestListWithReason,
  teamId: number,
): string | null {
  const row = joinRequests.find(
    (r) => r.teamId === teamId && r.status === "REJECTED",
  );
  return row?.rejectedReason ?? null;
}

/** 서버/GraphQL에서 온 창단일을 모달 표기용 문자열로 변환 */
export function formatFoundedLabel(raw: unknown): string {
  if (raw == null) return "—";
  const d = raw instanceof Date ? raw : new Date(raw as string | number);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}
