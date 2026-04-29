import { useState } from "react";
import { useRouter } from "next/navigation";
import MainProfileCard from "@/components/ui/MainProfileCard";
import type { Player, StatTabType } from "@/app/(main)/team-data/_types/player";
import useModal from "@/hooks/useModal";
import { useModalStore } from "@/contexts/ModalContext";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { StaticImageData } from "next/image";

import closeIcon from "@/public/icons/close.svg";
import cleatsIcon from "@/public/icons/player-infos/cleats.svg";
import ballIcon from "@/public/icons/player-infos/ball.svg";
import signpostIcon from "@/public/icons/player-infos/signpost.svg";
import whistleIcon from "@/public/icons/player-infos/whistle.svg";
import shieldIcon from "@/public/icons/player-infos/shield.svg";
import trophyIcon from "@/public/icons/player-infos/trophy.svg";
import Button from "@/components/ui/Button";
import { getPlayerPlaceholderSrc } from "@/lib/playerPlaceholderImage";

export interface PlayerDetailModalProps {
  player: Player | null;
}

const STAT_ICONS: Record<string, StaticImageData> = {
  골: ballIcon,
  도움: cleatsIcon,
  기점: signpostIcon,
  클린시트: shieldIcon,
  승률: trophyIcon,
  출장: whistleIcon,
};

const STAT_TABS: { value: StatTabType; label: string }[] = [
  { value: "시즌기록", label: "시즌 기록" },
  { value: "통산 기록", label: "통산 기록" },
];

const TAB_BUTTON_BASE =
  "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors";
const TAB_BUTTON_ACTIVE =
  "text-Label-AccentPrimary border border-gray-1000 rounded-[0.625rem] bg-[var(--color-toast-success-bg)]";
const TAB_BUTTON_INACTIVE = "text-Label-Tertiary hover:text-white";

const PlayerDetailModal = ({ player }: PlayerDetailModalProps) => {
  const { hideModal } = useModal();
  const closeAllModals = useModalStore((state) => state.closeAll);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<StatTabType>("시즌기록");

  if (!player) return null;

  const seasonStats = player.stats || {
    출장: 25,
    오버롤: player.ovr || 99,
    골: 16,
    어시: 4,
    기점: 5,
    클린시트: 24,
    주발: "R",
    승률: "56%",
  };

  const cumulativeStats = player.cumulativeStats || {
    출장: 150,
    오버롤: player.ovr || 99,
    골: 60,
    어시: 20,
    기점: 40,
    클린시트: 45,
    주발: seasonStats.주발 || "R",
    승률: "55%",
  };

  const currentStats = activeTab === "시즌기록" ? seasonStats : cumulativeStats;

  const statItems = [
    { label: "골", value: currentStats.골 },
    { label: "도움", value: currentStats.어시 ?? currentStats.도움 ?? 0 },
    { label: "기점", value: currentStats.기점 },
    { label: "클린시트", value: currentStats.클린시트 },
    { label: "승률", value: currentStats.승률 },
    { label: "출장", value: currentStats.출장 },
  ];

  return (
    <div
      className="bg-surface-card rounded-2xl w-82.5 overflow-hidden p-4 relative flex flex-col gap-4"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={hideModal}
        className="absolute top-0 right-0 p-3 z-50 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
      >
        <Icon src={closeIcon} alt="close" className="w-5 h-5 text-gray-400" />
      </button>

      {/* 선수 프로필 카드 */}
      <div className="flex flex-col items-center mt-2 px-2">
        <MainProfileCard
          imgUrl={player.image}
          imgFallbackSrc={
            player.imageFallbackUrl ??
            getPlayerPlaceholderSrc(`m:${player.id}`)
          }
          playerName={player.name}
          mainPosition={player.position}
          backNumber={player.ovr || 99}
          className="w-32 h-42 shadow-lg"
          grade="NORMAL_GREEN"
        />
      </div>

      {/* 탭 메뉴 */}
      <div className="flex justify-center">
        <div className="flex gap-4">
          {STAT_TABS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setActiveTab(value)}
              className={cn(
                TAB_BUTTON_BASE,
                activeTab === value ? TAB_BUTTON_ACTIVE : TAB_BUTTON_INACTIVE,
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 스탯 그리드 (2열) */}
      <div className="grid grid-cols-2 gap-2">
        {statItems.map(({ label, value }) => (
          <div
            key={label}
            className="bg-[#555555]/10 rounded-xl relative flex flex-col justify-between h-14 backdrop-blur-[0.625rem]"
          >
            <div className="flex items-center gap-1.5 opacity-80 absolute top-1.5 left-1.5">
              <Icon
                src={STAT_ICONS[label]}
                alt={`${label} 아이콘`}
                width={20}
                height={20}
                nofill
              />
              <span className="text-[0.6875rem] text-gray-400">{label}</span>
            </div>
            <strong className="absolute bottom-1.5 right-1.5 text-[#f7f8f8] text-sm font-bold">
              {value}
            </strong>
          </div>
        ))}
      </div>

      {/* 기록 더보기 버튼 */}
      <Button
        onClick={() => {
          closeAllModals(); // hideModal() 대신 모든 모달 닫기 (팀 데이터 구조상 다른 팝업이 겹쳐있을 수 있으므로 확실히 닫기 위함)
          const imgParam = encodeURIComponent(
            player.image || "/images/ovr.png",
          );
          const params = new URLSearchParams({ imgUrl: imgParam });
          if (player.backNumber != null) params.set("backNumber", String(player.backNumber));
          router.push(`/player/${encodeURIComponent(player.name)}?${params.toString()}`);
        }}
        variant="line"
        size="m"
      >
        기록 더보기
      </Button>
    </div>
  );
};

export default PlayerDetailModal;
