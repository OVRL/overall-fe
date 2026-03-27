"use client";

import { usePathname } from "next/navigation";
import TeamManagementSidebar, { TeamManagementMenu } from "@/components/team-management/TeamManagementSidebar";
import TeamManagementFooter from "@/components/team-management/TeamManagementFooter";
import { TeamManagementAccessGuard } from "@/components/team-management/TeamManagementAccessGuard";
import type { TeamMemberRole } from "@/lib/permissions/teamMemberRole";

export default function TeamManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Mock: 현재 사용자 역할 (실제로는 인증 상태에서 가져옴)
  const userRole: TeamMemberRole = "MANAGER";

  // URL에서 현재 활성화된 메뉴 추출
  const getActiveMenu = (): TeamManagementMenu => {
    if (pathname.includes("/team-management/match-record")) return "match-record";
    if (pathname.includes("/team-management/players")) return "players";
    if (pathname.includes("/team-management/best11")) return "best-eleven";
    if (pathname.includes("/team-management/invitation")) return "invitation";
    if (pathname.includes("/team-management/mom")) return "mom-vote";
    if (pathname.includes("/team-management/deleted-players")) return "deleted-players";
    return "settings";
  };

  const activeMenu = getActiveMenu();

  return (
    <TeamManagementAccessGuard>
      <div className="flex-1 bg-surface-primary min-h-screen">
        <div className="flex min-h-screen">
          {/* 좌측 사이드바 (데스크탑) */}
          <div className="hidden md:flex flex-col self-stretch text-white">
            <TeamManagementSidebar
              activeMenu={activeMenu}
              userRole={userRole}
            />
          </div>

          {/* 메인 콘텐츠 영역 */}
          <main className="flex-1 overflow-auto pb-20 md:pb-0">
            {children}
          </main>

          {/* 하단 내비게이션 (모바일) */}
          <TeamManagementFooter
            activeMenu={activeMenu}
          />
        </div>
      </div>
    </TeamManagementAccessGuard>
  );
}
