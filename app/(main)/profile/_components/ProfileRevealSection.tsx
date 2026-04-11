"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ProfileRevealSectionProps = {
  children: React.ReactNode;
  className?: string;
};

const ROOT_MARGIN = "0px 0px -5% 0px";
const THRESHOLD = 0.06;

function shouldReveal(entry: IntersectionObserverEntry | undefined): boolean {
  if (entry == null || !entry.isIntersecting) return false;
  const ratio = entry.intersectionRatio;
  if (typeof ratio !== "number" || Number.isNaN(ratio)) {
    return true;
  }
  return ratio >= THRESHOLD;
}

/**
 * 프로필 섹션: 뷰포트에 들어온 뒤 한 번만 살짝 올라오며 나타납니다.
 * (페이지 로드 직후 전 구간이 동시에 재생되는 느낌을 줄입니다.)
 * 이미 보이는 구간은 `takeRecords()`로 콜백 한 틱을 기다리지 않고 바로 노출합니다.
 */
export default function ProfileRevealSection({
  children,
  className,
}: ProfileRevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (shouldReveal(entry)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: ROOT_MARGIN,
        threshold: THRESHOLD,
      },
    );

    observer.observe(el);

    const pending = observer.takeRecords() ?? [];
    for (const entry of pending) {
      if (shouldReveal(entry)) {
        setVisible(true);
        observer.disconnect();
        return;
      }
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "profile-reveal w-full",
        visible && "profile-reveal--visible",
        className,
      )}
    >
      {children}
    </div>
  );
}
