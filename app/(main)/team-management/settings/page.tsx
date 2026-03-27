"use client";

import TeamSettingsPanel from "@/components/team-management/TeamSettingsPanel";
import { useUserId } from "@/hooks/useUserId";
import { useTeamManagementCapabilitiesForUser } from "@/hooks/useTeamManagementCapabilitiesForUser";

export default function TeamSettingsPage() {
  const currentUserId = useUserId() ?? 0;
  
  // 헤더 및 서버에서 보장하는 실제 팀 내 권한을 가져옵니다.
  const { selectedTeamMemberRole } = useTeamManagementCapabilitiesForUser(currentUserId);

  // 권한 정보가 없거나 로딩 전이면 가장 낮은 권한인 PLAYER로 fallback
  const userRole = selectedTeamMemberRole || "PLAYER";

  return <TeamSettingsPanel userRole={userRole} />;
}
