"use client";

import Link from "next/link";
import { MenuItem } from "@/components/layout/Header";

interface HeaderNavigationProps {
    menuItems: MenuItem[];
    showHamburger: boolean;
    onMenuClick?: () => void;
    activePath: string;
}

/**
 * 헤더 네비게이션 컴포넌트
 */
const HeaderNavigation = ({
    menuItems,
    showHamburger,
    onMenuClick,
    activePath
}: HeaderNavigationProps) => (
    <div className="flex items-center gap-6 lg:gap-10">
        {/* 데스크톱 메뉴 */}
        <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => {
                const isActive = activePath === item.href;
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`text-sm transition-colors px-3 py-1.5 rounded-lg ${isActive
                            ? "bg-primary text-black font-bold"
                            : "text-gray-500 hover:text-white"
                            }`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </div>

        {/* 햄버거 버튼 */}
        {showHamburger && (
            <button
                onClick={onMenuClick}
                className="lg:hidden text-white hover:text-primary transition-colors text-xl cursor-pointer p-2"
                aria-label="메뉴"
            >
                ≡
            </button>
        )}
    </div>
);

export default HeaderNavigation;
