import { useState, useEffect } from "react";
import { useDebounce } from "@toss/react";
import useModal from "@/hooks/useModal";
import { Player } from "@/types/formation";

interface UsePlayerSearchProps {
  onComplete: (player: Player) => void;
}

// TODO: 피그마 반영 및 백엔드 API 연동 시 교체될 임시 검색 함수
const mockSearchPlayers = async (keyword: string): Promise<Player[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: Date.now(),
          name: keyword,
          position: "ST",
          number: 9,
          overall: 90,
          image: "/images/player/img_player.png",
          season: "23-24",
        },
        {
          id: Date.now() + 1,
          name: `${keyword} Junior`,
          position: "LW",
          number: 11,
          overall: 85,
          image: "/images/player/img_player.png",
          season: "22-23",
        },
      ]);
    }, 500); // 가짜 딜레이
  });
};

export const usePlayerSearch = ({ onComplete }: UsePlayerSearchProps) => {
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

  // Search logic based on debounced keyword
  useEffect(() => {
    let isMounted = true;

    const performSearch = async () => {
      if (!debouncedKeyword) {
        if (isMounted) setSearchResults([]);
        return;
      }

      if (isMounted) setIsSearching(true);

      const results = await mockSearchPlayers(debouncedKeyword);

      if (isMounted) {
        setSearchResults(results);
        setIsSearching(false);
      }
    };

    performSearch();

    return () => {
      isMounted = false;
    };
  }, [debouncedKeyword]);

  const handleSelect = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleComplete = () => {
    if (selectedPlayer) {
      onComplete(selectedPlayer);
      hideModal();
    }
  };

  return {
    inputValue,
    setInputValue,
    debouncedKeyword,
    searchResults,
    selectedPlayer,
    isSearching,
    handleSelect,
    handleComplete,
    hideModal,
  };
};
