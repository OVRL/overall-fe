"use client";

import { useState, useCallback, useMemo } from "react";
import RosterDetail from "./RosterDetail";
import RosterList from "./RosterList";
import { useFindManyTeamMember } from "./useFindManyTeamMemberQuery";
import type { RosterMember } from "./useFindManyTeamMemberQuery";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";

interface PlayerRosterPanelProps {
  className?: string;
}

/** teamId가 있을 때만 Relay 쿼리 실행 (훅 조건부 호출 방지를 위해 분리) */
function PlayerRosterPanelWithTeam({
  teamId,
  className,
}: {
  teamId: number;
  className?: string;
}) {
  const { members } = useFindManyTeamMember(teamId);
  const [selectedMember, setSelectedMember] = useState<RosterMember | null>(
    null,
  );

  const handleMemberSelect = useCallback((member: RosterMember) => {
    setSelectedMember(member);
  }, []);

  const displayMember = useMemo(
    () => selectedMember ?? members[0] ?? null,
    [selectedMember, members],
  );

  return (
    <aside className={`h-full p-4 flex flex-col gap-3  ${className}`}>
      {displayMember && <RosterDetail member={displayMember} />}
      <RosterList members={members} onMemberSelect={handleMemberSelect} />
    </aside>
  );
}

const PlayerRosterPanel = ({ className }: PlayerRosterPanelProps) => {
  const { selectedTeamIdNum } = useSelectedTeamId();

  if (selectedTeamIdNum == null) {
    return (
      <aside
        className={`h-full p-4 flex flex-col gap-3  ${className ?? ""}`}
        aria-label="로스터"
      >
        <p className="text-sm text-Label-Tertiary">
          팀을 선택하면 로스터가 표시됩니다.
        </p>
      </aside>
    );
  }

  return (
    <PlayerRosterPanelWithTeam
      key={selectedTeamIdNum}
      teamId={selectedTeamIdNum}
      className={className}
    />
  );
};

export default PlayerRosterPanel;
