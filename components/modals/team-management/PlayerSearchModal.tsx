"use client";

import { useId, useMemo } from "react";
import ModalLayout from "../ModalLayout";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { useTeamPlayerSearch } from "@/hooks/useTeamPlayerSearch";
import { Player } from "@/types/formation";
import { cn } from "@/lib/utils";
import { SearchLoadingList, SearchEmptyState } from "@/components/ui/SearchState";
import { Check } from "lucide-react";

interface PlayerSearchModalProps {
  onComplete: (player: Player) => void;
  teamPlayers?: Player[];
  excludeMercenaries?: boolean;
  targetPosition?: string | null;
  title?: string;
}

const PlayerSearchModal = ({ 
  onComplete, 
  teamPlayers = [], 
  excludeMercenaries = false,
  targetPosition = null,
  title = "선수 검색"
}: PlayerSearchModalProps) => {
  const id = useId();
  
  // 용병 제외 필터링
  const basePlayers = useMemo(() => 
    excludeMercenaries 
      ? teamPlayers.filter(p => p.position !== "용병") 
      : teamPlayers
  , [teamPlayers, excludeMercenaries]);

  const {
    inputValue,
    setInputValue,
    debouncedKeyword,
    searchResults,
    selectedPlayer,
    isSearching,
    handleSelect,
    handleComplete,
  } = useTeamPlayerSearch({ 
    onComplete, 
    teamPlayers: basePlayers 
  });

  // 추천 선수 (targetPosition과 일치하는 선수 상단 노출, 최대 5명)
  const recommendedPlayers = useMemo(() => {
    if (!targetPosition) return [];
    return basePlayers
      .filter(p => p.position === targetPosition)
      .slice(0, 5);
  }, [basePlayers, targetPosition]);

  // 검색어가 없을 때는 전체 목록 표시 (추천 선수 제외)
  const displayPlayers = useMemo(() => {
    const list = debouncedKeyword ? searchResults : basePlayers;
    // 추천 선수가 상단에 노출되므로, 목록에서는 중복 제거 (필요시)
    return list;
  }, [debouncedKeyword, searchResults, basePlayers]);

  return (
    <ModalLayout title={title}>
      <div className="flex-1 flex flex-col gap-y-6">
        <TextField
          id={id}
          label="선수명 또는 포지션"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onClear={() => setInputValue("")}
          placeholder="이름이나 포지션(예: ST, CM)으로 검색"
          className="bg-surface-secondary border-none"
        />

        <div className="flex flex-col flex-1 min-h-[300px] max-h-[500px] overflow-hidden scrollbar-hide">
          <div className="flex flex-col h-full gap-y-6 overflow-y-auto scrollbar-hide pr-1" style={{ touchAction: 'pan-y' }}>
            
            {/* 추천 선수 섹션 (검색어가 없을 때만 노출) */}
            {!debouncedKeyword && recommendedPlayers.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="font-semibold text-[10px] text-primary uppercase tracking-widest px-2 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-primary" />
                  추천 선수 ({targetPosition})
                </span>
                <div className="flex flex-col gap-y-1">
                  {recommendedPlayers.map((player) => (
                    <PlayerSearchItem 
                      key={`rec-${player.id}`}
                      player={player}
                      isSelected={selectedPlayer?.id === player.id}
                      onSelect={() => handleSelect(player)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 전체 선수단 섹션 */}
            <div className="flex flex-col gap-y-2">
              <span className="font-semibold text-[10px] text-Label-Tertiary uppercase tracking-widest px-2">
                {debouncedKeyword ? `검색 결과 (${displayPlayers.length})` : `모든 선수 (${displayPlayers.length})`}
              </span>
              
              <div className="flex flex-col gap-y-1">
                {isSearching ? (
                  <SearchLoadingList count={5} />
                ) : displayPlayers.length === 0 ? (
                  <SearchEmptyState message="검색 결과가 없습니다." />
                ) : (
                  displayPlayers.map((player) => (
                    <PlayerSearchItem 
                      key={player.id}
                      player={player}
                      isSelected={selectedPlayer?.id === player.id}
                      onSelect={() => handleSelect(player)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-auto">
          <Button
            variant="primary"
            size="xl"
            onClick={handleComplete}
            disabled={!selectedPlayer}
            className="w-full h-14 rounded-2xl text-base font-black shadow-lg shadow-primary/20"
          >
            선택 완료
          </Button>
        </div>
      </div>
    </ModalLayout>
  );
};

// 재사용 가능한 선수 아이템 컴포넌트
const PlayerSearchItem = ({ 
  player, 
  isSelected, 
  onSelect 
}: { 
  player: Player; 
  isSelected: boolean; 
  onSelect: () => void;
}) => (
  <button
    onClick={onSelect}
    className={cn(
      "w-full flex items-center justify-between p-3 rounded-xl transition-all border border-transparent",
      isSelected 
        ? "bg-primary/10 border-primary/30 text-primary" 
        : "bg-white/3 hover:bg-white/8 text-white"
    )}
  >
    <div className="flex items-center gap-3">
      <div className={cn(
        "w-8 h-6 rounded flex items-center justify-center text-[10px] font-black uppercase",
        isSelected ? "bg-primary text-black" : "bg-white/10 text-gray-400"
      )}>
        {player.position}
      </div>
      <div className="flex flex-col items-start">
        <span className="text-sm font-bold">{player.name}</span>
        <span className="text-[10px] text-gray-500 font-medium">No.{player.number}</span>
      </div>
    </div>
    
    <div className="flex items-center gap-3">
      <span className={cn(
        "text-xs font-black",
        isSelected ? "text-primary" : "text-gray-400"
      )}>
        {player.overall}
      </span>
      {isSelected && <Check size={16} className="text-primary" />}
    </div>
  </button>
);

export default PlayerSearchModal;
