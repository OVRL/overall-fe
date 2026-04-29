import { type RefObject, useEffect, useState } from "react";

type Options = {
  rootMargin?: string;
  threshold?: number | number[];
};

/**
 * 요소가 뷰포트와 한 번이라도 교차하면 true로 고정합니다.
 * 관찰 대상은 ref가 붙은 DOM이 마운트된 뒤부터 적용됩니다.
 */
export function useIntersectionObserveOnce(
  ref: RefObject<Element | null>,
  options?: Options,
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
        }
      },
      {
        root: null,
        rootMargin: options?.rootMargin ?? "0px",
        threshold: options?.threshold ?? 0,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, inView, options?.rootMargin, options?.threshold]);

  return inView;
}
