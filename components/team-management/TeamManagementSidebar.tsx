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

import { Settings, ClipboardList, Users, UserPlus, FileCheck, Award, UserMinus } from "lucide-react";

// SVG 아이콘 컴포넌트들 대신 Lucide-react 아이콘을 사용하도록 래핑
const SettingsIcon = ({ active }: { active: boolean }) => <Settings size={20} strokeWidth={1.4} color={active ? "#000" : "#888"} />;
const PlayersIcon = ({ active }: { active: boolean }) => <Users size={20} strokeWidth={1.4} color={active ? "#000" : "#888"} />;
const MOMIcon = ({ active }: { active: boolean }) => <FileCheck size={20} strokeWidth={1.4} color={active ? "#000" : "#888"} />;
const BestElevenIcon = ({ active }: { active: boolean }) => <Award size={20} strokeWidth={1.4} color={active ? "#000" : "#888"} />;
const InvitationIcon = ({ active }: { active: boolean }) => <UserPlus size={20} strokeWidth={1.4} color={active ? "#000" : "#888"} />;
const MatchRecordIcon = ({ active }: { active: boolean }) => <ClipboardList size={20} strokeWidth={1.4} color={active ? "#000" : "#888"} />;
const DeletedPlayersIcon = ({ active }: { active: boolean }) => <UserMinus size={20} strokeWidth={1.4} color={active ? "#000" : "#888"} />;

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
    // {
    //     id: "deleted-players",
    //     label: "방출 명단 관리",
    //     icon: null,
    //     href: "/team-management/deleted-players",
    // },
    {
        id: "invitation",
        label: "선수 입단 관리",
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
];

const getIcon = (id: TeamManagementMenu, active: boolean) => {
    switch (id) {
        case "settings": return <SettingsIcon active={active} />;
        case "match-record": return <MatchRecordIcon active={active} />;
        case "players": return <PlayersIcon active={active} />;
        case "mom-vote": return <MOMIcon active={active} />;
        case "best-eleven": return <BestElevenIcon active={active} />;
        case "invitation": return <InvitationIcon active={active} />;
        case "deleted-players": return <DeletedPlayersIcon active={active} />;
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
