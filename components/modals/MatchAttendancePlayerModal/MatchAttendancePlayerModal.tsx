import { useId, Suspense } from "react";
import ModalLayout from "../ModalLayout";
import Button from "@/components/ui/Button";
import SearchInputSection from "./SearchInputSection";
import PlayerListSection from "./PlayerListSection";

import { usePlayerSearch } from "@/hooks/usePlayerSearch";

export interface MatchAttendancePlayerModalProps {
  matchId: number;
  teamId: number;
}

const MatchAttendancePlayerModalContent = ({
  matchId,
  teamId,
}: MatchAttendancePlayerModalProps) => {
  const id = useId();
  const {
    inputValue,
    setInputValue,
    debouncedKeyword,
    searchResults,
    pendingChanges,
    mercenaryPlayer,
    isSearching,
    handleToggleAttendance,
    handleComplete,
  } = usePlayerSearch({ matchId, teamId });

  return (
    <>
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
            pendingChanges={pendingChanges}
            onToggle={handleToggleAttendance}
          />
        </div>
        <Button
          variant="primary"
          size="xl"
          onClick={handleComplete}
          disabled={pendingChanges.size === 0}
          className="mt-auto"
        >
          완료{" "}
          {pendingChanges.size > 0 ? `(${pendingChanges.size}명 변경)` : ""}
        </Button>
      </div>
    </>
  );
};

/** 포메이션 화면 전용: 해당 매치 참석 여부·용병 추가 등을 처리하는 모달 */
const MatchAttendancePlayerModal = (props: MatchAttendancePlayerModalProps) => {
  return (
    <ModalLayout title="참석 선수 관리">
      <Suspense
        fallback={<div className="p-4 text-center">불러오는 중...</div>}
      >
        <MatchAttendancePlayerModalContent {...props} />
      </Suspense>
    </ModalLayout>
  );
};

export default MatchAttendancePlayerModal;
