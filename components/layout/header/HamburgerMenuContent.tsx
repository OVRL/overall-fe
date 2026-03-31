"use client";

import { Suspense, useMemo } from "react";
import Link from "@/components/Link";
import Icon from "@/components/ui/Icon";
import Skeleton from "@/components/ui/Skeleton";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import {
  parseNumericIdFromRelayGlobalId,
  isSameTeamId,
  normalizeRelayTeamGlobalId,
} from "@/lib/relay/parseRelayGlobalId";
import { cn } from "@/lib/utils";
import { useFindTeamMemberForHeader } from "@/components/layout/header/useFindTeamMemberForHeaderQuery";
import { useUserId } from "@/hooks/useUserId";
import userIcon from "@/public/icons/user.svg";
import plusIcon from "@/public/icons/plus.svg";
import { useBridgeRouter } from "@/hooks/bridge/useBridgeRouter";
import { LogoutButton } from "@/components/layout/header/LogoutButton";
import { EmblemImage } from "@/components/ui/EmblemImage";

type HamburgerMenuContentProps = {
  /** 메뉴 닫기 (팀 선택·링크 클릭 후 호출) */
  onClose: () => void;
};

/**
 * PC 햄버거 클릭 시 노출되는 메뉴 내용.
 * 내 정보, 로그아웃, 팀 목록 UI만 담당 (SRP).
 */
export function HamburgerMenuContent({ onClose }: HamburgerMenuContentProps) {
  const router = useBridgeRouter();
  const { selectedTeamId, setSelectedTeamId } = useSelectedTeamId();
  const userId = useUserId();

  const handleTeamSelect = (
    teamId: string,
    teamName: string,
    teamImageUrl: string | null,
  ) => {
    const teamIdNum = parseNumericIdFromRelayGlobalId(teamId);
    // 뱃지 등에서 선택 팀 이름·이미지가 바로 반영되도록 전달 (클럽 생성 플로우와 동일)
    setSelectedTeamId(teamId, teamIdNum, teamName, teamImageUrl);
    onClose();
    // 쿠키 반영 후 서버 컴포넌트 재요청으로 레이아웃·데이터 갱신 (전체 reload 대신)
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-1 min-w-48">
      {/* 내 정보 */}
      <Link
        href="/profile"
        onClick={onClose}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-colors",
          "text-sm font-medium text-Label-Primary hover:bg-surface-elevated",
        )}
        aria-label="내 정보"
      >
        <Icon src={userIcon} alt="" width={24} height={24} nofill />
        <span>내 정보</span>
      </Link>

      {/* 로그인 시에만 findTeamMember(userId) — Relay는 캐시 미스 시 suspend */}
      {userId !== null ? (
        <Suspense fallback={<HamburgerTeamListSkeleton />}>
          <HamburgerTeamListSection
            userId={userId}
            selectedTeamId={selectedTeamId}
            onTeamSelect={handleTeamSelect}
          />
        </Suspense>
      ) : null}
      {/* 팀 만들기 */}
      <Link
        href="/create-team"
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors",
          "text-sm font-semibold text-Label-Primary",
          "hover:bg-surface-elevated",
        )}
      >
        <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
          <Icon src={plusIcon} alt="" width={24} height={24} nofill />
        </div>
        <span className="min-w-0 flex-1 truncate">팀 만들기</span>
      </Link>
      <div
        className="my-1 h-px w-full shrink-0 bg-gray-1000"
        role="separator"
      />

      <LogoutButton onClose={onClose} />
    </div>
  );
}

/** 팀 목록 fetch 중 툴팁 레이아웃 유지용 스켈레톤 */
function HamburgerTeamListSkeleton() {
  return (
    <div
      className="flex flex-col gap-1"
      aria-busy="true"
      aria-label="팀 목록 불러오는 중"
    >
      <div
        className="my-1 h-px w-full shrink-0 bg-gray-1000"
        role="separator"
      />
      <span className="h-10 flex items-center text-gray-600 text-xs font-semibold">
        팀 선택
      </span>
      <div className="flex flex-col gap-2 max-h-48 py-0.5">
        <Skeleton className="h-10 w-full rounded-lg bg-gray-800" shimmer />
        <Skeleton className="h-10 w-full rounded-lg bg-gray-800" shimmer />
      </div>
    </div>
  );
}

/** useLazyLoadQuery 호출 분리: suspend 시 상위 메뉴는 그대로, 이 구간만 fallback */
function HamburgerTeamListSection({
  userId,
  selectedTeamId,
  onTeamSelect,
}: {
  userId: number;
  selectedTeamId: string | null;
  onTeamSelect: (
    teamId: string,
    teamName: string,
    teamImageUrl: string | null,
  ) => void;
}) {
  const members = useFindTeamMemberForHeader(userId);

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

  return (
    <>
      <div
        className="my-1 h-px w-full shrink-0 bg-gray-1000"
        role="separator"
      />
      <span className="h-10 flex items-center text-gray-600 text-xs font-semibold">
        팀 선택
      </span>
      <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto">
        {teams.map((team) => (
          <TeamRow
            key={team.id}
            name={team.name}
            imageUrl={team.imageUrl}
            isSelected={isSameTeamId(selectedTeamId, team.id)}
            onSelect={() => onTeamSelect(team.id, team.name, team.imageUrl)}
          />
        ))}
      </div>
    </>
  );
}

/** 팀 한 줄 (TeamSelector 옵션 스타일 참고) */
function TeamRow({
  name,
  imageUrl,
  isSelected,
  onSelect,
}: {
  name: string;
  imageUrl: string | null;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors",
        "text-sm font-semibold text-Label-Primary",
        isSelected && "bg-surface-elevated",
        "hover:bg-surface-elevated",
      )}
    >
      <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
        <EmblemImage src={imageUrl} alt="" sizes="1.5rem" />
      </div>
      <span className="min-w-0 flex-1 truncate">{name}</span>
      {isSelected && (
        <span
          className="h-1 w-1 shrink-0 rounded-full bg-Label-AccentPrimary"
          aria-hidden
        />
      )}
    </button>
  );
}
