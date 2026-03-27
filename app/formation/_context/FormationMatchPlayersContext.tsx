"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type { Player } from "@/types/formation";

const FormationMatchPlayersContext = createContext<Player[] | undefined>(
  undefined,
);

type FormationMatchPlayersProviderProps = {
  /** 서버에서 로드한 참석(ATTEND) 선수 풀 — 직렬화 가능한 값만 */
  players: Player[];
  children: ReactNode;
};

/**
 * 포메이션 매치 페이지: SSR로 받은 선수 풀을 클라이언트 트리에 주입합니다.
 * (Next 권장: Server Component에서 fetch 후 Client 경계로 직렬화 props 전달 → Provider로 횡단 관심사 분리)
 */
export function FormationMatchPlayersProvider({
  players,
  children,
}: FormationMatchPlayersProviderProps) {
  return (
    <FormationMatchPlayersContext.Provider value={players}>
      {children}
    </FormationMatchPlayersContext.Provider>
  );
}

/** 선수 명단·DnD가 동일 풀을 쓰도록 훅으로 읽습니다. */
export function useFormationMatchPlayers(): Player[] {
  const value = useContext(FormationMatchPlayersContext);
  if (value === undefined) {
    throw new Error(
      "useFormationMatchPlayers는 FormationMatchPlayersProvider 하위에서만 사용할 수 있습니다.",
    );
  }
  return value;
}
