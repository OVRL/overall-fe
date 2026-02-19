"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface MenuItem {
  label: string;
  href: string;
}

interface HeaderProps {
  menuItems?: MenuItem[];
  showHamburger?: boolean;
  onMenuClick?: () => void;
}

const defaultMenuItems: MenuItem[] = [
  { label: "팀 관리", href: "/team-management" },
  { label: "팀 데이터", href: "/team-data" },
  { label: "선수 목록", href: "#" },
  { label: "경기 기록", href: "/formation" },
  { label: "경기 일정", href: "#" },
];

/**
 * 공통 헤더 컴포넌트
 */
export default function Header({
  menuItems = defaultMenuItems,
  showHamburger = true,
}: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="relative bg-surface-primary border-b border-gray-800 z-50">
      <div className="flex justify-between items-center px-4 lg:px-8 py-3 lg:py-4">
        {/* 로고 */}
        <div className="flex items-center gap-3 lg:gap-4">
          <Link href="/home" className="relative w-16 lg:w-20 h-8 lg:h-10">
            <Image
              src="/images/logo_OVR_head.png"
              alt="OVR Logo"
              fill
              className="object-contain"
              priority
            />
          </Link>
        </div>

        {/* 네비게이션 */}
        <nav aria-label="메인 네비게이션">
          <div className="flex items-center gap-6 lg:gap-10">
            {/* 데스크톱 메뉴 */}
            <ul className="hidden lg:flex items-center gap-8">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`text-sm transition-colors px-3 py-1.5 rounded-lg ${
                        isActive
                          ? "bg-primary text-black font-bold"
                          : "text-gray-500 hover:text-white"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* 햄버거 버튼 */}
            {showHamburger && (
              <button
                onClick={toggleMenu}
                className="lg:hidden text-white hover:text-primary transition-colors text-xl cursor-pointer p-2"
                aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
                aria-expanded={isMenuOpen}
              >
                ≡
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {isMenuOpen && (
        <nav
          className="lg:hidden absolute top-full left-0 w-full bg-surface-secondary border-b border-gray-700 shadow-xl overflow-hidden animate-slideDown"
          aria-label="모바일 네비게이션"
        >
          <ul className="flex flex-col p-4 gap-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block text-sm py-3 px-4 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-black font-bold"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
