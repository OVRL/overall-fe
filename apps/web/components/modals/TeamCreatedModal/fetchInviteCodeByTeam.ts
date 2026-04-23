import { fetchQuery } from "relay-runtime";
import { getClientEnvironment } from "@/lib/relay/environment";
import {
  observableToPromise,
  type RelayObservableLike,
} from "@/lib/relay/observableToPromise";
import { FindInviteCodeByTeamQuery } from "@/lib/relay/queries/findInviteCodeByTeamQuery";
import type { findInviteCodeByTeamQuery$data } from "@/__generated__/findInviteCodeByTeamQuery.graphql";

/**
 * 팀 ID로 기존 초대 코드를 조회합니다.
 * createInviteCode가 "이미 팀 초대 코드가 존재합니다"로 실패했을 때 재사용.
 * @returns 초대 코드 문자열, 실패 시 null
 */
export async function fetchInviteCodeByTeam(
  teamId: number,
): Promise<string | null> {
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
    return data?.findInviteCodeByTeam?.code ?? null;
  } catch {
    return null;
  }
}
