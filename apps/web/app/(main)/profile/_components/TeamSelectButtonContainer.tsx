"use client";

import { useMemo } from "react";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { useBridgeRouter } from "@/hooks/bridge/useBridgeRouter";
import {
  parseNumericIdFromRelayGlobalId,
  isSameTeamId,
  normalizeRelayTeamGlobalId,
} from "@/lib/relay/parseRelayGlobalId";
import TeamButton from "./TeamButton";
import type { ProfileTeamMemberRow } from "../types/profileTeamMemberTypes";

export type { ProfileTeamMemberRow };

type TeamSelectButtonContainerProps = {
  members: ReadonlyArray<ProfileTeamMemberRow>;
};

import { useIsMobile } from "@/hooks/useIsMobile";
import Dropdown from "@/components/ui/Dropdown";

const TeamSelectButtonContainer = ({
  members,
}: TeamSelectButtonContainerProps) => {
  const router = useBridgeRouter();
  const { selectedTeamId, setSelectedTeamId } = useSelectedTeamId();

  const teams = useMemo(() => {
    return members
      .filter(
        (m): m is typeof m & { team: NonNullable<typeof m.team> } =>
          m.team != null,
      )
      .map((m) => ({
        id: normalizeRelayTeamGlobalId(m.team.id) ?? String(m.team.id),
        name: m.team.name ?? "",
        imageUrl: m.team.emblem ?? null,
      }));
  }, [members]);

  if (teams.length === 0) {
    return null;
  }

  const handleTeamSelect = (
    teamId: string,
    teamName: string,
    teamImageUrl: string | null,
  ) => {
    const teamIdNum = parseNumericIdFromRelayGlobalId(teamId);
    setSelectedTeamId(teamId, teamIdNum, teamName, teamImageUrl);
    router.refresh();
  };

  return (
    <div className="flex gap-2 overflow-x-auto p-1 scrollbar-hide w-full">
      {teams.map((team) => (
        <div key={team.id} className="flex gap-4 shrink-0 justify-center">
          <TeamButton
            name={team.name}
            imageUrl={team.imageUrl ?? undefined}
            selected={isSameTeamId(selectedTeamId, team.id)}
            onClick={() => handleTeamSelect(team.id, team.name, team.imageUrl)}
          />
        </div>
      ))}
    </div>
  );
};

export default TeamSelectButtonContainer;
