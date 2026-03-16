import type { Environment } from "relay-runtime";
import { RecordSource } from "relay-runtime";

/**
 * Relay 스토어를 직렬화합니다.
 * 서버에서 loadQuery/fetchQuery로 데이터를 채운 뒤, 이 함수로 RecordSource를 JSON 문자열로 변환해
 * 클라이언트로 넘기면 됩니다 (Relay SSR 권장 패턴).
 */
export function serializeRelayStore(environment: Environment): string {
  const source = environment.getStore().getSource();
  const json = (source as { toJSON: () => Record<string, unknown> }).toJSON();
  return JSON.stringify(json);
}

/**
 * 직렬화된 Relay RecordSource 데이터 타입.
 * Next.js Server Component에서 Client Component로 전달할 때 직렬 가능해야 합니다.
 */
export type SerializedRelayRecords = string;

/**
 * 직렬화된 스토어 문자열로부터 RecordSource 인스턴스를 만듭니다.
 * 클라이언트에서 하이드레이션 시 사용합니다.
 */
export function createRecordSourceFromSerialized(
  serialized: SerializedRelayRecords,
): RecordSource {
  if (!serialized) {
    return new RecordSource();
  }
  try {
    const records = JSON.parse(serialized);
    // Relay RecordSource 생성자: toJSON() 직렬화 결과와 동일한 형태의 객체를 받음
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new RecordSource(records as any);
  } catch {
    return new RecordSource();
  }
}
