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
 * 서버 전용: 팀 멤버 목록을 fetch하여 Player[]로 반환합니다.
 * Page(Server Component)에서 호출해 initialPlayers로 클라이언트에 넘길 때 사용합니다.
 * (데이터는 서버에서 한 번만 fetch, 검색/정렬은 클라이언트에서 props 기반으로 처리)
 */
export async function getTeamMembersServer(
  accessToken: string | null,
): Promise<Player[]> {
  const environment = getServerEnvironment(accessToken, null);
  const observable = fetchQuery(
    environment,
    FindManyTeamMemberQuery,
    { limit: ROSTER_PAGE_SIZE, offset: 0 },
    { fetchPolicy: "network-only" },
  );
  const data = await observableToPromise<QueryResponse>(
    observable as unknown as RelayObservableLike<QueryResponse>,
  );
  const members = data?.findManyTeamMember?.members ?? [];
  return mapTeamMembersToPlayers(members);
}
