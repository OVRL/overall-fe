/** GraphQL 응답 errors[] 항목 (extensions는 백엔드별 형태) */
export type GraphQLResponseErrorItem = {
  message?: string;
  extensions?: Record<string, unknown>;
};

/**
 * HTTP 레벨에서 GraphQL 요청이 실패했을 때(fetch가 ok가 아님) 사용하는 예외.
 * 응답 body의 errors 배열 전체를 보존해 사용자 메시지를 합성할 수 있게 합니다.
 */
export class GraphQLHttpError extends Error {
  readonly httpStatus: number;
  readonly graphqlErrors: ReadonlyArray<GraphQLResponseErrorItem>;

  constructor(
    httpStatus: number,
    graphqlErrors: ReadonlyArray<GraphQLResponseErrorItem> | undefined,
  ) {
    const list = graphqlErrors ?? [];
    const first = list[0]?.message?.trim() ?? "";
    super(
      first
        ? `GraphQL 요청 실패 (${httpStatus}): ${first}`
        : `GraphQL 요청 실패 (${httpStatus})`,
    );
    this.name = "GraphQLHttpError";
    this.httpStatus = httpStatus;
    this.graphqlErrors = list;
  }
}
