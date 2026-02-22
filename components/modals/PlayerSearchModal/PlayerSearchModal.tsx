import { useId } from "react";
import ModalLayout from "../ModalLayout";
import Button from "@/components/ui/Button";
import SearchInputSection from "./SearchInputSection";
import PlayerListSection from "./PlayerListSection";
import { Player } from "@/types/formation";
import { usePlayerSearch } from "@/hooks/usePlayerSearch";

interface PlayerSearchModalProps {
  onComplete: (player: Player) => void;
}

const PlayerSearchModal = ({ onComplete }: PlayerSearchModalProps) => {
  const id = useId();
  const {
    inputValue,
    setInputValue,
    debouncedKeyword,
    searchResults,
    selectedPlayer,
    isSearching,
    handleSelect,
    handleComplete,
  } = usePlayerSearch({ onComplete });

  return (
    <ModalLayout title="선수 검색">
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
            selectedPlayerId={selectedPlayer?.id}
            onSelect={handleSelect}
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
