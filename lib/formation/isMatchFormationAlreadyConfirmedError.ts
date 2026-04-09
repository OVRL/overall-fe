import {
  MATCH_FORMATION_ALREADY_CONFIRMED_GRAPHQL_CODE,
  MATCH_FORMATION_ALREADY_CONFIRMED_MESSAGE_MARKERS,
} from "./matchFormationConflictMessages";
import { GraphQLHttpError } from "@/lib/relay/GraphQLHttpError";
import { getGraphQLErrorMessage } from "@/lib/relay/getGraphQLErrorMessage";

function firstErrorExtensionsCode(error: unknown): string | undefined {
  if (error instanceof GraphQLHttpError) {
    const ext = error.graphqlErrors[0]?.extensions as
      | { code?: string }
      | undefined;
    return typeof ext?.code === "string" ? ext.code : undefined;
  }

  const e = error as Error & {
    source?: {
      errors?: ReadonlyArray<{ extensions?: { code?: string } }>;
    };
  };
  const code = e.source?.errors?.[0]?.extensions?.code;
  return typeof code === "string" ? code : undefined;
}

/**
 * `confirmMatchFormation` / `createMatchFormation` 등 확정 관련 뮤테이션에서
 * “이미 다른 쪽에서 확정됨”에 해당하는 오류인지 판별합니다.
 */
export function isMatchFormationAlreadyConfirmedError(
  error: unknown,
): boolean {
  const code = firstErrorExtensionsCode(error);
  if (code === MATCH_FORMATION_ALREADY_CONFIRMED_GRAPHQL_CODE) {
    return true;
  }

  const message = getGraphQLErrorMessage(error, "");
  return MATCH_FORMATION_ALREADY_CONFIRMED_MESSAGE_MARKERS.some((marker) =>
    message.includes(marker),
  );
}
