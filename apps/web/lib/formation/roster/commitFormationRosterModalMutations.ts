import { commitMutation } from "react-relay";
import type { Environment } from "relay-runtime";
import { CreateMatchAttendanceMutation } from "@/lib/relay/mutations/createMatchAttendanceMutation";
import { UpdateMatchAttendanceMutation } from "@/lib/relay/mutations/updateMatchAttendanceMutation";
import { CreateMatchMercenaryMutation } from "@/lib/relay/mutations/createMatchMercenaryMutation";
import { DeleteMatchMercenaryMutation } from "@/lib/relay/mutations/deleteMatchMercenaryMutation";
import type { createMatchAttendanceMutation } from "@/__generated__/createMatchAttendanceMutation.graphql";
import type { updateMatchAttendanceMutation } from "@/__generated__/updateMatchAttendanceMutation.graphql";
import type { createMatchMercenaryMutation } from "@/__generated__/createMatchMercenaryMutation.graphql";
import type { deleteMatchMercenaryMutation } from "@/__generated__/deleteMatchMercenaryMutation.graphql";
import { parseMatchIdForApi } from "@/utils/match/parseMatchIdForApi";
import type { PendingTeamMemberRow } from "@/types/formationRosterModal";

export type AttendanceStatus = "ATTEND" | "ABSENT";

export type FormationRosterAttendanceRowLike = {
  readonly id: number;
  readonly attendanceStatus?: string | null;
  readonly teamMember?: { readonly id: number } | null;
};

export type PendingTeamMemberMutation = Pick<
  PendingTeamMemberRow,
  "teamMemberId" | "userId"
> & {
  readonly currentStatus: AttendanceStatus;
};

/** `Promise.allSettled` 집계 — 부분 실패 시에도 성공 건 수·대표 오류를 UI에 넘깁니다. */
export type FormationRosterCommitResult = {
  total: number;
  succeeded: number;
  failed: number;
  /** 첫 실패 원인(토스트·로그). 전부 성공이면 `null`. */
  firstRejection: unknown | null;
};

/**
 * 포메이션「참석 선수 관리」모달에서 확정 시 서버에 반영합니다.
 * (팀원 참석 CRUD + 용병 생성/삭제 — SRP: Relay 뮤테이션 오케스트레이션만)
 */
export async function commitFormationRosterModalMutations(options: {
  environment: Environment;
  matchId: number;
  teamId: number;
  attendanceByTeamMemberId: Map<
    number,
    FormationRosterAttendanceRowLike | undefined
  >;
  pendingTeamMembers: readonly PendingTeamMemberMutation[];
  mercenaryNamesToCreate: readonly string[];
  /** Relay가 `id`를 숫자 또는 `MatchMercenaryModel:1` 형 문자열로 줄 수 있음 */
  mercenaryIdsToDelete: readonly (number | string)[];
}): Promise<FormationRosterCommitResult> {
  const {
    environment,
    matchId,
    teamId,
    attendanceByTeamMemberId,
    pendingTeamMembers,
    mercenaryNamesToCreate,
    mercenaryIdsToDelete,
  } = options;

  const tasks: Promise<unknown>[] = [];

  for (const player of pendingTeamMembers) {
    const existing = attendanceByTeamMemberId.get(player.teamMemberId);
    const targetStatus = player.currentStatus;

    if (existing) {
      if (existing.attendanceStatus !== targetStatus) {
        const attendanceRowId = parseMatchIdForApi(existing.id);
        if (attendanceRowId == null) {
          tasks.push(
            Promise.reject(
              new Error(
                `참석 레코드 ID를 숫자로 변환할 수 없습니다: ${String(existing.id)}`,
              ),
            ),
          );
          continue;
        }
        tasks.push(
          new Promise<updateMatchAttendanceMutation["response"]>(
            (resolve, reject) => {
              commitMutation<updateMatchAttendanceMutation>(environment, {
                mutation: UpdateMatchAttendanceMutation,
                variables: {
                  input: {
                    id: attendanceRowId,
                    teamId,
                    attendanceStatus: targetStatus,
                  },
                },
                onCompleted: resolve,
                onError: reject,
              });
            },
          ),
        );
      }
    } else {
      tasks.push(
        new Promise<createMatchAttendanceMutation["response"]>(
          (resolve, reject) => {
            commitMutation<createMatchAttendanceMutation>(environment, {
              mutation: CreateMatchAttendanceMutation,
              variables: {
                input: {
                  matchId,
                  teamId,
                  attendanceStatus: targetStatus,
                },
              },
              onCompleted: resolve,
              onError: reject,
            });
          },
        ),
      );
    }
  }

  for (const name of mercenaryNamesToCreate) {
    const trimmed = name.trim();
    if (!trimmed) continue;
    tasks.push(
      new Promise<createMatchMercenaryMutation["response"]>((resolve, reject) => {
        commitMutation<createMatchMercenaryMutation>(environment, {
          mutation: CreateMatchMercenaryMutation,
          variables: {
            input: { matchId, teamId, name: trimmed },
          },
          onCompleted: resolve,
          onError: reject,
        });
      }),
    );
  }

  for (const rawMercenaryId of mercenaryIdsToDelete) {
    const mercenaryId = parseMatchIdForApi(rawMercenaryId);
    if (mercenaryId == null) {
      tasks.push(
        Promise.reject(
          new Error(
            `용병 ID를 숫자로 변환할 수 없습니다: ${String(rawMercenaryId)}`,
          ),
        ),
      );
      continue;
    }
    tasks.push(
      new Promise<deleteMatchMercenaryMutation["response"]>((resolve, reject) => {
        commitMutation<deleteMatchMercenaryMutation>(environment, {
          mutation: DeleteMatchMercenaryMutation,
          variables: {
            input: { id: mercenaryId, teamId },
          },
          onCompleted: resolve,
          onError: reject,
        });
      }),
    );
  }

  const settled = await Promise.allSettled(tasks);
  const succeeded = settled.filter((r) => r.status === "fulfilled").length;
  const failed = settled.filter((r) => r.status === "rejected").length;
  const firstRejected = settled.find(
    (r): r is PromiseRejectedResult => r.status === "rejected",
  );

  return {
    total: settled.length,
    succeeded,
    failed,
    firstRejection: firstRejected?.reason ?? null,
  };
}
