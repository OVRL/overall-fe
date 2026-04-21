"use client";

import { Suspense, type ReactNode } from "react";
import Link from "@/components/Link";
import { useUserId } from "@/hooks/useUserId";
import { useTeamManagementCapabilitiesForUser } from "@/hooks/useTeamManagementCapabilitiesForUser";
import { cn } from "@/lib/utils";

type TeamManagementOnboardingCtaLinkProps = {
  href: string;
  className: string;
  children: ReactNode;
};

/**
 * 온보딩 CTA: 스태프만 팀 관리 링크, player는 동일 스타일 비활성 문구.
 */
export function TeamManagementOnboardingCtaLink({
  href,
  className,
  children,
}: TeamManagementOnboardingCtaLinkProps) {
  const userId = useUserId();

  if (userId === null) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <TeamManagementOnboardingCtaLinkInner href={href} className={className}>
        {children}
      </TeamManagementOnboardingCtaLinkInner>
    </Suspense>
  );
}

function TeamManagementOnboardingCtaLinkInner({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  const { canAccessTeamManagementRoute } =
    useTeamManagementCapabilitiesForUser();

  if (canAccessTeamManagementRoute) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <span
      className={cn(
        className,
        "pointer-events-none cursor-not-allowed opacity-50",
      )}
      aria-disabled="true"
    >
      {children}
    </span>
  );
}
