"use client";
import { createContext, useContext } from "react";

export const FormationMatchContext = createContext<{
  matchId: number;
  teamId: number;
} | null>(null);

export function useFormationMatchIds() {
  const ctx = useContext(FormationMatchContext);
  if (!ctx) {
    throw new Error(
      "useFormationMatchIds must be used within FormationMatchProvider",
    );
  }
  return ctx;
}

/** Provider 밖에서는 null (예: 팀 관리 목업에서 FormationPlayerList만 쓸 때) */
export function useFormationMatchIdsOptional() {
  return useContext(FormationMatchContext);
}
