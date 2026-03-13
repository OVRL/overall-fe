/**
 * Relay/GraphQL 에러에서 사용자에게 보여줄 실제 메시지만 추출합니다.
 * - error.source.errors[0].message (GraphQL 응답의 첫 번째 에러 메시지)
 * - 없으면 error.message에서 "got error(s):" 뒤의 문장을 파싱
 */
export function getGraphQLErrorMessage(
  error: unknown,
  fallback = "요청 처리 중 오류가 발생했습니다.",
): string {
  if (!(error instanceof Error)) return fallback;

  const e = error as Error & {
    source?: { errors?: Array<{ message?: string }> };
  };

  const firstMessage = e.source?.errors?.[0]?.message;
  if (typeof firstMessage === "string" && firstMessage.trim().length > 0) {
    return firstMessage.trim();
  }

  // Relay 포맷: "No data returned for operation ..., got error(s):\n\n실제메시지\n\nSee the error..."
  const match = e.message.match(/got error\(s\):\s*\n+\s*([^\n]+)/);
  if (match?.[1]) return match[1].trim();

  return e.message || fallback;
}
