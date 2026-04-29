"use client";

import { Suspense, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUserId } from "@/hooks/useUserId";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
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
      router.replace("/login/social");
    }
  }, [userId, router]);

  if (userId === null) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <TeamManagementAccessGuardInner>{children}</TeamManagementAccessGuardInner>
    </Suspense>
  );
}

function TeamManagementAccessGuardInner({ children }: { children: ReactNode }) {
  const { selectedTeamId } = useSelectedTeamId();
  const { canAccessTeamManagementRoute, selectedTeamMemberRole } =
    useTeamManagementCapabilitiesForUser();
  const router = useRouter();

  useEffect(() => {
    // role이 null이면 데이터 로딩 중 — 리다이렉트하지 않음
    // role이 명시적으로 PLAYER인 경우에만 리다이렉트
    if (selectedTeamId && selectedTeamMemberRole !== null && !canAccessTeamManagementRoute) {
      router.replace("/");
    }
  }, [canAccessTeamManagementRoute, selectedTeamMemberRole, selectedTeamId, router]);

  // role이 PLAYER로 확정된 경우에만 null 반환 (null role = 로딩 중, children 유지)
  if (selectedTeamMemberRole !== null && !canAccessTeamManagementRoute) {
    return null;
  }

  return children;
}
