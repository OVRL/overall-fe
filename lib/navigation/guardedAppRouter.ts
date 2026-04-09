import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * 가드에 걸렸을 때 나중에 재개할 내비게이션 의도.
 * Next App Router `AppRouterInstance` 시그니처와 맞춥니다.
 */
export type PendingNavigation =
  | {
      kind: "back";
      /**
       * 히스토리 트랩 등으로 한 번에 여러 단계를 물러나야 할 때 (예: 2).
       * 생략 시 1 — `router.back()` 한 번에 해당합니다.
       */
      steps?: number;
    }
  | { kind: "forward" }
  | { kind: "refresh" }
  | {
      kind: "push";
      href: string;
      options?: Parameters<AppRouterInstance["push"]>[1];
    }
  | {
      kind: "replace";
      href: string;
      options?: Parameters<AppRouterInstance["replace"]>[1];
    };

export type GuardedAppRouterConfig = {
  shouldBlock: () => boolean;
  onBlocked: (pending: PendingNavigation) => void;
};

/**
 * `push` / `replace` / `back` 등을 선행 가드와 함께 실행합니다.
 * `prefetch`는 부작용이 없어 그대로 위임합니다.
 */
export function createGuardedAppRouter(
  router: AppRouterInstance,
  { shouldBlock, onBlocked }: GuardedAppRouterConfig,
): AppRouterInstance {
  const run = (pending: PendingNavigation, exec: () => void) => {
    if (shouldBlock()) {
      onBlocked(pending);
      return;
    }
    exec();
  };

  return {
    back: () => run({ kind: "back" }, () => router.back()),
    forward: () => run({ kind: "forward" }, () => router.forward()),
    refresh: () => run({ kind: "refresh" }, () => router.refresh()),
    push: (href, options) =>
      run({ kind: "push", href, options }, () => router.push(href, options)),
    replace: (href, options) =>
      run(
        { kind: "replace", href, options },
        () => router.replace(href, options),
      ),
    prefetch: (href, options) => router.prefetch(href, options),
  };
}

export function executePendingNavigation(
  router: AppRouterInstance,
  pending: PendingNavigation,
): void {
  switch (pending.kind) {
    case "back": {
      const steps = pending.steps ?? 1;
      if (steps <= 1) {
        router.back();
        return;
      }
      if (typeof window !== "undefined") {
        window.history.go(-steps);
      } else {
        for (let i = 0; i < steps; i++) router.back();
      }
      return;
    }
    case "forward":
      router.forward();
      return;
    case "refresh":
      router.refresh();
      return;
    case "push":
      router.push(pending.href, pending.options);
      return;
    case "replace":
      router.replace(pending.href, pending.options);
      return;
  }
}
