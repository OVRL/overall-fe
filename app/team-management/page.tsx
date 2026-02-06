"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import TeamManagementSidebar, {
    TeamManagementMenu,
    TeamRole
} from "@/components/team-management/TeamManagementSidebar";
import TeamSettingsPanel from "@/components/team-management/TeamSettingsPanel";
import PlayerManagementPanel from "@/components/team-management/PlayerManagementPanel";
import BestElevenPanel from "@/components/team-management/BestElevenPanel";
import InvitationPanel from "@/components/team-management/InvitationPanel";
import MOMVotePanel from "@/components/team-management/MOMVotePanel";

export default function TeamManagementPage() {
    const [activeMenu, setActiveMenu] = useState<TeamManagementMenu>("settings");

    // Mock: 현재 사용자 역할 (실제로는 인증 상태에서 가져옴)
    const userRole: TeamRole = "manager";

    const renderPanel = () => {
        switch (activeMenu) {
            case "settings":
                return <TeamSettingsPanel userRole={userRole} />;
            case "players":
                return <PlayerManagementPanel />;
            case "best-eleven":
                return <BestElevenPanel />;
            case "invitation":
                return <InvitationPanel />;
            case "mom-vote":
                return <MOMVotePanel />;
            default:
                return <TeamSettingsPanel userRole={userRole} />;
        }
    };

    return (
        <div className="min-h-screen bg-surface-primary">
            <Header showTeamSelector selectedTeam="바르셀로나 FC" />

            <div className="flex">
                {/* 좌측 사이드바 */}
                <TeamManagementSidebar
                    activeMenu={activeMenu}
                    onMenuChange={setActiveMenu}
                    userRole={userRole}
                />

                {/* 메인 콘텐츠 영역 */}
                <main className="flex-1 overflow-auto">
                    {renderPanel()}
                </main>
            </div>
        </div>
    );
}

