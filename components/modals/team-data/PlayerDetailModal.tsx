import { useState } from "react";
import MainProfileCard from "@/components/ui/MainProfileCard";
import FootIcon from "@/app/(main)/team-data/_components/FootIcon";
import type { Player } from "@/app/(main)/team-data/_types/player";
import useModal from "@/hooks/useModal";

export interface PlayerDetailModalProps {
  player: Player | null;
}

const PlayerDetailModal = ({ player }: PlayerDetailModalProps) => {
  const { hideModal } = useModal();
  const [activeTab, setActiveTab] = useState<"시즌기록" | "통산기록">(
    "시즌기록",
  );

  if (!player) return null;

  const seasonStats = player.stats || {
    출장: 25,
    오버롤: player.ovr,
    골: 40,
    어시: 24,
    기점: 16,
    클린시트: 60,
    주발: "R" as const,
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

  const statItems = [
    { label: "출장", value: currentStats.출장 },
    { label: "오버롤", value: currentStats.오버롤 },
    { label: "골", value: currentStats.골 },
    { label: "어시", value: currentStats.어시 },
    { label: "기점", value: currentStats.기점 },
    { label: "클린시트", value: currentStats.클린시트 },
    { label: "주발", value: currentStats.주발, isFoot: true },
    { label: "승률", value: currentStats.승률 },
  ];

  return (
    <div
      className="bg-[#2a2a2a] rounded-3xl w-[calc(100%-2rem)] max-w-[380px] overflow-hidden shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 닫기 버튼 */}
      <div className="flex justify-end p-4">
        <button
          onClick={hideModal}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors text-2xl"
        >
          ✕
        </button>
      </div>

      {/* 선수 프로필 카드 */}
      <div className="flex flex-col items-center px-8 pb-4">
        <MainProfileCard
          imgUrl={player.image || "/images/ovr.png"}
          playerName={player.name}
          mainPosition={player.position}
          backNumber={player.backNumber}
          className="w-48 h-64"
          nameClassName="text-3xl"
          numberClassName="text-5xl"
          positionClassName="text-sm px-2.5 py-1"
        />
      </div>

      {/* 탭 메뉴 */}
      <div className="flex justify-center gap-4 px-6 pb-4">
        <button
          onClick={() => setActiveTab("시즌기록")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            activeTab === "시즌기록"
              ? "bg-primary text-black"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          시즌기록
        </button>
        <button
          onClick={() => setActiveTab("통산기록")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            activeTab === "통산기록"
              ? "bg-primary text-black"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          통산기록
        </button>
      </div>

      {/* 스탯 그리드 */}
      <div className="grid grid-cols-2 gap-y-5 gap-x-6 px-8 pb-8">
        {statItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-gray-400 text-sm min-w-14">{item.label}</span>
            {item.isFoot ? (
              <FootIcon foot={item.value as "L" | "R" | "B"} />
            ) : (
              <span className="text-white font-bold text-base">
                {item.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerDetailModal;
