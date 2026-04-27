"use client";

import { Suspense, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { useBridge } from "@/hooks/bridge/useBridge";
import { useBridgeRouter } from "@/hooks/bridge/useBridgeRouter";
import { useNativeGlobalHeaderSync } from "@/hooks/bridge/useNativeGlobalHeaderSync";
import { cn } from "@/lib/utils";
import Link from "@/components/Link";
import logoOvr from "@/public/icons/logo_OVR.svg";
import Icon from "@/components/ui/Icon";
import { HamburgerButton } from "@/components/layout/header/HamburgerButton";
import { GlobalHeaderNavGuest } from "@/components/layout/header/GlobalHeaderNavGuest";
import { GlobalHeaderNavWithCapabilities } from "@/components/layout/header/GlobalHeaderNavWithCapabilities";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useUserId } from "@/hooks/useUserId";
import type { GlobalHeaderProps } from "./headerTypes";
import { defaultMenuItems } from "./headerTypes";

export function GlobalHeader(props: GlobalHeaderProps) {
  const {
    menuItems = defaultMenuItems,
    showHamburger = true,
    className = "",
    hideWebGlobalChrome = false,
  } = props;
  const bridge = useBridge();
  const { isNativeApp } = bridge;
  const hideGlobalChromeRow = hideWebGlobalChrome || isNativeApp;
  const bridgeRouter = useBridgeRouter();
  const pathname = usePathname();
  const userId = useUserId();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMenuOpen(false);

  useNativeGlobalHeaderSync(
    isNativeApp
      ? {
          showHamburger,
          onLogoPress: () => {
            void bridgeRouter.push("/");
          },
          onHamburgerPress: toggleMenu,
        }
      : null,
    bridge,
  );

  const hamburger = showHamburger ? (
    <HamburgerButton
      isMenuOpen={isMenuOpen}
      onToggle={toggleMenu}
      ariaControlsId="mobile-dropdown-menu"
    />
  ) : null;

  useScrollLock(isMenuOpen);

  useClickOutside(headerRef, () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  });

  const webHamburger = hideGlobalChromeRow ? null : hamburger;

  const mainNav = (
    <nav aria-label="메인 네비게이션">
      {userId != null ? (
        <Suspense
          fallback={
            <GlobalHeaderNavGuest
              pathname={pathname}
              menuItems={menuItems}
              isMenuOpen={isMenuOpen}
              onMobileMenuClose={closeMobileMenu}
              mobileMenuId="mobile-dropdown-menu"
              hamburger={webHamburger}
            />
          }
        >
          <GlobalHeaderNavWithCapabilities
            pathname={pathname}
            menuItems={menuItems}
            isMenuOpen={isMenuOpen}
            onMobileMenuClose={closeMobileMenu}
            mobileMenuId="mobile-dropdown-menu"
            hamburger={webHamburger}
          />
        </Suspense>
      ) : (
        <GlobalHeaderNavGuest
          pathname={pathname}
          menuItems={menuItems}
          isMenuOpen={isMenuOpen}
          onMobileMenuClose={closeMobileMenu}
          mobileMenuId="mobile-dropdown-menu"
          hamburger={webHamburger}
        />
      )}
    </nav>
  );

  return (
    <header
      ref={headerRef}
      className={cn(
        "relative z-50",
        !hideGlobalChromeRow && "bg-black/20 backdrop-blur-[0.625rem]",
        className,
      )}
    >
      {hideGlobalChromeRow ? (
        mainNav
      ) : (
        <div className="flex justify-between items-center px-4 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center gap-3 lg:gap-4">
            <Link
              href="/"
              className="flex items-center"
              aria-label="홈으로 가기"
            >
              <Icon src={logoOvr} alt="OVR Logo" className="w-23 h-12" nofill />
            </Link>
          </div>
          {mainNav}
        </div>
      )}
    </header>
  );
}
