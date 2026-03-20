import { fetchQuery } from "relay-runtime";
import type { findManyTeamMemberQueryQuery } from "@/__generated__/findManyTeamMemberQueryQuery.graphql";
import { getServerEnvironment } from "@/lib/relay/getServerEnvironment";
import {
  observableToPromise,
  type RelayObservableLike,
} from "@/lib/relay/observableToPromise";
import {
  FindManyTeamMemberQuery,
  ROSTER_PAGE_SIZE,
} from "@/lib/relay/queries/findManyTeamMemberQuery";
import type { Player } from "../_types/player";
import { mapTeamMembersToPlayers } from "./mapTeamMemberToPlayer";

type QueryResponse = findManyTeamMemberQueryQuery["response"];

/**
 * 서버 전용: 지정 팀(teamId) 멤버 목록을 fetch하여 Player[]로 반환합니다.
 * Page(Server Component)에서 쿠키의 선택 팀 숫자 ID를 넘겨 호출합니다.
 */
export async function getTeamMembersServer(
  accessToken: string | null,
  teamId: number | null,
): Promise<Player[]> {
  if (teamId == null) {
    return [];
  }
  const environment = getServerEnvironment(accessToken, null);
  const observable = fetchQuery(
    environment,
    FindManyTeamMemberQuery,
    { limit: ROSTER_PAGE_SIZE, offset: 0, teamId },
    { fetchPolicy: "network-only" },
  );
  const data = await observableToPromise<QueryResponse>(
    observable as unknown as RelayObservableLike<QueryResponse>,
  );
  const members = data?.findManyTeamMember?.members ?? [];
  return mapTeamMembersToPlayers(members);
}
