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
      className="bg-[#1A1A1A] rounded-2xl w-[320px] overflow-hidden px-5 py-6 relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={hideModal}
        className="absolute top-4 right-4 z-50 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
      >
        <Icon src={closeIcon} alt="close" className="w-5 h-5 text-gray-400" />
      </button>

      {/* 선수 프로필 카드 */}
      <div className="flex flex-col items-center mt-2 px-2">
        <MainProfileCard
          imgUrl={player.image || "/images/ovr.png"}
          playerName={player.name}
          mainPosition={player.position}
          backNumber={player.ovr || 99}
          className="w-[180px] h-[250px] shadow-lg"
          grade="NORMAL_GREEN"
        />
      </div>

      {/* 탭 메뉴 */}
      <div className="flex justify-center mt-6 mb-4">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("시즌기록")}
            className={cn(
              "px-5 py-2 text-[15px] font-bold rounded-lg transition-colors",
              activeTab === "시즌기록"
                ? "bg-[#C4FF00] text-black"
                : "text-gray-400 hover:text-white"
            )}
          >
            시즌 기록
          </button>
          <button
            onClick={() => setActiveTab("누적기록")}
            className={cn(
              "px-5 py-2 text-[15px] font-bold rounded-lg transition-colors",
              activeTab === "누적기록"
                ? "bg-[#C4FF00] text-black"
                : "text-gray-400 hover:text-white"
            )}
          >
            통산 기록
          </button>
        </div>
      </div>

      {/* 스탯 그리드 (2열) */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {statItems.map(({ label, value }) => (
          <div
            key={label}
            className="bg-[#222222] rounded-xl p-3 flex flex-col justify-between h-[76px]"
          >
            <div className="flex items-center gap-1.5 opacity-80">
              <Icon
                src={STAT_ICONS[label]}
                alt={`${label} 아이콘`}
                className="w-4 h-4"
                nofill
              />
              <span className="text-[#A0A0A0] text-[13px] font-medium">{label}</span>
            </div>
            <div className="text-right text-white text-[22px] font-bold">
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* 기록 더보기 버튼 */}
      <button
        onClick={() => {
          closeAllModals();
          router.push(`/player/${encodeURIComponent(player.name)}/history`);
        }}
        className="w-full mt-5 py-3.5 rounded-xl border border-[#333333] text-[#CCCCCC] text-[15px] font-medium hover:bg-[#2A2A2A] transition-colors"
      >
        기록 더보기
      </button>
    </div>
  );
};

export default PlayerDetailModal;
