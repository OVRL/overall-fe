import { parse } from "date-fns";
import { isInviteExpired, parseGraphQLDateTime } from "../inviteCodeExpiry";

describe("parseGraphQLDateTime", () => {
  it("ISO 문자열을 파싱한다", () => {
    const d = parseGraphQLDateTime("2026-04-26T12:00:00.000Z");
    expect(d).not.toBeNull();
    expect(d!.getUTCFullYear()).toBe(2026);
  });

  it("Y-m-d H:i:s 형식을 파싱한다", () => {
    const d = parseGraphQLDateTime("2026-04-26 15:30:00");
    expect(d).not.toBeNull();
    expect(d!.getTime()).toBe(
      parse("2026-04-26 15:30:00", "yyyy-MM-dd HH:mm:ss", new Date(0)).getTime(),
    );
  });

  it("빈 문자열이면 null", () => {
    expect(parseGraphQLDateTime("")).toBeNull();
    expect(parseGraphQLDateTime("   ")).toBeNull();
  });
});

describe("isInviteExpired", () => {
  it("만료 시각 이전이면 false", () => {
    const now = parse("2026-04-26 10:00:00", "yyyy-MM-dd HH:mm:ss", new Date(0));
    expect(isInviteExpired("2026-04-26 20:00:00", now)).toBe(false);
  });

  it("만료 시각과 동일하면 true", () => {
    const now = parse("2026-04-26 12:00:00", "yyyy-MM-dd HH:mm:ss", new Date(0));
    expect(isInviteExpired("2026-04-26 12:00:00", now)).toBe(true);
  });

  it("만료 시각 이후면 true", () => {
    const now = parse("2026-04-27 00:00:00", "yyyy-MM-dd HH:mm:ss", new Date(0));
    expect(isInviteExpired("2026-04-26 12:00:00", now)).toBe(true);
  });

  it("파싱 불가면 false (만료로 오판하지 않음)", () => {
    expect(isInviteExpired("not-a-date", new Date())).toBe(false);
  });
});
