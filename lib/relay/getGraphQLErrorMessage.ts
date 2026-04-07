import {
  GraphQLHttpError,
  type GraphQLResponseErrorItem,
} from "./GraphQLHttpError";

const INVALID_INVITE_SERVER_MESSAGE = "유효하지 않은 초대 코드입니다.";
const EXPIRED_INVITE_USER_MESSAGE = "유효기간이 만료된 코드입니다.";

/** GraphQL 엔진(BAD_USER_INPUT 등)이 내려주는 영문 검증 메시지를 사용자용 한국어로 통일 */
const BAD_USER_INPUT_USER_MESSAGE =
  "요청 형식이 올바르지 않습니다. 잠시 후 다시 시도해 주세요.";

function isBadUserInputError(
  item: GraphQLResponseErrorItem | undefined,
): boolean {
  const code = item?.extensions?.code;
  if (code === "BAD_USER_INPUT") return true;
  const msg = typeof item?.message === "string" ? item.message : "";
  return (
    /Variable "\$[a-zA-Z0-9_]+" got invalid value/i.test(msg) ||
    /Field "[^"]+" of required type/i.test(msg) ||
    /was not provided\.?$/i.test(msg.trim())
  );
}

/**
 * Nest 등에서 내려주는 extensions(INTERNAL_SERVER_ERROR + 404 + originalError)일 때
 * 만료 안내 문구로 통일합니다.
 */
function shouldRewriteExpiredInviteCode(
  errors: ReadonlyArray<GraphQLResponseErrorItem> | undefined,
  httpStatus?: number,
): boolean {
  const first = errors?.[0];
  if (!first) return false;
  const ext = first.extensions as
    | {
        code?: string;
        status?: number;
        originalError?: { message?: string };
      }
    | undefined;
  if (ext?.code !== "INTERNAL_SERVER_ERROR") return false;
  if (httpStatus !== 404 && ext.status !== 404) return false;
  const fromOriginal = ext.originalError?.message?.trim();
  const fromMessage =
    typeof first.message === "string" ? first.message.trim() : "";
  const text = fromOriginal || fromMessage;
  return text === INVALID_INVITE_SERVER_MESSAGE;
}

/** HTTP 실패 응답의 GraphQL errors 배열에서 사용자용 문장을 만듭니다. */
function formatGraphQLHttpErrors(
  errors: ReadonlyArray<GraphQLResponseErrorItem>,
): string {
  const first = errors[0];
  if (isBadUserInputError(first)) {
    return BAD_USER_INPUT_USER_MESSAGE;
  }

  const messages = errors
    .map((e) => (typeof e.message === "string" ? e.message.trim() : ""))
    .filter((m) => m.length > 0);
  if (messages.length === 0) return "";

  const fieldNames = new Set<string>();
  for (const m of messages) {
    const re = /Field "([^"]+)" is not defined by type "[^"]+"/g;
    let match: RegExpExecArray | null;
    while ((match = re.exec(m)) !== null) fieldNames.add(match[1]);
  }
  if (fieldNames.size > 0) {
    return `요청 형식이 서버와 맞지 않습니다. 허용되지 않는 필드: ${[...fieldNames].join(", ")}`;
  }

  const simplified = messages.map((m) =>
    m.replace(/^Variable "\$[a-zA-Z0-9_]+" got invalid value \{[^}]*\};\s*/i, ""),
  );
  return simplified.filter((m) => m.length > 0).join(" ");
}

/** 레거시: plain Error.message 앞에 붙는 프리픽스 제거 */
function stripGraphQLHttpFailurePrefix(message: string): string {
  return message.replace(/^GraphQL 요청 실패 \(\d+\):\s*/, "").trim();
}

/**
 * Relay/GraphQL 에러에서 사용자에게 보여줄 실제 메시지만 추출합니다.
 * - GraphQLHttpError: 응답의 errors 전체를 요약
 * - error.source.errors[0].message (GraphQL 응답의 첫 번째 에러 메시지)
 * - 없으면 error.message에서 "got error(s):" 뒤의 문장을 파싱
 */
export function getGraphQLErrorMessage(
  error: unknown,
  fallback = "요청 처리 중 오류가 발생했습니다.",
): string {
  if (error instanceof GraphQLHttpError) {
    if (
      shouldRewriteExpiredInviteCode(error.graphqlErrors, error.httpStatus)
    ) {
      return EXPIRED_INVITE_USER_MESSAGE;
    }
    const formatted = formatGraphQLHttpErrors(error.graphqlErrors);
    return formatted.length > 0 ? formatted : fallback;
  }

  if (!(error instanceof Error)) return fallback;

  const e = error as Error & {
    source?: { errors?: Array<GraphQLResponseErrorItem> };
  };

  const sourceErrors = e.source?.errors;
  if (shouldRewriteExpiredInviteCode(sourceErrors, undefined)) {
    return EXPIRED_INVITE_USER_MESSAGE;
  }

  const firstErr = sourceErrors?.[0];
  if (isBadUserInputError(firstErr)) {
    return BAD_USER_INPUT_USER_MESSAGE;
  }
  const firstMessage = firstErr?.message;
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

  const stripped = stripGraphQLHttpFailurePrefix(e.message);
  if (stripped.length > 0 && stripped !== e.message) return stripped;

  return e.message || fallback;
}
