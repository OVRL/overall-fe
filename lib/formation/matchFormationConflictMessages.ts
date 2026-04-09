/**
 * 다른 관리자가 먼저 확정한 뒤 본인이 확정을 시도할 때의 GraphQL 오류 식별용.
 * Nest 등 백엔드 메시지·extensions.code와 맞출 때 이 파일만 조정하면 됩니다.
 */
export const MATCH_FORMATION_ALREADY_CONFIRMED_GRAPHQL_CODE =
  "MATCH_FORMATION_ALREADY_CONFIRMED";

/** `message` 또는 `getGraphQLErrorMessage` 결과에 부분 일치로 검사 */
export const MATCH_FORMATION_ALREADY_CONFIRMED_MESSAGE_MARKERS = [
  "이미 확정된 포메이션",
  "이미 확정된 포메이션입니다",
] as const;
