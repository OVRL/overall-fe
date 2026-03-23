import type { Position as RelayPosition } from "@/__generated__/findManyTeamMemberQueryQuery.graphql";
import type { Position as AppPosition } from "@/types/position";

/**
 * findManyTeamMember 등 Relay 응답의 `position`을 앱 `Player.position` 타입으로 맞춥니다.
 * GraphQL `Position` enum과 `types/position` 리터럴 집합이 동일하다는 전제에서,
 * Relay 전용 `%future added value`·null은 기본 MF로 둡니다.
 */
export function relayPositionToAppPosition(
  value: RelayPosition | null | undefined,
): AppPosition {
  if (value == null || value === "%future added value") {
    return "MF";
  }
  return value as AppPosition;
}
