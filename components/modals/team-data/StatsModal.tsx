import Image from "next/image";
import PositionChip from "@/components/PositionChip";
import type { Player } from "@/app/(main)/team-data/_types/player";
import useModal from "@/hooks/useModal";

export interface StatsModalProps {
  category: string;
  players: Player[];
  onPlayerClick?: (player: Player) => void;
}

const StatsModal = ({ category, players, onPlayerClick }: StatsModalProps) => {
  const { hideModal } = useModal();

  const top10Players = [...players]
    .sort((a, b) => {
      const numA = parseInt(a.value.replace(/[^0-9]/g, "")) || 0;
      const numB = parseInt(b.value.replace(/[^0-9]/g, "")) || 0;
      if (numB !== numA) return numB - numA;
      return a.name.localeCompare(b.name, "ko");
    })
    .slice(0, 10);

  return (
    <div
      className="bg-[#1a1a1a] rounded-2xl w-[calc(100%-2rem)] max-w-[420px] max-h-[85vh] overflow-hidden shadow-2xl border border-gray-800 flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
        <div className="w-6" />
        <h2 className="text-xl font-bold text-white">{category}</h2>
        <button
          onClick={hideModal}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors text-xl"
        >
          ✕
        </button>
      </div>

      {/* 선수 목록 */}
      <div className="overflow-y-auto max-h-[70vh] px-6 py-4">
        <div className="flex flex-col gap-4">
          {top10Players.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center gap-4 py-2 hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer px-2 -mx-2"
              onClick={() => onPlayerClick?.(player)}
            >
              {/* 순위 - 1등은 primary, 나머지는 흰색 */}
              <span
                className={`font-black text-2xl w-8 text-center italic ${index === 0 ? "text-primary" : "text-white"}`}
              >
                {index + 1}
              </span>

              {/* 선수 이미지 */}
              <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                <Image
                  src={player.image || "/images/ovr.png"}
                  alt={player.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* 포지션 칩 + 이름 */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <PositionChip
                  position={player.position}
                  variant="filled"
                  className="text-[10px] px-1.5 py-0.5"
                />
                <span
                  className={`font-semibold text-base truncate ${index === 0 ? "text-primary" : "text-white"}`}
                >
                  {player.name}
                </span>
              </div>

              {/* 값 */}
              <span className="text-primary font-bold text-lg shrink-0">
                {player.value.replace(/[^0-9]/g, "")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
