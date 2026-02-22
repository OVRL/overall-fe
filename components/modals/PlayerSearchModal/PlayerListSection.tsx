import { Player } from "@/types/formation";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface PlayerListSectionProps {
  keyword: string;
  isSearching: boolean;
  results: Player[];
  selectedPlayerId?: number;
  onSelect: (player: Player) => void;
}

const PlayerListSection = ({
  keyword,
  isSearching,
  results,
  selectedPlayerId,
  onSelect,
}: PlayerListSectionProps) => {
  return (
    <div className="flex flex-col h-full pl-1">
      <span className="font-semibold text-sm leading-4 text-Label-Primary mb-2 flex-shrink-0">
        {keyword ? "검색 결과" : "추천"}
      </span>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide py-2">
        {isSearching ? (
          <div className="py-10 text-center text-Label-Tertiary text-sm">
            검색 중...
          </div>
        ) : keyword && results.length === 0 ? (
          <div className="py-10 text-center text-Label-Tertiary text-sm">
            검색 결과가 없습니다.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {results.map((player) => {
              const isSelected = selectedPlayerId === player.id;
              return (
                <li
                  key={player.id}
                  onClick={() => onSelect(player)}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors border-2",
                    isSelected
                      ? "border-Fill_AccentPrimary bg-[#262F0D]" // 선택된 상태 배경/테두리
                      : "border-transparent hover:bg-surface-secondary", // 액티브 색상 고려 (임의)
                  )}
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    <Image
                      src={player.image || "/images/player/img_player.png"}
                      alt={player.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center overflow-hidden w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold truncate text-[15px]">
                        {player.name}
                      </span>
                      {player.season && (
                        <span className="text-xs text-Label-Tertiary shrink-0 mt-0.5">
                          {player.season}
                        </span>
                      )}
                    </div>
                    <div className="flex text-xs text-Label-Secondary gap-2 mt-0.5">
                      <span className="font-medium text-Fill_AccentPrimary">
                        {player.position}
                      </span>
                      <span>OVR {player.overall}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PlayerListSection;
