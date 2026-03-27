"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { TeamMemberRole } from "@/lib/permissions/teamMemberRole";
import Link from "next/link";

export type TeamManagementMenu =
    | "settings"
    | "match-record"
    | "players"
    | "best-eleven"
    | "invitation"
    | "mom-vote"
    | "deleted-players";

interface MenuItem {
    id: TeamManagementMenu;
    label: string;
    icon: React.ReactNode;
    href: string;
}

// SVG 아이콘 컴포넌트들
const SettingsIcon = ({ active }: { active: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
            d="M9 11.25a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5Z"
            stroke={active ? "#000" : "#888"}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M14.57 11.13a1.2 1.2 0 0 0 .24 1.32l.04.04a1.46 1.46 0 0 1-2.06 2.06l-.04-.04a1.2 1.2 0 0 0-1.32-.24 1.2 1.2 0 0 0-.73 1.1v.12a1.45 1.45 0 0 1-2.9 0v-.06A1.2 1.2 0 0 0 7 14.34a1.2 1.2 0 0 0-1.32.24l-.04.04a1.46 1.46 0 0 1-2.06-2.06l.04-.04A1.2 1.2 0 0 0 3.86 11a1.2 1.2 0 0 0-1.1-.73H2.63a1.45 1.45 0 0 1 0-2.9h.06A1.2 1.2 0 0 0 3.78 6.6a1.2 1.2 0 0 0-.24-1.32l-.04-.04a1.46 1.46 0 0 1 2.06-2.06l.04.04A1.2 1.2 0 0 0 6.92 3.46a1.2 1.2 0 0 0 .73-1.1V2.27a1.45 1.45 0 0 1 2.9 0v.06a1.2 1.2 0 0 0 .73 1.1 1.2 1.2 0 0 0 1.32-.24l.04-.04a1.46 1.46 0 0 1 2.06 2.06l-.04.04A1.2 1.2 0 0 0 14.42 6.6a1.2 1.2 0 0 0 1.1.73h.13a1.45 1.45 0 0 1 0 2.9h-.06a1.2 1.2 0 0 0-1.02.9Z"
            stroke={active ? "#000" : "#888"}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const PlayersIcon = ({ active }: { active: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="7" cy="6" r="2.5" stroke={active ? "#000" : "#888"} strokeWidth="1.4" />
        <circle cx="12.5" cy="6.5" r="2" stroke={active ? "#000" : "#888"} strokeWidth="1.4" />
        <path
            d="M1.5 15c0-2.76 2.46-5 5.5-5s5.5 2.24 5.5 5"
            stroke={active ? "#000" : "#888"}
            strokeWidth="1.4"
            strokeLinecap="round"
        />
        <path
            d="M12.5 10c1.93 0 3.5 1.57 3.5 3.5"
            stroke={active ? "#000" : "#888"}
            strokeWidth="1.4"
            strokeLinecap="round"
        />
    </svg>
);

const MOMIcon = ({ active }: { active: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="3" width="14" height="11" rx="2" stroke={active ? "#000" : "#888"} strokeWidth="1.4" />
        <path d="M6 6l2 2 4-4" stroke={active ? "#000" : "#888"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 16h8" stroke={active ? "#000" : "#888"} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M9 14v2" stroke={active ? "#000" : "#888"} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);

const BestElevenIcon = ({ active }: { active: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke={active ? "#000" : "#888"} strokeWidth="1.4" />
        <path
            d="M9 5l.9 2.76H13L10.55 9.24l.9 2.76L9 10.52l-2.45 1.48.9-2.76L5 7.76h3.1L9 5Z"
            fill={active ? "#000" : "#888"}
        />
    </svg>
);

const InvitationIcon = ({ active }: { active: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="10" rx="1.5" stroke={active ? "#000" : "#888"} strokeWidth="1.4" />
        <path d="M2 6l7 5 7-5" stroke={active ? "#000" : "#888"} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);

const MatchRecordIcon = ({ active }: { active: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="2" width="12" height="14" rx="1.5" stroke={active ? "#000" : "#888"} strokeWidth="1.4" />
        <path d="M6 6h6M6 9h6M6 12h4" stroke={active ? "#000" : "#888"} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
);

const menuItems: MenuItem[] = [
    {
        id: "settings",
        label: "팀 설정",
        icon: null,
        href: "/team-management/settings",
    },
    {
        id: "match-record",
        label: "경기 기록 관리",
        icon: null,
        href: "/team-management/match-record",
    },
    {
        id: "players",
        label: "선수 관리",
        icon: null,
        href: "/team-management/players",
    },
    {
        id: "invitation",
        label: "가입 신청 관리",
        icon: null,
        href: "/team-management/invitation",
    },
    {
        id: "mom-vote",
        label: "MOM 투표 설정",
        icon: null,
        href: "/team-management/mom",
    },
    {
        id: "best-eleven",
        label: "베스트11 관리",
        icon: null,
        href: "/team-management/best11",
    },
    {
        id: "deleted-players",
        label: "방출 명단 관리",
        icon: null,
        href: "/team-management/deleted-players",
    },
];

const getIcon = (id: TeamManagementMenu, active: boolean) => {
    switch (id) {
        case "settings": return <SettingsIcon active={active} />;
        case "match-record": return <MatchRecordIcon active={active} />;
        case "players": return <PlayersIcon active={active} />;
        case "mom-vote": return <MOMIcon active={active} />;
        case "best-eleven": return <BestElevenIcon active={active} />;
        case "invitation": return <InvitationIcon active={active} />;
        case "deleted-players": return <PlayersIcon active={active} />; // 기존 선수 아이콘 재활용 또는 별도 아이콘
    }
};

interface TeamManagementSidebarProps {
    activeMenu: TeamManagementMenu;
    userRole: TeamMemberRole;
}

export default function TeamManagementSidebar({
    activeMenu,
    userRole,
}: TeamManagementSidebarProps) {
    const isManagerOrCoach =
        userRole === "MANAGER" || userRole === "COACH";

    if (!isManagerOrCoach) {
        return (
            <aside className="w-48 bg-black border-r border-white/8 p-4">
                <p className="text-gray-500 text-sm">관리 권한이 없습니다.</p>
            </aside>
        );
    }

    return (
        <aside className="w-48 bg-black border-r border-white/8 shrink-0 pt-6 h-full">
            <nav className="flex flex-col gap-0.5 px-3">
                {menuItems.map((item) => {
                    const isActive = activeMenu === item.id;
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all",
                                isActive
                                    ? "bg-primary text-black"
                                    : "text-gray-400 hover:text-white hover:bg-white/6"
                            )}
                        >
                            {getIcon(item.id, isActive)}
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
