"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import Link from "@/components/Link";
import RegisterGameButton from "@/components/layout/header/RegisterGameButton";
import { MobileNavDropdown } from "@/components/layout/header/MobileNavDropdown";
import { useTeamManagementCapabilitiesForUser } from "@/hooks/useTeamManagementCapabilitiesForUser";
import {
  filterMenuItemsForStaffTeamManagement,
  type NavMenuItem,
} from "@/lib/navigation/filterMenuItemsByTeamRole";

type GlobalHeaderNavWithCapabilitiesProps = {
  userId: number;
  pathname: string;
  menuItems: readonly NavMenuItem[];
  isMenuOpen: boolean;
  onMobileMenuClose: () => void;
  mobileMenuId: string;
  /** 햄버거 버튼 — 동일 Suspense 경계 안에서 데스크톱 줄과 나란히 배치 */
  hamburger: ReactNode;
};

/**
 * FindTeamMember + 선택 팀 기준 권한에 따라 데스크톱/모바일 네비를 렌더합니다.
 * Relay useLazyLoadQuery는 한 번만 호출되도록 데스크톱·모바일을 한 컴포넌트에서 처리합니다.
 */
export function GlobalHeaderNavWithCapabilities({
  userId,
  pathname,
  menuItems,
  isMenuOpen,
  onMobileMenuClose,
  mobileMenuId,
  hamburger,
}: GlobalHeaderNavWithCapabilitiesProps) {
  const { showRegisterGame, canAccessTeamManagementRoute } =
    useTeamManagementCapabilitiesForUser(userId);

  const visibleMenuItems = useMemo(
    () =>
      filterMenuItemsForStaffTeamManagement(
        menuItems,
        canAccessTeamManagementRoute,
      ),
    [menuItems, canAccessTeamManagementRoute],
  );

  return (
    <>
      <div className="flex items-center gap-6 lg:gap-10">
        <ul className="hidden lg:flex items-center gap-8 text-[0.9375rem]">
          {showRegisterGame ? <RegisterGameButton /> : null}
          {visibleMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`transition-colors px-4 py-2.5 rounded-xl ${
                    isActive
                      ? "bg-surface-card text-Label-AccentPrimary border border-border-card"
                      : "text-white hover:text-gray-500"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        {hamburger}
      </div>

      {isMenuOpen ? (
        <MobileNavDropdown
          menuItems={visibleMenuItems}
          currentPathname={pathname}
          onLinkClick={onMobileMenuClose}
          id={mobileMenuId}
          showRegisterGame={showRegisterGame}
        />
      ) : null}
    </>
  );
}
