"use client";

import { useUserStore } from "@/contexts/UserContext";

/**
 * Relay 글로벌 ID("NodeType:123") 또는 숫자 문자열에서 숫자 부분만 추출합니다.
 */
function parseUserId(id: string): number | null {
  const n = Number(id);
  if (!Number.isNaN(n)) return n;
  // Relay global ID 예: "UserModel:14"
  const parts = id.split(":");
  const last = parts[parts.length - 1];
  if (last == null) return null;
  const num = Number(last);
  return Number.isNaN(num) ? null : num;
}

/**
 * Zustand UserStore에 저장된 현재 로그인 유저 ID를 조회합니다.
 * (UserInitProvider에서 쿠키/SSR 기반으로 user를 세팅한 뒤 사용)
 * Relay 글로벌 ID("UserModel:14") 형식도 파싱합니다.
 */
export function useUserId(): number | null {
  const user = useUserStore((state) => state.user);
  if (user?.id == null) return null;
  return parseUserId(String(user.id));
}
