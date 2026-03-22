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

  // Relay 포맷: 줄바꿈 뒤 메시지
  const multiline = e.message.match(/got error\(s\):\s*\n+\s*([^\n]+)/);
  if (multiline?.[1]) return multiline[1].trim();

  // 한 줄: "... got error(s): 투표 마감... See the error ..."
  const inline = e.message.match(
    /got error\(s\):\s*([\s\S]+?)(?=\s+See the error|$)/i,
  );
  if (inline?.[1]) return inline[1].trim();

  return e.message || fallback;
}
