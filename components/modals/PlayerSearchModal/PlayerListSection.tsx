import { Player } from "@/types/formation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  SearchLoadingList,
  SearchEmptyState,
} from "@/components/ui/SearchState";

interface PlayerListSectionProps {
  keyword: string;
  isSearching: boolean;
  results: Player[];
  selectedPlayerId?: number;
  onSelect: (player: Player) => void;
}

/**
 * 개별 플레이어 아이템 컴포넌트
 */
const PlayerItem = ({
  player,
  isSelected,
  onSelect,
}: {
  player: Player;
  isSelected: boolean;
  onSelect: (player: Player) => void;
}) => (
  <li
    onClick={() => onSelect(player)}
    className={cn(
      "flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors border-2",
      isSelected
        ? "border-Fill_AccentPrimary bg-[#262F0D]"
        : "border-transparent hover:bg-surface-secondary",
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

/**
 * 플레이어 리스트 렌더링 컴포넌트
 */
const PlayerList = ({
  results,
  selectedPlayerId,
  onSelect,
}: {
  results: Player[];
  selectedPlayerId?: number;
  onSelect: (player: Player) => void;
}) => (
  <ul className="flex flex-col gap-2">
    {results.map((player) => (
      <PlayerItem
        key={player.id}
        player={player}
        isSelected={selectedPlayerId === player.id}
        onSelect={onSelect}
      />
    ))}
  </ul>
);

const PlayerListSection = ({
  keyword,
  isSearching,
  results,
  selectedPlayerId,
  onSelect,
}: PlayerListSectionProps) => {
  const renderContent = () => {
    if (isSearching) return <SearchLoadingList count={5} />;
    if (keyword && results.length === 0) {
      return <SearchEmptyState message="검색 결과가 없습니다." />;
    }
    return (
      <PlayerList
        results={results}
        selectedPlayerId={selectedPlayerId}
        onSelect={onSelect}
      />
    );
  };

  return (
    <div className="flex flex-col h-full pl-1">
      <span className="font-semibold text-sm leading-4 text-Label-Primary mb-2">
        {keyword ? "검색 결과" : "추천"}
      </span>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide py-2">
        {renderContent()}
      </div>
    </div>
  );
};

export default PlayerListSection;
