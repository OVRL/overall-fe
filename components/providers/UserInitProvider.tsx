"use client";

import { useRef } from "react";
import { useUserStore, UserModel } from "@/contexts/UserContext";

interface UserInitProviderProps {
  initialUser: UserModel | null;
  children: React.ReactNode;
}

/**
 * 서버 컴포넌트에서 가져온 유저 정보를 Client의 Zustand 스토어에 초기화하는 프로바이더.
 * `initialUser` 데이터를 스토어의 `user` 상태에 한 번 주입합니다.
 */
export function UserInitProvider({ initialUser, children }: UserInitProviderProps) {
  const initialized = useRef(false);

  if (!initialized.current) {
    // SSR 단계 또는 클라이언트의 첫 렌더링 시초에 한 번만 실행합니다.
    useUserStore.setState({ user: initialUser });
    initialized.current = true;
  }

  return <>{children}</>;
}
