"use client";

import { ReactNode, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { type StaticImageData } from "next/image";
import Link from "@/components/Link";
import logoOvr from "@/public/icons/logo_OVR.svg";
import Icon from "@/components/ui/Icon";
import RegisterGameButton from "@/components/layout/header/RegisterGameButton";
import { HamburgerButton } from "@/components/layout/header/HamburgerButton";
import { MobileNavDropdown } from "@/components/layout/header/MobileNavDropdown";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useClickOutside } from "@/hooks/useClickOutside";
export interface MenuItem {
  label: string;
  href: string;
}

const defaultMenuItems: MenuItem[] = [
  { label: "팀 관리", href: "/team-management" },
  { label: "선수 기록", href: "/team-data" },
  { label: "경기 일정", href: "#" },
];

export interface ActionButton {
  icon: StaticImageData;
  onClick: () => void;
  alt: string;
  nofill?: boolean;
}

type BaseHeaderProps = {
  className?: string;
  transparent?: boolean;
};

type GlobalHeaderProps = BaseHeaderProps & {
  variant: "global";
  menuItems?: MenuItem[];
  showHamburger?: boolean;
};

type LeftActionProp = {
  leftAction?: ActionButton;
};

type RightActionProp = {
  rightAction?: ActionButton;
};

/** 오른쪽에 텍스트 버튼을 쓸 때 (rightAction 대신 사용) */
type RightLabelProp = {
  rightLabel?: string;
  onRightClick?: () => void;
};

export type WithCenter = BaseHeaderProps & {
  variant?: "topbar";
  title?: string;
  logo?: ReactNode;
} & (
    | { title: string; logo?: ReactNode }
    | { title?: string; logo: ReactNode }
  ) &
  LeftActionProp &
  RightActionProp &
  RightLabelProp;

export type WithoutCenter = BaseHeaderProps & {
  variant?: "topbar";
  title?: never;
  logo?: never;
} & {
  leftAction?: ActionButton;
  rightAction?: ActionButton;
} & RightLabelProp;

export type HeaderProps = GlobalHeaderProps | WithCenter | WithoutCenter;

const GlobalHeader = (props: GlobalHeaderProps) => {
  const {
    menuItems = defaultMenuItems,
    showHamburger = true,
    className = "",
  } = props;
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // 모바일 메뉴 오픈 시 바디 스크롤 방지
  useScrollLock(isMenuOpen);

  // 외부 영역 클릭 시 메뉴 닫기
  useClickOutside(headerRef, () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  });

  return (
    <header
      ref={headerRef}
      className={`relative bg-black/20 backdrop-blur-[0.625rem] z-50 ${className}`}
    >
      <div className="flex justify-between items-center px-4 lg:px-8 py-3 lg:py-4">
        {/* 로고 */}
        <div className="flex items-center gap-3 lg:gap-4">
          <Link
            href="/home"
            className="flex items-center"
            aria-label="홈으로 가기"
          >
            <Icon src={logoOvr} alt="OVR Logo" className="w-23 h-12" nofill />
          </Link>
        </div>

        {/* 네비게이션 */}
        <nav aria-label="메인 네비게이션">
          <div className="flex items-center gap-6 lg:gap-10">
            {/* 데스크톱 메뉴 */}
            <ul className="hidden lg:flex items-center gap-8 text-[0.9375rem]">
              <RegisterGameButton />
              {menuItems.map((item) => {
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


            <HamburgerButton
              isMenuOpen={isMenuOpen}
              onToggle={toggleMenu}
              ariaControlsId="mobile-dropdown-menu"
            />
          </div>
        </nav>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {isMenuOpen && (
        <MobileNavDropdown
          menuItems={menuItems}
          currentPathname={pathname}
          onLinkClick={() => setIsMenuOpen(false)}
          id="mobile-dropdown-menu"
        />
      )}
    </header>
  );
};

const TopbarHeader = (props: WithCenter | WithoutCenter) => {
  const {
    className,
    leftAction,
    rightAction,
    rightLabel,
    onRightClick,
    transparent,
    title,
    logo,
  } = props;

  return (
    <header
      className={`
        sticky top-0 z-50 flex w-full items-center justify-between p-4
        transition-colors duration-200
        ${transparent ? "bg-transparent" : "bg-background/80 backdrop-blur-md"}
        ${className ?? ""}
      `}
    >
      <div className="flex flex-1 items-center justify-start">
        {leftAction && (
          <button
            onClick={leftAction.onClick}
            className="flex items-center justify-center p-3 hover:bg-gray-100/10 active:scale-95 transition-all cursor-pointer"
            aria-label={leftAction.alt}
          >
            <Icon
              src={leftAction.icon}
              alt={leftAction.alt}
              width={24}
              height={24}
              nofill={leftAction.nofill}
            />
          </button>
        )}
      </div>

      <div className="flex flex-auto items-center justify-center shrink-0">
        {logo ? (
          <div className="flex items-center justify-center">{logo}</div>
        ) : title ? (
          <h2 className="text-xl font-bold truncate max-w-50 text-center text-white">
            {title}
          </h2>
        ) : null}
      </div>

      <div className="flex flex-1 items-center justify-end">
        {rightLabel != null && onRightClick != null ? (
          <button
            type="button"
            onClick={onRightClick}
            className="flex items-center justify-center px-3 py-3 text-body-m text-white hover:opacity-80 active:scale-95 transition-all cursor-pointer"
            aria-label={rightLabel}
          >
            {rightLabel}
          </button>
        ) : rightAction ? (
          <button
            onClick={rightAction.onClick}
            className="flex items-center justify-center p-3 hover:bg-gray-100/10 active:scale-95 transition-all cursor-pointer"
            aria-label={rightAction.alt}
          >
            <Icon
              src={rightAction.icon}
              alt={rightAction.alt}
              width={24}
              height={24}
              nofill={rightAction.nofill}
            />
          </button>
        ) : null}
      </div>
    </header>
  );
};

export const Header = (props: HeaderProps) => {
  if (props.variant === "global") {
    return <GlobalHeader {...props} />;
  }
  return <TopbarHeader {...props} />;
};

export default Header;
