"use client";

import { useUserStore } from "@/contexts/UserContext";

/**
 * GraphQL `Int` 유저 id, Relay 글로벌 ID("UserModel:14"), 숫자 문자열에서 정수 id를 추출합니다.
 * (로스터 등 Relay 응답의 user.id와 로그인 유저 id 비교 시 공용)
 */
export function parseUserId(
  id: string | number | null | undefined,
): number | null {
  if (id == null) return null;
  if (typeof id === "number") {
    return Number.isInteger(id) && !Number.isNaN(id) ? id : null;
  }
  const s = String(id).trim();
  if (s === "") return null;
  const n = Number(s);
  if (!Number.isNaN(n)) return n;
  const parts = s.split(":");
  const last = parts[parts.length - 1];
  if (last == null) return null;
  const num = Number(last.trim());
  return Number.isNaN(num) ? null : num;
}

/**
 * Zustand UserStore에 저장된 현재 로그인 유저 ID를 조회합니다.
 * (UserInitProvider에서 쿠키/SSR 기반으로 user를 세팅한 뒤 사용)
 * GraphQL Int 또는 Relay 글로벌 ID("UserModel:14") 형식도 파싱합니다.
 */
export function useUserId(): number | null {
  const user = useUserStore((state) => state.user);
  if (user?.id == null) return null;
  return parseUserId(user.id);
}
