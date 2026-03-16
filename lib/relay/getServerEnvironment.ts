import { Environment, Network, RecordSource, Store } from "relay-runtime";
import { createServerFetch } from "./createServerFetch";

/**
 * SSR 전용: 요청당 Relay Environment를 생성합니다.
 * - 요청마다 새 환경을 만들어 사용자 간 데이터가 섞이지 않도록 합니다 (Relay 권장).
 * - accessToken/refreshToken을 넘겨 서버 fetch에서 백엔드 인증·갱신을 적용합니다.
 * - isServer: true로 설정해 서버 렌더링 모드로 동작합니다.
 */
export function getServerEnvironment(
  accessToken: string | null,
  refreshToken: string | null = null,
): Environment {
  const source = new RecordSource();
  const store = new Store(source);
  const fetchFn = createServerFetch(accessToken, refreshToken);
  const network = Network.create(fetchFn);

  return new Environment({
    network,
    store,
    isServer: true,
  });
}
