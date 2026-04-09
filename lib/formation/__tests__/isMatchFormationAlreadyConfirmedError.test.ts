import { isMatchFormationAlreadyConfirmedError } from "../isMatchFormationAlreadyConfirmedError";
import { MATCH_FORMATION_ALREADY_CONFIRMED_GRAPHQL_CODE } from "../matchFormationConflictMessages";
import { GraphQLHttpError } from "@/lib/relay/GraphQLHttpError";

describe("isMatchFormationAlreadyConfirmedError", () => {
  it("GraphQL extensions.code가 일치하면 true", () => {
    const err = new GraphQLHttpError(200, [
      {
        message: "Something",
        extensions: { code: MATCH_FORMATION_ALREADY_CONFIRMED_GRAPHQL_CODE },
      },
    ]);
    expect(isMatchFormationAlreadyConfirmedError(err)).toBe(true);
  });

  it("메시지에 ‘이미 확정된 포메이션’이 포함되면 true", () => {
    const err = new GraphQLHttpError(200, [
      { message: "이미 확정된 포메이션입니다." },
    ]);
    expect(isMatchFormationAlreadyConfirmedError(err)).toBe(true);
  });

  it("무관한 오류면 false", () => {
    const err = new GraphQLHttpError(200, [
      { message: "네트워크 타임아웃" },
    ]);
    expect(isMatchFormationAlreadyConfirmedError(err)).toBe(false);
  });
});
