"use client";

import { useEffect, useState, startTransition } from "react";

/**
 * SSR과 첫 클라이언트 렌더에서 동일하게 빈 문자열을 쓰고,
 * 마운트 후에만 `window.location.origin`으로 redirect_uri를 채웁니다.
 *
 * `useMemo` 안에서 `typeof window !== "undefined"` 로 분기하면
 * 서버는 disabled=true·클라는 disabled=false 가 되어 하이드레이션 불일치가 납니다.
 */
export function useOAuthRedirectUri(pathFromOrigin: string): string {
  const [uri, setUri] = useState("");

  useEffect(() => {
    const normalized = pathFromOrigin.startsWith("/")
      ? pathFromOrigin
      : `/${pathFromOrigin}`;
    const next = `${window.location.origin}${normalized}`;
    startTransition(() => {
      setUri(next);
    });
  }, [pathFromOrigin]);

  return uri;
}
