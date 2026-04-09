"use client";

import React, { createContext, useContext } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const FormationNavigationGuardContext =
  createContext<AppRouterInstance | null>(null);

export function FormationNavigationGuardProvider({
  value,
  children,
}: {
  value: AppRouterInstance;
  children: React.ReactNode;
}) {
  return (
    <FormationNavigationGuardContext.Provider value={value}>
      {children}
    </FormationNavigationGuardContext.Provider>
  );
}

/**
 * 포메이션 화면 하위에서 프로그래밍 내비게이션 시 사용합니다.
 * 반드시 `FormationNavigationGuardProvider` 안에서만 호출하세요.
 */
export function useFormationGuardedRouter(): AppRouterInstance {
  const router = useContext(FormationNavigationGuardContext);
  if (router == null) {
    throw new Error(
      "useFormationGuardedRouter는 FormationNavigationGuardProvider 내부에서만 사용할 수 있습니다.",
    );
  }
  return router;
}
