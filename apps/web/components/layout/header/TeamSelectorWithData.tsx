"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TeamSelector, {
  type TeamOption,
} from "@/components/layout/header/TeamSelector";
import { useFindTeamMemberForHeader } from "@/components/layout/header/useFindTeamMemberForHeaderQuery";
import {
  isSameTeamId,
  normalizeRelayTeamGlobalId,
} from "@/lib/relay/parseRelayGlobalId";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { useUserId } from "@/hooks/useUserId";

const DEFAULT_TEAM_IMAGE = "/images/ovr.png";

/**
 * findTeamMember 결과를 TeamSelector용 TeamOption[]으로 변환합니다.
 * 초기 선택값/팀 1개 처리는 layout SSR에서 하고, 여기서는 목록에 없는 선택만 정리합니다.
 */
function useTeamSelectorData() {
  const members = useFindTeamMemberForHeader();
  const { selectedTeamId, setSelectedTeamId } = useSelectedTeamId();

  const teams: TeamOption[] = useMemo(() => {
    return members
      .filter(
        (m): m is typeof m & { team: NonNullable<typeof m.team> } =>
          m.team != null,
      )
      .map((m) => ({
        id: normalizeRelayTeamGlobalId(m.team.id) ?? String(m.team.id),
        name: m.team.name ?? "",
        imageUrl: m.team.emblem || DEFAULT_TEAM_IMAGE,
      }));
  }, [members]);

  // 저장된 선택이 현재 목록에 없으면 초기화 (팀 탈퇴 등)
  useEffect(() => {
    if (teams.length === 0) {
      if (selectedTeamId != null) setSelectedTeamId(null);
      return;
    }
    const currentInList =
      selectedTeamId != null && teams.some((t) => isSameTeamId(selectedTeamId, t.id));
    if (!currentInList && selectedTeamId != null) {
      setSelectedTeamId(null);
    }
  }, [teams, selectedTeamId, setSelectedTeamId]);

  return { teams, members, selectedTeamId, setSelectedTeamId };
}

function TeamSelectorWithDataInner({
  onAfterSelect,
  onAfterCreateTeam,
}: {
  onAfterSelect?: () => void;
  onAfterCreateTeam?: () => void;
}) {
  const router = useRouter();
  const { teams, members, selectedTeamId, setSelectedTeamId } =
    useTeamSelectorData();

  const handleSelect = (teamId: string) => {
    const member = members.find(
      (m) => m.team != null && isSameTeamId(m.team.id, teamId),
    );
    setSelectedTeamId(teamId, member?.teamId);
    onAfterSelect?.();
  };

  const handleCreateTeam = () => {
    router.push("/create-team");
    onAfterCreateTeam?.();
  };

  return (
    <TeamSelector
      teams={teams}
      selectedTeamId={selectedTeamId}
      onSelect={handleSelect}
      onCreateTeam={handleCreateTeam}
    />
  );
}

type TeamSelectorWithDataProps = {
  /** 팀 선택 직후 호출 (예: 모바일 메뉴 닫기) */
  onAfterSelect?: () => void;
  /** 팀 만들기 클릭 직후 호출 (예: 모바일 메뉴 닫기) */
  onAfterCreateTeam?: () => void;
};

/**
 * useUserId + findTeamMember 쿼리 + 선택 팀 쿠키를 연동한 팀 셀렉터.
 * 로그인하지 않았으면 팀 만들기 링크만, 로그인했으면 팀 목록을 서버에서 받아 표시합니다.
 */
export function TeamSelectorWithData({
  onAfterSelect,
  onAfterCreateTeam,
}: TeamSelectorWithDataProps = {}) {
  const userId = useUserId();

  // 로그인하지 않음: 팀 만들기로 이동하는 링크만 표시 (선택기 아님)
  if (userId === null) {
    return (
      <Link
        href="/create-team"
        className="flex items-center gap-1 rounded-[1.25rem] border border-border-card bg-surface-card px-3 py-1.5 transition-colors w-38 hover:bg-surface-elevated"
      >
        <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
          <Image
            src={DEFAULT_TEAM_IMAGE}
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <span className="truncate text-sm font-semibold text-Label-Primary">
          팀 만들기
        </span>
      </Link>
    );
  }

  return (
    <TeamSelectorWithDataInner
      onAfterSelect={onAfterSelect}
      onAfterCreateTeam={onAfterCreateTeam}
    />
  );
}

export default TeamSelectorWithData;
