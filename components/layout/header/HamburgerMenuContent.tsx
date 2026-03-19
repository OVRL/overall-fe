"use client";

import Image from "next/image";
import Link from "@/components/Link";
import Icon from "@/components/ui/Icon";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import {
  parseNumericIdFromRelayGlobalId,
  isSameTeamId,
} from "@/lib/relay/parseRelayGlobalId";
import { cn } from "@/lib/utils";
import { useFindManyTeamQuery } from "@/components/layout/header/useFindManyTeamQuery";
import userIcon from "@/public/icons/user.svg";
import plusIcon from "@/public/icons/plus.svg";
import { useBridgeRouter } from "@/hooks/bridge/useBridgeRouter";
import { LogoutButton } from "@/components/layout/header/LogoutButton";

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
  const { teams } = useFindManyTeamQuery();
  const { selectedTeamId, setSelectedTeamId } = useSelectedTeamId();

  const handleTeamSelect = (teamId: string) => {
    const teamIdNum = parseNumericIdFromRelayGlobalId(teamId);
    setSelectedTeamId(teamId, teamIdNum);
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
        <Icon src={userIcon} alt="" width={20} height={20} nofill />
        <span>내 정보</span>
      </Link>

      {/* 구분선 + 팀 목록 */}
      {teams.length > 0 && (
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
                onSelect={() => handleTeamSelect(team.id)}
              />
            ))}
          </div>
        </>
      )}
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

/** 팀 한 줄 (TeamSelector 옵션 스타일 참고) */
function TeamRow({
  name,
  imageUrl,
  isSelected,
  onSelect,
}: {
  name: string;
  imageUrl: string;
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
        <Image src={imageUrl} alt="" fill className="object-cover" />
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
