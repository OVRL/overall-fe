"use client";

import { Suspense, useMemo } from "react";
import { useUserStore } from "@/contexts/UserContext";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import {
  getUserProfileImageFallbackUrl,
  getUserProfileImageRawUrl,
} from "@/lib/playerPlaceholderImage";
import OnboardingManager from "./OnboardingManager";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { useTeamSettingsQuery } from "@/components/team-management/hooks/useTeamSettingsQuery";
import { useMatchRecordsQuery } from "@/components/team-management/hooks/useMatchRecordsQuery";
import { useBestElevenQuery } from "@/components/team-management/hooks/useBestElevenQuery";
import { pickPrimaryBestElevenRow } from "@/lib/formation/pickPrimaryBestElevenRow";
import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";

interface MatchStats {
  total: number;
  wins: number;
  draws: number;
  losses: number;
  winRate: number;
}

function parseScore(description: string | null | undefined): { home: number; away: number } | null {
  if (!description) return null;
  try {
    const parsed = JSON.parse(description);
    if (parsed.score) return parsed.score;
  } catch { /* skip */ }
  return null;
}

const ManagerStatItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-gray-500 text-xs md:text-sm">{label}</p>
    <p className="text-white font-bold text-sm md:text-base">{value}</p>
  </div>
);

function ManagerInfoInner({ teamId }: { teamId: number }) {
  const user = useUserStore((s) => s.user);

  const bestElevenData = useBestElevenQuery(teamId);

  const managerMemberInfo = useMemo(() => {
    const members = bestElevenData.findManyTeamMember?.members ?? [];
    
    // 1. tactics에 저장된 최우선 감독 확인
    const primary = pickPrimaryBestElevenRow(bestElevenData.findBestEleven ?? []);
    const savedManagerId = (primary?.tactics as any)?.managerTeamMemberId;
    if (savedManagerId) {
      const saved = members.find((m: any) => {
        const numId = parseNumericIdFromRelayGlobalId(m.id);
        return String(numId) === String(savedManagerId);
      });
      if (saved) return saved;
    }

    // 2. 기본 역할 기반 감독
    return members.find((m: any) => m.role === "MANAGER") ?? null;
  }, [bestElevenData.findManyTeamMember, bestElevenData.findBestEleven]);

  const managerUser = managerMemberInfo?.user;

  const stats = useMemo(() => {
    const overall = managerMemberInfo?.overall;
    if (!overall) {
      return { total: 0, wins: 0, draws: 0, losses: 0, winRate: 0 };
    }
    const appearances = overall.appearances || 0;
    const winRate = overall.winRate || 0;
    const wins = Math.round(appearances * (winRate / 100));
    return {
      total: appearances,
      wins,
      draws: 0,
      losses: appearances - wins,
      winRate,
    };
  }, [managerMemberInfo]);

  const displayName = managerUser?.name?.trim() || user?.name?.trim() || "감독";
  const rawUrl = managerUser?.profileImage ?? getUserProfileImageRawUrl(user);
  const fallbackUrl = getUserProfileImageFallbackUrl(user);

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="relative shrink-0">
        <ProfileAvatar
          src={rawUrl || undefined}
          fallbackSrc={fallbackUrl}
          alt={`감독 ${displayName}`}
          size={56}
        />
      </div>

      <div className="text-left">
        <p className="text-gray-500 text-xs md:text-sm">감독</p>
        <p className="text-white font-bold text-base md:text-lg">{displayName}</p>
      </div>

      <div className="flex gap-2 xs:gap-4 md:gap-8 text-center flex-nowrap">
        <ManagerStatItem label="경기수" value={String(stats.total)} />
        <ManagerStatItem label="승/무/패" value={`${stats.wins}/${stats.draws}/${stats.losses}`} />
        <ManagerStatItem label="승률" value={`${stats.winRate}%`} />
      </div>
    </div>
  );
}

function ManagerInfoFallback() {
  const user = useUserStore((s) => s.user);
  const fallbackUrl = getUserProfileImageFallbackUrl(user);

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="relative shrink-0">
        <ProfileAvatar src={undefined} fallbackSrc={fallbackUrl} alt="감독" size={56} />
      </div>
      <div className="text-left">
        <p className="text-gray-500 text-xs md:text-sm">감독</p>
        <p className="text-white font-bold text-base md:text-lg">-</p>
      </div>
      <div className="flex gap-2 xs:gap-4 md:gap-8 text-center flex-nowrap">
        <ManagerStatItem label="경기수" value="-" />
        <ManagerStatItem label="승/무/패" value="-/-/-" />
        <ManagerStatItem label="팀 승률" value="-%" />
      </div>
    </div>
  );
}

const ManagerInfo = () => {
  const { selectedTeamIdNum } = useSelectedTeamId();

  if (selectedTeamIdNum == null) return <ManagerInfoFallback />;

  return (
    <Suspense fallback={<ManagerInfoFallback />}>
      <ManagerInfoInner teamId={selectedTeamIdNum} />
    </Suspense>
  );
};

const ManagerInfoWrapper = ({ isSoloTeam }: { isSoloTeam: boolean }) => (
  <div className="md:gap-6 flex-nowrap overflow-x-visible flex justify-center">
    {isSoloTeam ? <OnboardingManager /> : <ManagerInfo />}
  </div>
);

export default ManagerInfoWrapper;
