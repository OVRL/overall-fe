import { useRef, useEffect } from "react";

/**
 * 마우스 휠 이벤트를 가로 스크롤로 변환해주는 커스텀 훅
 * @returns 가로 스크롤을 적용할 요소에 연결할 ref
 */
export const useHorizontalScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;

      // 세로 휠(deltaY) 발생 시 가로 스크롤(scrollLeft)로 변환
      e.preventDefault();
      el.scrollTo({
        left: el.scrollLeft + e.deltaY,
        behavior: "auto", // 즉각적인 반응을 위해 auto 사용 (smooth가 필요하면 수정 가능)
      });
    };

    el.addEventListener("wheel", onWheel);
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return scrollRef;
};
