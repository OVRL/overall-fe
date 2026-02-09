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
    showTeamSelector?: boolean;
    selectedTeam?: string;
    menuItems?: MenuItem[];
    showHamburger?: boolean;
    onTeamSelect?: () => void;
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
 * 팀 선택기 컴포넌트
 */
const TeamSelector = ({
    selectedTeam,
    onClick
}: {
    selectedTeam: string;
    onClick?: () => void;
}) => (
    <button
        onClick={onClick}
        className="flex items-center gap-1.5 lg:gap-2 bg-primary px-3 lg:px-4 py-1.5 lg:py-2 rounded-full cursor-pointer hover:bg-primary-hover transition-colors"
    >
        <div className="w-4 lg:w-5 h-4 lg:h-5 bg-[#004d98] rounded-full relative overflow-hidden">
            <Image
                src="/images/ovr.png"
                alt="Team"
                fill
                className="object-cover"
            />
        </div>

        <span className="text-black text-xs">▼</span>
    </button>
);

const HeaderNavigation = ({
    menuItems,
    showHamburger,
    onMenuClick,
    activePath
}: {
    menuItems: MenuItem[];
    showHamburger: boolean;
    onMenuClick?: () => void;
    activePath: string;
}) => (
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

/**
 * 공통 헤더 컴포넌트
 */
export default function Header({
    showTeamSelector = false,
    selectedTeam = "바르셀로나 FC",
    menuItems = defaultMenuItems,
    showHamburger = true,
    onTeamSelect,
}: HeaderProps) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="relative bg-surface-primary border-b border-gray-800 z-50">
            <div className="flex justify-between items-center px-4 lg:px-8 py-3 lg:py-4">
                {/* 로고 + 팀 선택기 */}
                <div className="flex items-center gap-3 lg:gap-4">
                    <Link href="/home" className="relative w-16 lg:w-20 h-8 lg:h-10">
                        <Image
                            src="/images/logo_OVR_head.png"
                            alt="OVR Logo"
                            fill
                            className="object-contain"
                        />
                    </Link>


                </div>

                {/* 네비게이션 */}
                <HeaderNavigation
                    menuItems={menuItems}
                    showHamburger={showHamburger}
                    onMenuClick={toggleMenu}
                    activePath={pathname}
                />
            </div>

            {/* 모바일 메뉴 드롭다운 */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-surface-secondary border-b border-gray-700 shadow-xl overflow-hidden animate-slideDown">
                    <div className="flex flex-col p-4 gap-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`text-sm py-3 px-4 rounded-lg transition-colors ${isActive
                                        ? "bg-primary text-black font-bold"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}
