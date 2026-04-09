import {
  createGuardedAppRouter,
  executePendingNavigation,
} from "../guardedAppRouter";

describe("createGuardedAppRouter", () => {
  it("가드가 false면 원래 라우터 메서드를 호출한다", () => {
    const router = {
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
    const onBlocked = jest.fn();
    const guarded = createGuardedAppRouter(router, {
      shouldBlock: () => false,
      onBlocked,
    });

    guarded.back();
    guarded.push("/foo");
    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.push).toHaveBeenCalledWith("/foo", undefined);
    expect(onBlocked).not.toHaveBeenCalled();
  });

  it("가드가 true면 onBlocked만 호출하고 네비게이션은 하지 않는다", () => {
    const router = {
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
    const onBlocked = jest.fn();
    const guarded = createGuardedAppRouter(router, {
      shouldBlock: () => true,
      onBlocked,
    });

    guarded.push("/x");
    expect(onBlocked).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "push", href: "/x" }),
    );
    expect(router.push).not.toHaveBeenCalled();
  });

  it("prefetch는 가드 없이 위임한다", () => {
    const router = {
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
    const guarded = createGuardedAppRouter(router, {
      shouldBlock: () => true,
      onBlocked: jest.fn(),
    });

    guarded.prefetch("/p");
    expect(router.prefetch).toHaveBeenCalledWith("/p", undefined);
  });
});

describe("executePendingNavigation", () => {
  it("PendingNavigation 종류별로 라우터를 호출한다", () => {
    const router = {
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };

    executePendingNavigation(router, { kind: "back" });
    expect(router.back).toHaveBeenCalled();

    executePendingNavigation(router, {
      kind: "push",
      href: "/a",
      options: { scroll: false },
    });
    expect(router.push).toHaveBeenCalledWith("/a", { scroll: false });
  });

  it("back steps>1 이면 history.go(-steps)를 사용한다", () => {
    const go = jest.spyOn(window.history, "go").mockImplementation(() => {});
    const router = {
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };

    executePendingNavigation(router, { kind: "back", steps: 2 });
    expect(go).toHaveBeenCalledWith(-2);
    expect(router.back).not.toHaveBeenCalled();

    go.mockRestore();
  });
});
