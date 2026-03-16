import { fetchQuery } from "relay-runtime";
import { getServerEnvironment } from "./getServerEnvironment";
import { observableToPromise } from "./observableToPromise";
import { serializeRelayStore } from "./serialization";
import {
  FindManyTeamMemberQuery,
  ROSTER_PAGE_SIZE,
} from "./queries/findManyTeamMemberQuery";
import type { SerializedRelayRecords } from "./serialization";

/**
 * SSR에서 findManyTeamMember 쿼리를 실행하고 Relay 스토어를 직렬화합니다.
 * Layout 등 Server Component에서 accessToken과 함께 호출한 뒤,
 * 반환된 문자열을 RelayProvider의 initialRecords로 넘기면 클라이언트에서 하이드레이션됩니다.
 * (Relay 공식: 서버에서 loadQuery/fetchQuery 후 스토어를 직렬화해 클라이언트에 전달)
 */
export async function loadFindManyTeamMemberSSR(
  accessToken: string | null,
): Promise<SerializedRelayRecords> {
  const environment = getServerEnvironment(accessToken);
  const observable = fetchQuery(
    environment,
    FindManyTeamMemberQuery,
    { limit: ROSTER_PAGE_SIZE, offset: 0 },
    { fetchPolicy: "network-only" },
  );
  await observableToPromise(observable);
  return serializeRelayStore(environment);
}
