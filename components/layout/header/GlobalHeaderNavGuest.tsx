"use client";

import type { ReactNode } from "react";
import { AnimatePresence } from "motion/react";
import Link from "@/components/Link";
import { MobileNavDropdown } from "@/components/layout/header/MobileNavDropdown";
import {
  filterMenuItemsForStaffTeamManagement,
  isHeaderNavItemActive,
  type NavMenuItem,
} from "@/lib/navigation/filterMenuItemsByTeamRole";

type GlobalHeaderNavGuestProps = {
  pathname: string;
  menuItems: readonly NavMenuItem[];
  isMenuOpen: boolean;
  onMobileMenuClose: () => void;
  mobileMenuId: string;
  hamburger: ReactNode;
};

/**
 * 비로그인 등 userId 없음: 경기 등록·팀 관리 메뉴 숨김 (최소 권한 UI).
 * Suspense fallback으로도 동일 컴포넌트를 쓰면 깜빡임을 줄입니다.
 */
export function GlobalHeaderNavGuest({
  pathname,
  menuItems,
  isMenuOpen,
  onMobileMenuClose,
  mobileMenuId,
  hamburger,
}: GlobalHeaderNavGuestProps) {
  const visibleMenuItems = filterMenuItemsForStaffTeamManagement(
    menuItems,
    false,
  );

  return (
    <>
      <div className="flex items-center gap-6 lg:gap-8">
        <ul className="hidden lg:flex items-center gap-8 text-[0.9375rem]">
          {visibleMenuItems.map((item) => {
            const isActive = isHeaderNavItemActive(pathname, item.href);
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

      <AnimatePresence>
        {isMenuOpen && (
          <MobileNavDropdown
            menuItems={visibleMenuItems}
            currentPathname={pathname}
            onLinkClick={onMobileMenuClose}
            id={mobileMenuId}
            showRegisterGame={false}
          />
        )}
      </AnimatePresence>
    </>
  );
}
