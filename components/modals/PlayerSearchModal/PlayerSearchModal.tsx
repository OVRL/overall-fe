import { useId } from "react";
import ModalLayout from "../ModalLayout";
import Button from "@/components/ui/Button";
import SearchInputSection from "./SearchInputSection";
import PlayerListSection from "./PlayerListSection";
import { Player } from "@/types/formation";
import { usePlayerSearch } from "@/hooks/usePlayerSearch";
import { useTeamPlayerSearch } from "@/hooks/useTeamPlayerSearch";

interface PlayerSearchModalProps {
  onComplete: (player: Player) => void;
  excludeMercenaries?: boolean;
  isTeamSearch?: boolean;
  teamPlayers?: Player[];
}

const PlayerSearchModal = ({ 
  onComplete, 
  excludeMercenaries, 
  isTeamSearch, 
  teamPlayers 
}: PlayerSearchModalProps) => {
  const id = useId();
  
  // 상황에 맞는 훅 선택
  const searchHook = isTeamSearch ? useTeamPlayerSearch : usePlayerSearch;
  
  const {
    inputValue,
    setInputValue,
    debouncedKeyword,
    searchResults,
    selectedPlayer,
    mercenaryPlayer,
    isSearching,
    handleSelect,
    handleComplete,
  } = searchHook({ onComplete, teamPlayers } as any);

  return (
    <ModalLayout title={isTeamSearch ? "팀 선수 검색" : "선수 검색"}>
      <div className="flex-1 flex flex-col gap-y-8">
        <SearchInputSection
          id={id}
          value={inputValue}
          onChange={setInputValue}
        />
        <div className="flex flex-col flex-1 min-h-[200px] max-h-[400px] overflow-hidden">
          <PlayerListSection
            keyword={debouncedKeyword}
            isSearching={isSearching}
            results={searchResults}
            mercenary={mercenaryPlayer}
            selectedPlayerId={selectedPlayer?.id}
            onSelect={handleSelect}
            excludeMercenaries={excludeMercenaries}
          />
        </div>
        <Button
          variant="primary"
          size="xl"
          onClick={handleComplete}
          disabled={!selectedPlayer}
          className="mt-auto"
        >
          완료
        </Button>
      </div>
    </ModalLayout>
  );
};

export default PlayerSearchModal;
