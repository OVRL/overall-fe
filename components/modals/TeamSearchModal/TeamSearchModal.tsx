"use client";

import { useId } from "react";
import ModalLayout from "../ModalLayout";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import TeamListSection from "./TeamListSection";
import { useTeamSearch } from "@/hooks/useTeamSearch";
import type { TeamSearchResult } from "@/hooks/useTeamSearch";

interface TeamSearchModalProps {
  onComplete: (result: TeamSearchResult) => void;
}

const TeamSearchModal = ({ onComplete }: TeamSearchModalProps) => {
  const id = useId();
  const {
    inputValue,
    setInputValue,
    debouncedKeyword,
    searchResults,
    selectedTeam,
    externalTeam,
    isSearching,
    handleSelect,
    handleComplete,
  } = useTeamSearch({ onComplete });

  return (
    <ModalLayout title="상대팀 검색">
      <div className="flex-1 flex flex-col gap-y-8">
        <TextField
          id={id}
          label="팀 이름"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onClear={() => setInputValue("")}
          placeholder="팀 이름으로 검색하기"
        />
        <div className="flex flex-col flex-1 min-h-[200px] max-h-[400px] overflow-hidden">
          <TeamListSection
            keyword={debouncedKeyword}
            isSearching={isSearching}
            results={searchResults}
            externalTeam={externalTeam}
            selectedTeam={selectedTeam}
            onSelect={handleSelect}
          />
        </div>
        <Button
          variant="primary"
          size="xl"
          onClick={handleComplete}
          disabled={!selectedTeam}
          className="mt-auto"
        >
          확인
        </Button>
      </div>
    </ModalLayout>
  );
};

export default TeamSearchModal;
