import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useUserStore } from "@/contexts/UserContext";
import { parseUserId, useUserId } from "../useUserId";

describe("parseUserId", () => {
  it("숫자 문자열을 정수로 파싱한다", () => {
    expect(parseUserId("42")).toBe(42);
  });

  it("Relay 글로벌 ID에서 마지막 숫자를 추출한다", () => {
    expect(parseUserId("UserModel:14")).toBe(14);
  });

  it("파싱 불가하면 null", () => {
    expect(parseUserId("abc")).toBeNull();
    expect(parseUserId("UserModel:x")).toBeNull();
  });
});

describe("useUserId", () => {
  beforeEach(() => {
    useUserStore.setState({ user: null });
  });

  it("user가 없으면 null", () => {
    const { result } = renderHook(() => useUserId());
    expect(result.current).toBeNull();
  });

  it("user.id에서 숫자 id를 반환한다", () => {
    act(() => {
      useUserStore.setState({
        user: {
          id: "UserModel:7",
          email: "a@b.c",
        },
      });
    });
    const { result } = renderHook(() => useUserId());
    expect(result.current).toBe(7);
  });
});
