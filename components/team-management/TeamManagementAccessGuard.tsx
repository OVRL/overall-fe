"use client";

import { Suspense, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUserId } from "@/hooks/useUserId";
import { useTeamManagementCapabilitiesForUser } from "@/hooks/useTeamManagementCapabilitiesForUser";

type TeamManagementAccessGuardProps = {
  children: ReactNode;
};

/**
 * 클라이언트 네비게이션·팀 전환 후에도 player가 머물지 않도록 보조 리다이렉트.
 * (종단: SSR `app/layout`의 리다이렉트와 이중 방어)
 */
export function TeamManagementAccessGuard({
  children,
}: TeamManagementAccessGuardProps) {
  const userId = useUserId();
  const router = useRouter();

  useEffect(() => {
    if (userId === null) {
      router.replace("/");
    }
  }, [userId, router]);

  if (userId === null) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <TeamManagementAccessGuardInner userId={userId}>
        {children}
      </TeamManagementAccessGuardInner>
    </Suspense>
  );
}

function TeamManagementAccessGuardInner({
  userId,
  children,
}: {
  userId: number;
  children: ReactNode;
}) {
  const { canAccessTeamManagementRoute } =
    useTeamManagementCapabilitiesForUser(userId);
  const router = useRouter();

  useEffect(() => {
    if (!canAccessTeamManagementRoute) {
      router.replace("/home");
    }
  }, [canAccessTeamManagementRoute, router]);

  if (!canAccessTeamManagementRoute) {
    return null;
  }

  return children;
}
