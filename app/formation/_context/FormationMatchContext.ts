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
