import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "@toss/react";
import useModal from "@/hooks/useModal";
import { Player } from "@/types/formation";

interface UseTeamPlayerSearchProps {
  onComplete: (player: Player) => void;
  teamPlayers?: Player[]; // 미리 제공된 팀 선수 목록이 있는 경우 사용
}

export const useTeamPlayerSearch = ({ onComplete, teamPlayers = [] }: UseTeamPlayerSearchProps) => {
  const { hideModal } = useModal();
  const [inputValue, setInputValue] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedUpdate = useDebounce((value: string) => {
    setDebouncedKeyword(value.trim());
  }, 300);

  // Update debounced keyword when input changes
  useEffect(() => {
    debouncedUpdate(inputValue);
  }, [inputValue, debouncedUpdate]);

  // Search logic based on debounced keyword within teamPlayers
  useEffect(() => {
    if (!debouncedKeyword) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // 로컬 검색 수행 (팀 멤버 검색이므로 보통 클라이언트 사이드에서 가능하거나 별도 API 호출 필요)
    // 여기서는 제공된 teamPlayers에서 검색하거나, 없을 경우 빈 배열 반환
    const filtered = teamPlayers.filter(p => 
      p.name.toLowerCase().includes(debouncedKeyword.toLowerCase()) ||
      p.position?.toLowerCase().includes(debouncedKeyword.toLowerCase())
    );

    setSearchResults(filtered);
    setIsSearching(false);
  }, [debouncedKeyword, teamPlayers]);

  const handleSelect = (player: Player) => {
    setSelectedPlayer((prev) => (prev?.id === player.id ? null : player));
  };

  const handleComplete = () => {
    if (selectedPlayer) {
      onComplete(selectedPlayer);
      hideModal();
    }
  };

  const isLoading = isSearching || inputValue !== debouncedKeyword;

  return {
    inputValue,
    setInputValue,
    debouncedKeyword,
    searchResults,
    selectedPlayer,
    isSearching: isLoading,
    handleSelect,
    handleComplete,
    hideModal,
    mercenaryPlayer: null, // 팀 검색에서는 용병 제외가 일반적이나 필요시 추가 가능
  };
};
