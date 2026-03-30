"use client";

import dynamic from "next/dynamic";

/**
 * 서버 컴포넌트인 page.tsx에서 직접 ssr: false를 사용할 수 없으므로,
 * 클라이언트 컴포넌트 환경에서 dynamic import를 수행하는 래퍼를 생성합니다.
 */
const MatchScheduleCardClientOnly = dynamic(
  () => import("./MatchScheduleCard"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-surface-card border border-border-card rounded-xl w-full h-24 animate-pulse" />
    ),
  }
);

export default MatchScheduleCardClientOnly;
