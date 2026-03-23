"use client";

import Link from "@/components/Link";
import RegisterGameButton from "@/components/layout/header/RegisterGameButton";

export type MobileNavItem = {
  label: string;
  href: string;
};

type MobileNavDropdownProps = {
  /** 메뉴 항목 목록 */
  menuItems: MobileNavItem[];
  /** 현재 경로 (활성 링크 판단용) */
  currentPathname: string;
  /** 링크 클릭 시 호출 (메뉴 닫기 등) */
  onLinkClick: () => void;
  /** nav 요소 id (aria-controls와 매칭) */
  id: string;
  /** player 등 일반 멤버는 경기 등록 버튼 미표시 */
  showRegisterGame?: boolean;
};

/**
 * 글로벌 헤더용 모바일 전용 네비게이션 드롭다운.
 * 메뉴 목록·활성 상태·클릭 시 닫기 동작만 담당.
 */
export function MobileNavDropdown({
  menuItems,
  currentPathname,
  onLinkClick,
  id,
  showRegisterGame = true,
}: MobileNavDropdownProps) {
  return (
    <nav
      id={id}
      className="lg:hidden absolute top-full left-0 w-full bg-surface-secondary border-b border-gray-700 shadow-xl overflow-hidden animate-slideDown"
      aria-label="모바일 네비게이션"
    >
      <ul className="flex flex-col p-4 gap-2">
        {showRegisterGame ? <RegisterGameButton /> : null}
        {menuItems.map((item) => {
          const isActive = currentPathname === item.href;
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={onLinkClick}
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
  );
}
