import {
  ACCESS_TOKEN_EXPIRY_LEEWAY_SEC,
  isAccessTokenExpired,
  readJwtExpUnix,
} from "../jwtAccess";

function makeJwt(exp: number): string {
  const payload = Buffer.from(JSON.stringify({ exp }), "utf-8").toString(
    "base64url",
  );
  return `e30.${payload}.e30`;
}

describe("jwtAccess", () => {
  it("readJwtExpUnix가 exp를 반환한다", () => {
    expect(readJwtExpUnix(makeJwt(2000000000))).toBe(2000000000);
  });

  it("형식이 잘못되면 null", () => {
    expect(readJwtExpUnix("not-a-jwt")).toBeNull();
  });

  it("만료 전이면 isAccessTokenExpired false", () => {
    const farFuture = Math.floor(Date.now() / 1000) + 3600;
    expect(isAccessTokenExpired(makeJwt(farFuture), 0)).toBe(false);
  });

  it("만료 후면 true", () => {
    const past = Math.floor(Date.now() / 1000) - 10;
    expect(isAccessTokenExpired(makeJwt(past), 0)).toBe(true);
  });

  it("skew 적용 시 곧 만료면 true", () => {
    const soon = Math.floor(Date.now() / 1000) + 30;
    expect(
      isAccessTokenExpired(makeJwt(soon), ACCESS_TOKEN_EXPIRY_LEEWAY_SEC),
    ).toBe(true);
  });
});
