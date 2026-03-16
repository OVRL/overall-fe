"use client";

import { useState, useCallback, useMemo } from "react";
import RosterDetail from "./RosterDetail";
import RosterList from "./RosterList";
import { useFindManyTeamMember } from "./useFindManyTeamMemberQuery";
import type { RosterMember } from "./useFindManyTeamMemberQuery";

interface PlayerRosterPanelProps {
  className?: string;
}

const PlayerRosterPanel = ({ className }: PlayerRosterPanelProps) => {
  const { members } = useFindManyTeamMember();
  const [selectedMember, setSelectedMember] = useState<RosterMember | null>(
    null,
  );

  const handleMemberSelect = useCallback((member: RosterMember) => {
    setSelectedMember(member);
  }, []);

  // 선택된 멤버가 없으면 첫 번째 멤버 표시 (파생 상태로 캐스케이딩 렌더 방지)
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
};

export default PlayerRosterPanel;
