"use client";

import { useEffect } from "react";

const DEBUG =
  typeof process !== "undefined" && process.env.NODE_ENV === "development";

const LOG_PREFIX = "[OVRL login/social][guard]";

/**
 * WebView·모바일 브라우저에서 뒤로가기 시 BFCache / WebKit Page Cache 로
 * `/login/social` 스냅샷만 복원되고 **새 HTTP 요청이 없으면** proxy·RSC `redirect`가 돌지 않음.
 * 동일 출처 `fetch`는 캐시된 문서와 무관하게 나가며 Cookie 가 붙으므로, 세션이 있으면 홈으로 치환.
 */
async function redirectToHomeIfSessionPresent(reason: string): Promise<void> {
  if (DEBUG) {
    console.log(LOG_PREFIX, "session check start", {
      reason,
      href: typeof window !== "undefined" ? window.location.href : "",
      visibilityState:
        typeof document !== "undefined" ? document.visibilityState : "",
    });
  }
  try {
    const res = await fetch("/api/me/user-id", {
      credentials: "same-origin",
      cache: "no-store",
    });
    const data = (await res.json()) as { userId?: number | null; error?: string | null };
    const id = data.userId;
    const hasUserId =
      id != null && typeof id === "number" && !Number.isNaN(id);
    if (DEBUG) {
      console.log(LOG_PREFIX, "session check result", {
        reason,
        httpStatus: res.status,
        ok: res.ok,
        hasUserId,
        apiError: data.error ?? null,
      });
    }
    if (hasUserId) {
      if (DEBUG) {
        console.log(LOG_PREFIX, "→ window.location.replace('/')");
      }
      window.location.replace("/");
    }
  } catch (e) {
    if (DEBUG) {
      console.warn(LOG_PREFIX, "session check fetch failed", {
        reason,
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }
}

/** 로그인된 상태로 게스트 전용 로그인 URL이 보이지 않도록 클라이언트에서 보정 */
export function LoginSocialSessionRedirectGuard() {
  useEffect(() => {
    if (DEBUG) {
      console.log(LOG_PREFIX, "effect mount");
    }
    void redirectToHomeIfSessionPresent("effect");

    const onPageShow = (e: PageTransitionEvent) => {
      if (DEBUG) {
        console.log(LOG_PREFIX, "pageshow", { persisted: e.persisted });
      }
      if (e.persisted) void redirectToHomeIfSessionPresent("pageshow-persisted");
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
