import { fetchQuery } from "relay-runtime";
import { getClientEnvironment } from "@/lib/relay/environment";
import type { InviteCodeSnapshot } from "@/lib/inviteCode/inviteCodeSnapshot";
import {
  observableToPromise,
  type RelayObservableLike,
} from "@/lib/relay/observableToPromise";
import { FindInviteCodeByTeamQuery } from "@/lib/relay/queries/findInviteCodeByTeamQuery";
import type { findInviteCodeByTeamQuery$data } from "@/__generated__/findInviteCodeByTeamQuery.graphql";

/**
 * 팀 ID로 기존 초대 코드를 조회합니다.
 * createInviteCode가 "이미 팀 초대 코드가 존재합니다"로 실패했을 때 재사용합니다.
 */
export async function fetchInviteCodeByTeam(
  teamId: number,
): Promise<InviteCodeSnapshot | null> {
  try {
    const environment = getClientEnvironment();
    const observable = fetchQuery(
      environment,
      FindInviteCodeByTeamQuery,
      { teamId },
      { fetchPolicy: "network-only" },
    );
    const data = await observableToPromise<findInviteCodeByTeamQuery$data>(
      observable as unknown as RelayObservableLike<findInviteCodeByTeamQuery$data>,
    );
    const row = data?.findInviteCodeByTeam;
    if (row?.code == null || row.code === "") return null;
    if (row.expiredAt == null || row.expiredAt === "") return null;
    return { code: row.code, expiredAt: row.expiredAt };
  } catch {
    return null;
  }
}
