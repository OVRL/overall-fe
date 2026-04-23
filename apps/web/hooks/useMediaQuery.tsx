import { useEffect, useState } from "react";

/**
 * 미디어 쿼리 매칭 여부.
 * - null: SSR/초기 페인트 시 뷰포트 미결정 (레이아웃 시프트 방지를 위해 스켈레톤 등 처리 권장)
 * - true / false: 클라이언트에서 결정된 값
 */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    // 초기값은 마이크로태스크로 설정 (effect 내 동기 setState 경고 회피)
    queueMicrotask(() => setMatches(media.matches));

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
