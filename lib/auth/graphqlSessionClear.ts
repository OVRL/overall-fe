/**
 * JWT는 유효하지만 DB에서 유저가 삭제된 경우 등, GraphQL이 non-null 필드 위반으로 에러를 줄 때
 * 세션·쿠키를 비우고 루트로 보내기 위한 판별 로직입니다.
 * (스키마: findUserById: UserModel! → 존재하지 않으면 "Cannot return null for non-nullable field Query.findUserById")
 */

export const STALE_AUTH_SESSION_ERROR = "STALE_AUTH_SESSION";

/** GraphQL 응답 body의 errors 배열 기준 */
export function graphqlErrorsRequireSessionClear(
  errors: Array<{ message?: string }> | undefined | null,
): boolean {
  if (!errors?.length) return false;
  return errors.some((e) => {
    const m = String(e?.message ?? "");
    return /cannot return null for non-nullable field query\.finduserbyid/i.test(
      m,
    );
  });
}

/** SSR에서 Relay가 감싼 Error.message 또는 우리가 던진 STALE_AUTH_SESSION 문자열 */
export function errorMessageRequiresSessionClear(message: string): boolean {
  if (message === STALE_AUTH_SESSION_ERROR) return true;
  if (
    /cannot return null for non-nullable field query\.finduserbyid/i.test(
      message,
    )
  ) {
    return true;
  }
  // Relay: "No data returned for operation `findUserByIdQuery`, got error(s): ..."
  if (
    /relaynetwork:\s*no data returned/i.test(message) &&
    /finduserbyidquery/i.test(message)
  ) {
    return true;
  }
  return false;
}
