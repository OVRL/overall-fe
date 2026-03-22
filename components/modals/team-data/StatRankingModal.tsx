import type { Player } from "@/app/(main)/team-data/_types/player";
import ModalLayout from "../ModalLayout";
import StatsPlayerRow from "./_components/StatsPlayerRow";

export interface StatRankingModalProps {
  category: string;
  players: Player[];
  onPlayerClick?: (player: Player) => void;
}

const StatRankingModal = ({
  category,
  players,
  onPlayerClick,
}: StatRankingModalProps) => {
  const top10Players = [...players]
    .sort((a, b) => {
      const numA = parseInt(String(a.value).replace(/[^0-9]/g, ""), 10) || 0;
      const numB = parseInt(String(b.value).replace(/[^0-9]/g, ""), 10) || 0;
      if (numB !== numA) return numB - numA;
      return a.name.localeCompare(b.name, "ko");
    })
    .slice(0, 10);

  return (
    <ModalLayout
      title={category}
      wrapperClassName="gap-y-6"
      closeButtonClassName="text-gray-600"
    >
      {/* 선수 목록 */}
      <div className="overflow-y-auto max-h-[70vh] px-2">
        <ul className="flex flex-col gap-4">
          {top10Players.map((player, index) => (
            <StatsPlayerRow
              key={player.id}
              player={player}
              index={index}
              onPlayerClick={onPlayerClick}
            />
          ))}
        </ul>
      </div>
    </ModalLayout>
  );
};

export default StatRankingModal;
