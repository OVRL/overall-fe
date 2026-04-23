"use client";

import { useState, useCallback, useMemo } from "react";
import RosterDetail from "./RosterDetail";
import RosterList from "./RosterList";
import { useFindManyTeamMember } from "./useFindManyTeamMemberQuery";
import type { RosterMember } from "./useFindManyTeamMemberQuery";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { parseUserId, useUserId } from "@/hooks/useUserId";

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
  const currentUserId = useUserId();
  const [selectedMember, setSelectedMember] = useState<RosterMember | null>(
    null,
  );

  const handleMemberSelect = useCallback((member: RosterMember) => {
    setSelectedMember(member);
  }, []);

  /** 선택 없을 때: 로그인 유저가 로스터에 있으면 본인, 아니면 목록 첫 멤버 */
  const defaultMember = useMemo(() => {
    if (members.length === 0) return null;
    if (currentUserId == null) return members[0] ?? null;
    const mine = members.find((m) => {
      const relayUserId = m.user?.id;
      if (relayUserId == null) return false;
      return parseUserId(relayUserId) === currentUserId;
    });
    return mine ?? members[0] ?? null;
  }, [members, currentUserId]);

  const displayMember = useMemo(
    () => selectedMember ?? defaultMember,
    [selectedMember, defaultMember],
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
