"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { TeamManagementMenu } from "./TeamManagementSidebar";

interface TeamManagementFooterProps {
    activeMenu: TeamManagementMenu;
}

interface MenuItem {
    id: TeamManagementMenu;
    label: string;
    icon: string;
    href: string;
}

const menuItems: MenuItem[] = [
    { id: "settings", label: "팀 설정", icon: "⚙️", href: "/team-management/settings" },
    { id: "match-record", label: "경기기록 관리", icon: "📝", href: "/team-management/match-record" },
    { id: "players", label: "선수 관리", icon: "👥", href: "/team-management/players" },
    { id: "best-eleven", label: "베스트 11", icon: "⭐", href: "/team-management/best11" },
    { id: "invitation", label: "가입 신청 관리", icon: "📨", href: "/team-management/invitation" },
    { id: "mom-vote", label: "MOM 투표", icon: "🏆", href: "/team-management/mom" },
    { id: "deleted-players", label: "방출 관리", icon: "🚫", href: "/team-management/deleted-players" },
];

export default function TeamManagementFooter({
    activeMenu,
}: TeamManagementFooterProps) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 flex justify-around items-center h-16 px-2 z-50 md:hidden pb-safe">
            {menuItems.map((item) => (
                <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                        activeMenu === item.id
                            ? "text-primary"
                            : "text-gray-500 hover:text-gray-300"
                    )}
                >
                    <span className="text-xl leading-none">{item.icon}</span>
                    <span className="text-[10px] font-medium leading-none">{item.label}</span>
                </Link>
            ))}
        </nav>
    );
}
