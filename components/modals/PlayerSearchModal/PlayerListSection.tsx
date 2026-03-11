import { Player } from "@/types/formation";
import PlayerItem from "./_components/PlayerItem";
import {
  SearchLoadingList,
  SearchEmptyState,
} from "@/components/ui/SearchState";

interface PlayerListSectionProps {
  keyword: string;
  isSearching: boolean;
  results: Player[];
  mercenary: Player | null;
  selectedPlayerId?: number;
  onSelect: (player: Player) => void;
}

const PlayerListSection = ({
  keyword,
  isSearching,
  results,
  mercenary,
  selectedPlayerId,
  onSelect,
}: PlayerListSectionProps) => {
  const renderPlayerList = () => {
    if (isSearching) {
      return <SearchLoadingList count={3} />;
    }

    if (keyword && results.length === 0) {
      return <SearchEmptyState message="검색 결과가 없습니다." />;
    }

    return (
      <ul className="flex flex-col">
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
  };

  return (
    <div className="flex flex-col h-full pl-1 gap-y-6">
      {/* 선수단 섹션 */}
      <div className="flex flex-col gap-y-2">
        <span className="font-semibold text-sm leading-4 text-Label-Primary">
          선수단
        </span>
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide py-1">
          {renderPlayerList()}
        </div>
      </div>

      {/* 용병으로 추가 섹션 */}
      {mercenary && !isSearching && (
        <div className="flex flex-col gap-y-2">
          <span className="font-semibold text-sm leading-4 text-Label-Primary">
            용병으로 추가
          </span>
          <PlayerItem
            player={mercenary}
            isSelected={selectedPlayerId === mercenary.id}
            onSelect={onSelect}
          />
        </div>
      )}
    </div>
  );
};

export default PlayerListSection;
