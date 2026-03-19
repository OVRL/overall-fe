"use client";

import { useTeamCreatedModalTrigger } from "@/hooks/useTeamCreatedModalTrigger";

/**
 * 훅을 호출하기 위한 최소 클라이언트 컴포넌트.
 * (홈 페이지는 서버 컴포넌트이므로 훅을 직접 호출할 수 없어 이 래퍼가 필요합니다.)
 */
export default function TeamCreatedModalTrigger() {
  useTeamCreatedModalTrigger();
  return null;
}
