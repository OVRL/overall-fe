"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { MouseEvent } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  createGuardedAppRouter,
  executePendingNavigation,
  type PendingNavigation,
} from "@/lib/navigation/guardedAppRouter";

const FORMATION_LEAVE_STATE = { formationLeaveGuard: true } as const;

export type FormationLeaveNavigationGuardParams = {
  /** `useBridgeRouter()` 등 App Router 인스턴스 */
  baseRouter: AppRouterInstance;
  /** 기준선 대비 변경이 있을 때만 이탈을 막습니다 */
  isDirty: boolean;
  /** 최초 등록 vs 확정 수정 — 열 모달 분기 */
  isRegistrationFlow: boolean;
  openRegistrationLeaveModal: () => void;
  openConfirmedEditLeaveModal: () => void;
};

export type FormationLeaveNavigationGuardResult = {
  /** 링크·코드 내비게이션에 사용 (가드 적용) */
  guardedRouter: AppRouterInstance;
  /**
   * 같은 출처 `a[href]` 클릭을 가로채 `guardedRouter.push`로 보냅니다.
   * 레이아웃 루트에 `onClickCapture`로 붙이세요.
   */
  captureAnchorClick: (e: MouseEvent<HTMLElement>) => void;
  /** 헤더 뒤로가기 — 변경 있으면 모달 + pending(back) */
  requestBack: () => void;
  /**
   * 최초 등록 플로우: 임시저장 성공 직후 호출해 대기 중이던 내비게이션을 이어갑니다.
   */
  finalizeRegistrationLeaveAfterPersist: () => void;
  /** 확정 수정 플로우: 저장 없이 이탈 확정 시 */
  finalizeEditLeaveDiscard: () => void;
  /** 모달 취소 시 pending 초기화 (브라우저 뒤로가기로 연 모달이면 히스토리 트랩 복구) */
  clearPendingLeave: () => void;
};

/**
 * 포메이션 페이지 이탈 가드
 * - 클라이언트 `push`/`replace`/`back`: 가드된 라우터
 * - 같은 문서 내 앵커: `captureAnchorClick`
 * - 변경 중 새로고침/탭 닫기: `beforeunload` (브라우저 기본 확인만 가능)
 * - 브라우저 뒤로가기: `isDirty` 시 히스토리에 트랩 1단을 쌓고, `popstate`에서 모달
 */
export function useFormationLeaveNavigationGuard({
  baseRouter,
  isDirty,
  isRegistrationFlow,
  openRegistrationLeaveModal,
  openConfirmedEditLeaveModal,
}: FormationLeaveNavigationGuardParams): FormationLeaveNavigationGuardResult {
  const pendingRef = useRef<PendingNavigation | null>(null);
  /** 확인 직후 한 번만 가드를 건너뜁니다 */
  const bypassRef = useRef(false);
  /**
   * 모달에서 이탈 확정 후 `router.back()` 등 — 언로드가 한 틱 늦게 일어나도
   * `isDirty`가 아직 true인 동안 `beforeunload`가 뜨지 않도록 구분합니다.
   */
  const intentionalDocumentLeaveRef = useRef(false);
  /** `pushState`로 쌓아 둔 중복 엔트리가 있으면 true — 헤더 뒤로가기 시 2단계 이탈 필요 */
  const trapPushedRef = useRef(false);
  /** 마지막 모달이 브라우저 뒤로가기(popstate)로 열렸으면 true — 취소 시 트랩만 다시 쌓음 */
  const openedFromBrowserBackRef = useRef(false);
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;
  const prevDirtyRef = useRef(false);

  const shouldBlock = useCallback(() => {
    if (bypassRef.current) return false;
    return isDirty;
  }, [isDirty]);

  const openModalForFlow = useCallback(() => {
    if (isRegistrationFlow) openRegistrationLeaveModal();
    else openConfirmedEditLeaveModal();
  }, [
    isRegistrationFlow,
    openRegistrationLeaveModal,
    openConfirmedEditLeaveModal,
  ]);

  const assignBackPending = useCallback(
    (steps: number) => {
      pendingRef.current = { kind: "back", steps };
      openedFromBrowserBackRef.current = false;
    },
    [],
  );

  const onBlocked = useCallback(
    (pending: PendingNavigation) => {
      if (pending.kind === "back") {
        assignBackPending(trapPushedRef.current ? 2 : 1);
      } else {
        pendingRef.current = pending;
        openedFromBrowserBackRef.current = false;
      }
      openModalForFlow();
    },
    [assignBackPending, openModalForFlow],
  );

  const guardedRouter = useMemo(
    () =>
      createGuardedAppRouter(baseRouter, {
        shouldBlock,
        onBlocked,
      }),
    [baseRouter, shouldBlock, onBlocked],
  );

  const removeTrapIfAny = useCallback(() => {
    if (!trapPushedRef.current) return;
    trapPushedRef.current = false;
    bypassRef.current = true;
    window.history.go(-1);
    queueMicrotask(() => {
      bypassRef.current = false;
    });
  }, []);

  const runPendingOrFallback = useCallback(
    (fallback: () => void) => {
      const pending = pendingRef.current;
      pendingRef.current = null;
      openedFromBrowserBackRef.current = false;
      bypassRef.current = true;
      intentionalDocumentLeaveRef.current = true;
      try {
        if (pending != null) {
          if (pending.kind === "push" || pending.kind === "replace") {
            removeTrapIfAny();
          }
          executePendingNavigation(baseRouter, pending);
        } else {
          fallback();
        }
      } finally {
        const clearLeaveFlags = () => {
          bypassRef.current = false;
          intentionalDocumentLeaveRef.current = false;
        };
        // `queueMicrotask`보다 늦춰 `beforeunload`와 경쟁하지 않게 함
        setTimeout(clearLeaveFlags, 0);
      }
    },
    [baseRouter, removeTrapIfAny],
  );

  const requestBack = useCallback(() => {
    if (!isDirty) {
      baseRouter.back();
      return;
    }
    assignBackPending(trapPushedRef.current ? 2 : 1);
    openModalForFlow();
  }, [assignBackPending, baseRouter, isDirty, openModalForFlow]);

  const captureAnchorClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!shouldBlock()) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.getAttribute("href");
      if (
        href == null ||
        href === "" ||
        href === "#" ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      if (anchor.getAttribute("download") != null) return;
      if (anchor.target === "_blank") return;

      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const next = `${url.pathname}${url.search}${url.hash}`;
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (next === current) return;

      e.preventDefault();
      e.stopPropagation();
      guardedRouter.push(next);
    },
    [guardedRouter, shouldBlock],
  );

  const finalizeRegistrationLeaveAfterPersist = useCallback(() => {
    runPendingOrFallback(() => baseRouter.back());
  }, [baseRouter, runPendingOrFallback]);

  const finalizeEditLeaveDiscard = useCallback(() => {
    runPendingOrFallback(() => baseRouter.back());
  }, [baseRouter, runPendingOrFallback]);

  const clearPendingLeave = useCallback(() => {
    if (openedFromBrowserBackRef.current) {
      openedFromBrowserBackRef.current = false;
      window.history.pushState(
        FORMATION_LEAVE_STATE,
        "",
        window.location.href,
      );
    }
    pendingRef.current = null;
  }, []);

  /** 변경 시 히스토리에 동일 URL 엔트리 1개 추가 — 첫 브라우저 뒤로가기를 같은 페이지에서 소모 */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isDirty) return;
    if (trapPushedRef.current) return;
    window.history.pushState(FORMATION_LEAVE_STATE, "", window.location.href);
    trapPushedRef.current = true;
  }, [isDirty]);

  /** 수정 사항을 모두 되돌리면 트랩 엔트리 제거 */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isDirty) {
      prevDirtyRef.current = true;
      return;
    }
    if (prevDirtyRef.current && trapPushedRef.current) {
      trapPushedRef.current = false;
      bypassRef.current = true;
      window.history.go(-1);
      queueMicrotask(() => {
        bypassRef.current = false;
      });
    }
    prevDirtyRef.current = false;
  }, [isDirty]);

  /** 새로고침·탭 닫기 — 커스텀 문구는 대부분 브라우저에서 무시됩니다 */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (bypassRef.current || intentionalDocumentLeaveRef.current) {
        return;
      }
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  /** 브라우저 UI 뒤로가기 — 이미 한 단계 빠진 뒤(popstate) 모달 */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onPopState = () => {
      if (bypassRef.current) return;
      if (!isDirtyRef.current) return;

      pendingRef.current = { kind: "back", steps: 1 };
      openedFromBrowserBackRef.current = true;
      openModalForFlow();
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [openModalForFlow]);

  return {
    guardedRouter,
    captureAnchorClick,
    requestBack,
    finalizeRegistrationLeaveAfterPersist,
    finalizeEditLeaveDiscard,
    clearPendingLeave,
  };
}
