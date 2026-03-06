import { useState } from "react";
import MainProfileCard from "@/components/ui/MainProfileCard";
import type { Player, StatTabType } from "@/app/(main)/team-data/_types/player";
import useModal from "@/hooks/useModal";
import StatTabMenu from "./_components/StatTabMenu";
import StatGrid from "./_components/StatGrid";
import Icon from "@/components/ui/Icon";
import close from "@/public/icons/close.svg";

export interface PlayerDetailModalProps {
  player: Player | null;
}

const PlayerDetailModal = ({ player }: PlayerDetailModalProps) => {
  const { hideModal } = useModal();
  const [activeTab, setActiveTab] = useState<StatTabType>("시즌기록");

  if (!player) return null;

  const seasonStats = player.stats || {
    출장: 25,
    오버롤: player.ovr,
    골: 40,
    어시: 24,
    기점: 16,
    클린시트: 60,
    주발: "R",
    승률: "50%",
  };

  const cumulativeStats = player.cumulativeStats || {
    출장: 150,
    오버롤: player.ovr,
    골: 200,
    어시: 80,
    기점: 280,
    클린시트: 45,
    주발: seasonStats.주발,
    승률: "55%",
  };

  const currentStats = activeTab === "시즌기록" ? seasonStats : cumulativeStats;

  return (
    <div
      className="bg-surface-card rounded-xl w-82.5 overflow-hidden px-2 py-6 relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={hideModal}
        className="absolute top-1.25 right-1.25 p-3 z-50 cursor-pointer"
      >
        <Icon src={close} alt="close" />
      </button>

      {/* 선수 프로필 카드 */}
      <div className="flex flex-col items-center px-8 pb-4">
        <MainProfileCard
          imgUrl={player.image || "/images/ovr.png"}
          playerName={player.name}
          mainPosition={player.position}
          backNumber={player.backNumber}
        />
      </div>

      {/* 탭 메뉴 */}
      <StatTabMenu activeTab={activeTab} onChange={setActiveTab} />

      {/* 스탯 그리드 */}
      <StatGrid stats={currentStats} />
    </div>
  );
};

export default PlayerDetailModal;
