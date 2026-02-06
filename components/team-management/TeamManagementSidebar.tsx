"use client";

import { cn } from "@/lib/utils";

export type TeamRole = "manager" | "coach" | "player";

export type TeamManagementMenu =
    | "settings"
    | "players"
    | "best-eleven"
    | "invitation"
    | "mom-vote";

interface MenuItem {
    id: TeamManagementMenu;
    label: string;
    icon: string;
    managerOnly?: boolean;
}

const menuItems: MenuItem[] = [
    { id: "settings", label: "팀 설정", icon: "⚙️" },
    { id: "players", label: "선수 관리", icon: "👥" },
    { id: "best-eleven", label: "베스트 11", icon: "⭐" },
    { id: "invitation", label: "초대 관리", icon: "📨" },
    { id: "mom-vote", label: "MOM 투표", icon: "🏆" },
];

interface TeamManagementSidebarProps {
    activeMenu: TeamManagementMenu;
    onMenuChange: (menu: TeamManagementMenu) => void;
    userRole: TeamRole;
}

export default function TeamManagementSidebar({
    activeMenu,
    onMenuChange,
    userRole,
}: TeamManagementSidebarProps) {
    // 선수는 메뉴 접근 불가 (조회 전용)
    const isManagerOrCoach = userRole === "manager" || userRole === "coach";

    if (!isManagerOrCoach) {
        return (
            <aside className="w-64 bg-surface-secondary border-r border-gray-800 p-4">
                <p className="text-gray-500 text-sm">관리 권한이 없습니다.</p>
            </aside>
        );
    }

    return (
        <aside className="w-64 bg-surface-secondary border-r border-gray-800 shrink-0">
            <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-bold text-white">팀 관리</h2>
                <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        userRole === "manager" && "bg-primary text-black",
                        userRole === "coach" && "bg-blue-500 text-white",
                    )}>
                        {userRole === "manager" ? "감독" : "코치"}
                    </span>
                </div>
            </div>

            <nav className="p-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onMenuChange(item.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                            activeMenu === item.id
                                ? "bg-primary/10 text-primary"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
}
