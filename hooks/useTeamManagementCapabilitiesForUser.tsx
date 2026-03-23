"use client";

import { useMemo } from "react";
import { useFindTeamMemberForHeader } from "@/components/layout/header/useFindTeamMemberForHeaderQuery";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import {
  canRegisterGameForRole,
  canUseTeamManagementStaffFeatures,
  type TeamMemberRole,
} from "@/lib/permissions/teamMemberRole";
import { resolveTeamMemberRoleForSelectedTeam } from "@/lib/relay/selectTeamMemberRole";

export type TeamManagementCapabilities = {
  selectedTeamMemberRole: TeamMemberRole | null;
  canAccessTeamManagementRoute: boolean;
  showRegisterGame: boolean;
};

/**
 * 로그인 확정(userId 있음) 컴포넌트 전용.
 * FindTeamMember는 Layout SSR과 동일 쿼리이므로 store-or-network로 중복 네트워크를 피합니다.
 */
export function useTeamManagementCapabilitiesForUser(
  userId: number,
): TeamManagementCapabilities {
  const { selectedTeamId } = useSelectedTeamId();
  const members = useFindTeamMemberForHeader(userId);

  return useMemo(() => {
    const role = resolveTeamMemberRoleForSelectedTeam(
      members,
      selectedTeamId,
    );
    if (role == null) {
      return {
        selectedTeamMemberRole: null,
        canAccessTeamManagementRoute: false,
        showRegisterGame: false,
      };
    }
    return {
      selectedTeamMemberRole: role,
      canAccessTeamManagementRoute: canUseTeamManagementStaffFeatures(role),
      showRegisterGame: canRegisterGameForRole(role),
    };
  }, [members, selectedTeamId]);
}
