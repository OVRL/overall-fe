"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MenuItem {
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
    { label: "팀 관리", href: "/home" },
    { label: "팀 데이터", href: "/team-data" },
    { label: "선수 목록", href: "#" },
    { label: "경기 기록", href: "#" },
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
        <span className="text-black text-xs lg:text-sm font-medium truncate max-w-[80px] lg:max-w-none">{selectedTeam}</span>
        <span className="text-black text-xs">▼</span>
    </button>
);

/**
 * 헤더 네비게이션 컴포넌트 (데스크톱 메뉴 + 햄버거 버튼)
 */
const HeaderNavigation = ({
    menuItems,
    showHamburger,
    onMenuClick
}: {
    menuItems: MenuItem[];
    showHamburger: boolean;
    onMenuClick?: () => void;
}) => (
    <div className="flex items-center gap-6 lg:gap-10">
        {/* 데스크톱 메뉴 */}
        <div className="hidden lg:flex items-center gap-10">
            {menuItems.map((item) => (
                <a
                    key={item.label}
                    href={item.href}
                    className="text-gray-500 hover:text-white transition-colors text-sm"
                >
                    {item.label}
                </a>
            ))}
        </div>

        {/* 햄버거 버튼 */}
        {showHamburger && (
            <button
                onClick={onMenuClick}
                className="text-white hover:text-primary transition-colors text-xl cursor-pointer"
                aria-label="메뉴"
            >
                ≡
            </button>
        )}
    </div>
);

/**
 * 공통 헤더 컴포넌트 (HTML 스타일 기반)
 */
export default function Header({
    showTeamSelector = false,
    selectedTeam = "바르셀로나 FC",
    menuItems = defaultMenuItems,
    showHamburger = true,
    onTeamSelect,
    onMenuClick,
}: HeaderProps) {
    return (
        <nav className="flex justify-between items-center px-4 lg:px-8 py-3 lg:py-4 bg-surface-primary border-b border-gray-800">
            {/* 왼쪽: 로고 + 팀 선택기 */}
            <div className="flex items-center gap-3 lg:gap-4">
                <Link href="/home" className="relative w-16 lg:w-20 h-8 lg:h-10">
                    <Image
                        src="/images/logo_OVR_head.png"
                        alt="OVR Logo"
                        fill
                        className="object-contain"
                    />
                </Link>

                {/* 팀 선택 */}
                {showTeamSelector && (
                    <TeamSelector selectedTeam={selectedTeam} onClick={onTeamSelect} />
                )}
            </div>

            {/* 오른쪽: 메뉴 및 햄버거 */}
            <HeaderNavigation
                menuItems={menuItems}
                showHamburger={showHamburger}
                onMenuClick={onMenuClick}
            />
        </nav>
    );
}
