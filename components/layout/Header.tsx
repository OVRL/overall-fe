"use client";

import React from "react";
import Image from "next/image";

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
    { label: "팀 관리", href: "#" },
    { label: "팀 데이터", href: "#" },
    { label: "선수 목록", href: "#" },
    { label: "경기 기록", href: "#" },
    { label: "경기 일정", href: "#" },
];

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
        <nav className="flex justify-between items-center px-8 py-4 bg-surface-primary border-b border-gray-800">
            {/* 왼쪽: 로고 + 팀 선택기 */}
            <div className="flex items-center gap-4">
                <div className="relative w-20 h-10">
                    <Image
                        src="/images/logo_OVR_head.png"
                        alt="OVR Logo"
                        fill
                        className="object-contain"
                    />
                </div>

                {/* 팀 선택 */}
                {showTeamSelector && (
                    <button
                        onClick={onTeamSelect}
                        className="flex items-center gap-2 bg-primary px-4 py-2 rounded-full cursor-pointer hover:bg-primary-hover transition-colors"
                    >
                        <div className="w-5 h-5 bg-[#004d98] rounded-full relative overflow-hidden">
                            <Image
                                src="/images/ovr.png"
                                alt="Team"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-black text-sm font-medium">{selectedTeam}</span>
                        <span className="text-black text-xs">▼</span>
                    </button>
                )}
            </div>

            {/* 오른쪽: 메뉴 */}
            <div className="flex items-center gap-10">
                {menuItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className="text-gray-500 hover:text-white transition-colors text-sm"
                    >
                        {item.label}
                    </a>
                ))}

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
        </nav>
    );
}
