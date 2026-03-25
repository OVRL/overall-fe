"use client";

import TeamSettingsPanel from "@/components/team-management/TeamSettingsPanel";
import type { TeamMemberRole } from "@/lib/permissions/teamMemberRole";

export default function TeamSettingsPage() {
  // Mock: 현재 사용자 역할 (실제로는 인증 상태에서 가져옴)
  const userRole: TeamMemberRole = "MANAGER";

  return <TeamSettingsPanel userRole={userRole} />;
}
