import { Environment, Network, RecordSource, Store } from "relay-runtime";
import { fetchQuery } from "./fetchGraphQL";
import {
  createRecordSourceFromSerialized,
  type SerializedRelayRecords,
} from "./serialization";

function createEnvironment(initialRecords?: SerializedRelayRecords) {
  const source = initialRecords
    ? createRecordSourceFromSerialized(initialRecords)
    : new RecordSource();
  return new Environment({
    network: Network.create(fetchQuery),
    store: new Store(source),
    getDataID: (node: { [key: string]: any }, type: string) => {
      return node.id ? `${type}:${node.id}` : null;
    },
    isServer: typeof window === "undefined",
  } as any);
}

let clientEnvironment: Environment | undefined;

/**
 * 클라이언트용 Relay Environment.
 * - SSR 하이드레이션: initialRecords에 서버에서 직렬화한 스토어를 넘기면 해당 데이터로 채워진 환경을 반환하고,
 *   이후에는 같은 환경을 재사용합니다 (Relay 권장: 클라이언트에서 한 환경 유지).
 * - 그 외: 싱글톤 환경을 재사용합니다.
 */
export function getClientEnvironment(initialRecords?: SerializedRelayRecords) {
  if (typeof window === "undefined") {
    return createEnvironment(initialRecords);
  }

  if (initialRecords && !clientEnvironment) {
    clientEnvironment = createEnvironment(initialRecords);
  } else if (!clientEnvironment) {
    clientEnvironment = createEnvironment();
  }

  return clientEnvironment;
}
