"use client";

import { useUserStore } from "@/contexts/UserContext";

/**
 * Zustand UserStore에 저장된 현재 로그인 유저 ID를 조회합니다.
 * (UserInitProvider에서 쿠키/SSR 기반으로 user를 세팅한 뒤 사용)
 */
export function useUserId(): number | null {
  const user = useUserStore((state) => state.user);
  if (user?.id == null) return null;
  const n = Number(user.id);
  return Number.isNaN(n) ? null : n;
}
